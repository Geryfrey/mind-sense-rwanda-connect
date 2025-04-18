
import React, { useState } from "react";
import { format } from "date-fns";
import { Download, ChevronDown, ChevronRight, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useML, AssessmentResult } from "@/context/MLContext";

const AssessmentHistory: React.FC = () => {
  const { assessmentHistory } = useML();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Toggle expanded state for a result
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get emotion with highest score
  const getPrimaryEmotion = (emotions: { joy: number; sadness: number; anger: number; fear: number; anxiety: number }) => {
    const entries = Object.entries(emotions) as [keyof typeof emotions, number][];
    const [emotion] = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max, entries[0]);
    
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  };

  // Get sentiment description
  const getSentimentDescription = (sentiment: number) => {
    if (sentiment >= 0.5) return "Positive";
    if (sentiment >= 0) return "Somewhat Positive";
    if (sentiment >= -0.5) return "Somewhat Negative";
    return "Negative";
  };

  // Export assessment history as CSV
  const exportAsCSV = () => {
    if (assessmentHistory.length === 0) return;
    
    // Create CSV header
    const header = ["Date", "Text", "Primary Emotion", "Sentiment", "Risk Level", "Risk Factors"];
    
    // Convert assessment data to CSV rows
    const rows = assessmentHistory.map(assessment => {
      return [
        format(new Date(assessment.timestamp), "yyyy-MM-dd HH:mm"),
        `"${assessment.text.replace(/"/g, '""')}"`, // Escape quotes in text
        getPrimaryEmotion(assessment.emotions),
        getSentimentDescription(assessment.sentiment),
        assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1),
        `"${(assessment.riskFactors || []).join(", ")}"`
      ];
    });
    
    // Combine header and rows
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `assessment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>View and track your past mental health assessments</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportAsCSV}
          disabled={assessmentHistory.length === 0}
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {assessmentHistory.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No assessments recorded yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Take an assessment to start tracking your mental wellness.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessmentHistory.map((assessment) => (
              <div
                key={assessment.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 ${
                    assessment.riskLevel === 'high'
                      ? 'border-l-4 border-l-red-500'
                      : assessment.riskLevel === 'moderate'
                      ? 'border-l-4 border-l-yellow-500'
                      : 'border-l-4 border-l-green-500'
                  }`}
                  onClick={() => toggleExpand(assessment.id)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedId === assessment.id ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {format(new Date(assessment.timestamp), "MMMM d, yyyy")}
                        <span className="text-sm text-gray-500 ml-2">
                          {format(new Date(assessment.timestamp), "h:mm a")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            assessment.riskLevel === 'high'
                              ? 'bg-red-100 text-red-800'
                              : assessment.riskLevel === 'moderate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {assessment.riskLevel} risk
                        </span>
                        
                        {/* Display critical risk factors if present */}
                        {assessment.riskFactors && assessment.riskFactors.some(factor => 
                          factor === 'suicidal ideation' || factor === 'self-harm risk'
                        ) && (
                          <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Urgent attention needed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {getPrimaryEmotion(assessment.emotions)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getSentimentDescription(assessment.sentiment)}
                    </div>
                  </div>
                </div>
                
                {expandedId === assessment.id && (
                  <div className="p-4 bg-muted/10 border-t">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Your message:</h4>
                      <p className="text-sm bg-white p-3 rounded border">
                        {assessment.text}
                      </p>
                    </div>
                    
                    {/* Display risk factors */}
                    {assessment.riskFactors && assessment.riskFactors.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Risk factors identified:</h4>
                        <div className="flex flex-wrap gap-2">
                          {assessment.riskFactors.map((factor, index) => (
                            <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                              assessment.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                              assessment.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {factor === 'suicidal ideation' || factor === 'self-harm risk' ? (
                                <AlertTriangle className="inline-block h-3 w-3 mr-1" />
                              ) : null}
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Emotions:</h4>
                        <div className="space-y-2">
                          {Object.entries(assessment.emotions).map(([emotion, score]) => (
                            <div key={emotion} className="flex flex-col">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs capitalize">{emotion}</span>
                                <span className="text-xs">{Math.round(score * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    emotion === 'joy' ? 'bg-green-500' : 
                                    emotion === 'sadness' ? 'bg-blue-500' : 
                                    emotion === 'anger' ? 'bg-red-500' :
                                    emotion === 'anxiety' ? 'bg-purple-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${Math.round(score * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Analysis:</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Sentiment:</span>
                            <span>{getSentimentDescription(assessment.sentiment)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                assessment.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ 
                                width: `${Math.round(Math.abs(assessment.sentiment) * 100)}%`,
                                marginLeft: assessment.sentiment < 0 ? 'auto' : 0,
                              }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-xs mt-2">
                            <span>Risk Level:</span>
                            <span className="capitalize">{assessment.riskLevel}</span>
                          </div>
                          
                          <div className="flex justify-between text-xs mt-2">
                            <span>Model Confidence:</span>
                            <span>{Math.round(assessment.confidence * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentHistory;
