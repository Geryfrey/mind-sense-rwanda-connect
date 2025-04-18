
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useML, AssessmentResult } from "@/context/MLContext";
import { useAuth } from "@/context/AuthContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Download, Users, AlertTriangle, FileText, BarChart2, PieChart as PieChartIcon, ChevronDown } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  email: string;
  assessmentCount: number;
  lastAssessment: Date | null;
  highRiskCount: number;
}

const AdminDashboard: React.FC = () => {
  const { assessmentHistory } = useML();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  // Mock student data for demonstration
  const students: StudentData[] = [
    { id: "1", name: "John Smith", email: "john@example.com", assessmentCount: 5, lastAssessment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), highRiskCount: 1 },
    { id: "2", name: "Maria Garcia", email: "maria@example.com", assessmentCount: 3, lastAssessment: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), highRiskCount: 0 },
    { id: "3", name: "Emmanuel Kwizera", email: "emmanuel@example.com", assessmentCount: 7, lastAssessment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), highRiskCount: 2 },
    { id: "4", name: "Sophia Chen", email: "sophia@example.com", assessmentCount: 2, lastAssessment: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), highRiskCount: 0 },
    { id: "5", name: "Jean-Pierre Habimana", email: "jeanpierre@example.com", assessmentCount: 4, lastAssessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), highRiskCount: 1 }
  ];

  // Mock assessment data aggregations
  const allAssessments = [...assessmentHistory];
  
  // Calculate statistics from assessments
  const totalAssessments = allAssessments.length;
  const riskCounts = {
    low: allAssessments.filter(a => a.riskLevel === 'low').length,
    moderate: allAssessments.filter(a => a.riskLevel === 'moderate').length,
    high: allAssessments.filter(a => a.riskLevel === 'high').length
  };
  
  // Calculate average sentiment
  const averageSentiment = allAssessments.length > 0
    ? allAssessments.reduce((sum, a) => sum + a.sentiment, 0) / allAssessments.length
    : 0;
  
  // Calculate average emotions
  const averageEmotions = allAssessments.length > 0
    ? {
        joy: allAssessments.reduce((sum, a) => sum + a.emotions.joy, 0) / allAssessments.length,
        sadness: allAssessments.reduce((sum, a) => sum + a.emotions.sadness, 0) / allAssessments.length,
        anger: allAssessments.reduce((sum, a) => sum + a.emotions.anger, 0) / allAssessments.length,
        fear: allAssessments.reduce((sum, a) => sum + a.emotions.fear, 0) / allAssessments.length,
      }
    : { joy: 0, sadness: 0, anger: 0, fear: 0 };
  
  // Prepare data for charts
  const riskData = [
    { name: 'Low Risk', value: riskCounts.low, color: '#22c55e' },
    { name: 'Moderate Risk', value: riskCounts.moderate, color: '#eab308' },
    { name: 'High Risk', value: riskCounts.high, color: '#ef4444' }
  ];
  
  const emotionData = [
    { name: 'Joy', value: averageEmotions.joy * 100, color: '#22c55e' },
    { name: 'Sadness', value: averageEmotions.sadness * 100, color: '#3b82f6' },
    { name: 'Anger', value: averageEmotions.anger * 100, color: '#ef4444' },
    { name: 'Fear', value: averageEmotions.fear * 100, color: '#eab308' }
  ];
  
  // Export student assessment data as CSV
  const exportStudentData = () => {
    setIsExporting(true);
    
    try {
      // In a real app, this would be data from the database
      const header = ["ID", "Name", "Email", "Assessments", "Last Assessment", "High Risk Count"];
      
      const rows = students.map(student => [
        student.id,
        student.name,
        student.email,
        student.assessmentCount.toString(),
        student.lastAssessment ? format(student.lastAssessment, "yyyy-MM-dd") : "Never",
        student.highRiskCount.toString()
      ]);
      
      const csvContent = [
        header.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `student-assessments-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Toggle expanded student
  const toggleExpandStudent = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-3xl font-bold">{students.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-500 mr-3" />
              <div className="text-3xl font-bold">{totalAssessments}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">High Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <div className="text-3xl font-bold">
                {students.filter(s => s.highRiskCount > 0).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Risk Level Distribution</CardTitle>
                <CardDescription>Assessment outcomes by risk category</CardDescription>
              </div>
              <PieChartIcon className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Emotion Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Average Emotion Profile</CardTitle>
                <CardDescription>Emotional distribution across assessments</CardDescription>
              </div>
              <BarChart2 className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => `${Math.round(Number(value))}%`} />
                  <Legend />
                  <Bar dataKey="value" name="Percentage">
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Assessment Data</CardTitle>
              <CardDescription>Overview of student mental health assessments</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportStudentData}
              disabled={isExporting}
            >
              {isExporting ? (
                <>Exporting...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessments
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Assessment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-gray-200">
                {students.map(student => (
                  <React.Fragment key={student.id}>
                    <tr 
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleExpandStudent(student.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <ChevronDown 
                            className={`h-4 w-4 mr-1 transition-transform ${expandedStudent === student.id ? 'transform rotate-180' : ''}`} 
                          />
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {student.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {student.assessmentCount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {student.lastAssessment ? format(student.lastAssessment, "MMM d, yyyy") : "Never"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.highRiskCount > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            High Risk ({student.highRiskCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Low Risk
                          </span>
                        )}
                      </td>
                    </tr>
                    {expandedStudent === student.id && (
                      <tr>
                        <td colSpan={5} className="px-4 py-3">
                          <div className="bg-muted/20 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Assessment History</h4>
                            {student.assessmentCount > 0 ? (
                              <div className="space-y-2">
                                {/* This would show actual assessment data in a real app */}
                                <div className="flex justify-between text-sm p-2 bg-background rounded">
                                  <span>{format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}</span>
                                  <span className={student.highRiskCount > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                                    {student.highRiskCount > 0 ? "High Risk" : "Low Risk"}
                                  </span>
                                </div>
                                {student.assessmentCount > 1 && (
                                  <div className="flex justify-between text-sm p-2 bg-background rounded">
                                    <span>{format(new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}</span>
                                    <span className="text-yellow-600 font-medium">Moderate Risk</span>
                                  </div>
                                )}
                                {student.assessmentCount > 2 && (
                                  <div className="flex justify-between text-sm p-2 bg-background rounded">
                                    <span>{format(new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}</span>
                                    <span className="text-green-600 font-medium">Low Risk</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No assessments recorded yet.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
