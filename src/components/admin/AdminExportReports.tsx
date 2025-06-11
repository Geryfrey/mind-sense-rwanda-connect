
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileText, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type TimeframeType = "today" | "week" | "month" | "quarter" | "year" | "all";

interface AssessmentData {
  id: string;
  user_id: string;
  text_input: string;
  sentiment_score: number;
  risk_level: string;
  tags: string[] | null;
  created_at: string;
  profiles?: {
    reg_number: string | null;
    email: string | null;
  } | null;
}

const AdminExportReports: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>("month");
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const timeframeOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "all", label: "All Time" },
  ];

  const getDateRange = (timeframe: TimeframeType) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (timeframe) {
      case "today":
        return { start: startOfToday.toISOString(), end: now.toISOString() };
      case "week":
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        return { start: startOfWeek.toISOString(), end: now.toISOString() };
      case "month":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: startOfMonth.toISOString(), end: now.toISOString() };
      case "quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
        return { start: startOfQuarter.toISOString(), end: now.toISOString() };
      case "year":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return { start: startOfYear.toISOString(), end: now.toISOString() };
      case "all":
        return { start: "2020-01-01T00:00:00Z", end: now.toISOString() };
    }
  };

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const { start, end } = getDateRange(timeframe);
      
      // First get assessments with new schema
      let assessmentQuery = supabase
        .from('assessments')
        .select('id, user_id, text_input, sentiment_score, risk_level, tags, created_at')
        .order('created_at', { ascending: false });

      if (timeframe !== "all") {
        assessmentQuery = assessmentQuery
          .gte('created_at', start)
          .lte('created_at', end);
      }

      const { data: assessmentData, error: assessmentError } = await assessmentQuery;

      if (assessmentError) {
        console.error("Error fetching assessments:", assessmentError);
        toast({
          title: "Error",
          description: "Failed to fetch assessment data.",
          variant: "destructive",
        });
        return;
      }

      // Then get profiles for each user
      const userIds = [...new Set(assessmentData?.map(a => a.user_id) || [])];
      
      if (userIds.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, reg_number, email')
          .in('user_id', userIds);

        if (profileError) {
          console.error("Error fetching profiles:", profileError);
        }

        // Combine the data
        const combinedData = assessmentData?.map(assessment => ({
          ...assessment,
          profiles: profileData?.find(p => p.user_id === assessment.user_id) || null
        })) || [];

        setAssessments(combinedData);
      } else {
        setAssessments([]);
      }
    } catch (error) {
      console.error("Error in fetchAssessments:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [timeframe]);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = [
        "Assessment ID",
        "Student Name",
        "Registration Number",
        "Email",
        "Text Input",
        "Sentiment Score",
        "Risk Level",
        "Tags",
        "Date",
        "Time"
      ];

      const csvData = assessments.map(assessment => [
        assessment.id,
        assessment.profiles?.reg_number || assessment.profiles?.email || "N/A",
        assessment.profiles?.reg_number || "N/A",
        assessment.profiles?.email || "N/A",
        assessment.text_input.replace(/"/g, '""'), // Escape quotes in text
        assessment.sentiment_score,
        assessment.risk_level,
        assessment.tags?.join(", ") || "N/A",
        new Date(assessment.created_at).toLocaleDateString(),
        new Date(assessment.created_at).toLocaleTimeString()
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `mental_health_assessments_${timeframe}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Downloaded ${assessments.length} assessment records.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getSummaryStats = () => {
    if (assessments.length === 0) return null;

    const avgSentiment = assessments.reduce((sum, a) => sum + a.sentiment_score, 0) / assessments.length;
    const riskCounts = {
      low: assessments.filter(a => a.risk_level === 'low').length,
      moderate: assessments.filter(a => a.risk_level === 'moderate').length,
      high: assessments.filter(a => a.risk_level === 'high').length,
    };

    return { avgSentiment, riskCounts };
  };

  const summaryStats = getSummaryStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export Reports</h1>
        <p className="text-gray-600 mt-2">View and export mental health assessment data</p>
      </div>

      {/* Timeframe Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Timeframe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={timeframe} onValueChange={(value: TimeframeType) => setTimeframe(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchAssessments} disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-bold">{assessments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Sentiment</p>
                  <p className="text-2xl font-bold">{summaryStats.avgSentiment.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">L</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Risk</p>
                  <p className="text-2xl font-bold">{summaryStats.riskCounts.low}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold">H</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold">{summaryStats.riskCounts.high}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Preview and Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assessment Data Preview
            </CardTitle>
            <Button 
              onClick={exportToCSV} 
              disabled={assessments.length === 0 || isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading assessment data...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No assessment data found for the selected timeframe.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Reg Number</th>
                    <th className="text-left p-2">Sentiment</th>
                    <th className="text-left p-2">Risk Level</th>
                    <th className="text-left p-2">Tags</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.slice(0, 10).map((assessment) => (
                    <tr key={assessment.id} className="border-b">
                      <td className="p-2">{assessment.profiles?.reg_number || assessment.profiles?.email || "N/A"}</td>
                      <td className="p-2">{assessment.profiles?.reg_number || "N/A"}</td>
                      <td className="p-2">{assessment.sentiment_score.toFixed(2)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          assessment.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                          assessment.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assessment.risk_level}
                        </span>
                      </td>
                      <td className="p-2">{assessment.tags?.slice(0, 2).join(", ") || "N/A"}</td>
                      <td className="p-2">{new Date(assessment.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {assessments.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 10 records. Export to see all {assessments.length} records.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminExportReports;
