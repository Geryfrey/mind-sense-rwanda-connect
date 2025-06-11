
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useML, AssessmentResult } from "@/context/MLContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, CheckCircle, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AssessmentForm: React.FC = () => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const { analyzeText } = useML();
  const { user } = useAuth();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    // Calculate word count
    const words = newText.trim().split(/\s+/).filter(word => word !== "");
    setWordCount(words.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;
    
    if (!user) {
      alert('Please log in to use the assessment feature.');
      return;
    }
    
    setIsAssessing(true);
    
    try {
      const assessmentResult = await analyzeText(text);
      setResult(assessmentResult);
    } catch (error) {
      console.error("Error during assessment:", error);
      alert('Assessment failed. Please try again or contact support if the issue persists.');
    } finally {
      setIsAssessing(false);
    }
  };

  const resetForm = () => {
    setText("");
    setWordCount(0);
    setResult(null);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-800 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      default: return 'text-green-800 bg-green-50 border-green-200';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'moderate': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  if (!user) {
    return (
      <Card className="shadow-md max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please log in to access the mental health assessment feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              Your privacy and data security are important to us. Please log in to continue with your confidential assessment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!result ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Enhanced Mental Health Assessment</CardTitle>
            <CardDescription>
              Share how you've been feeling lately. Our enhanced system will analyze your emotional state, 
              identify relevant contexts, and provide personalized support recommendations. Your responses are completely confidential.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="assessment-text" className="block text-sm font-medium text-gray-700 mb-1">
                    How are you feeling today? What's on your mind?
                  </label>
                  <Textarea
                    id="assessment-text"
                    placeholder="For example: I've been feeling overwhelmed with my coursework lately and having trouble sleeping. I'm worried about my upcoming exams and feel like I'm falling behind. Sometimes I feel like I can't keep up with everything..."
                    className="min-h-[150px]"
                    value={text}
                    onChange={handleTextChange}
                    disabled={isAssessing}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>For best results, write at least 20 words. Be as detailed as you feel comfortable.</span>
                    <span className={`${wordCount < 20 ? 'text-amber-600' : 'text-green-600'}`}>
                      {wordCount} words
                    </span>
                  </div>
                </div>
                
                {wordCount >= 50 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Great! Your detailed response will help us provide more accurate insights and personalized recommendations.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isAssessing || wordCount < 3}
                className="w-full md:w-auto"
              >
                {isAssessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Analyzing your response...
                  </>
                ) : 'Get Assessment & Support Recommendations'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-600" />
              Your Assessment Results
            </CardTitle>
            <CardDescription>
              Based on your input, we've analyzed your emotional state and identified relevant contexts to provide personalized support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Your message:</h3>
                <p className="text-sm text-gray-700 italic">"{result.text}"</p>
              </div>
              
              {result.tags && result.tags.length > 0 && (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <span className="text-blue-700">🏷️</span>
                    Identified Life Contexts & Challenges:
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-blue-700">
                    These contexts help us understand the specific challenges you're experiencing and provide targeted support resources.
                  </p>
                </div>
              )}
              
              <div className={`p-4 border rounded-lg ${getRiskLevelColor(result.riskLevel)}`}>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  {getRiskLevelIcon(result.riskLevel)}
                  Support Priority Level: {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                </h3>
                
                {result.riskFactors && result.riskFactors.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-2">Identified concerns:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.riskFactors.map((factor, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-70">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-sm">
                  {result.riskLevel === 'high' ? (
                    <div className="space-y-2">
                      <p className="font-medium text-red-800">
                        🚨 Your message indicates significant distress. Please consider reaching out for immediate support.
                      </p>
                      <p className="text-red-700">
                        Remember: You are not alone, and help is available. Crisis counselors are trained to provide support and can help you through this difficult time.
                      </p>
                    </div>
                  ) : result.riskLevel === 'moderate' ? (
                    <div className="space-y-2">
                      <p className="font-medium text-yellow-800">
                        ⚠️ We've identified some concerns that may benefit from professional support.
                      </p>
                      <p className="text-yellow-700">
                        Consider reaching out to a counselor, trusted friend, or family member. Taking proactive steps toward support can make a real difference.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-medium text-green-800">
                        ✅ Your message suggests you're managing well overall.
                      </p>
                      <p className="text-green-700">
                        Continue practicing self-care and maintaining the positive strategies that work for you. Remember that seeking support is always okay, even when things are going well.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Emotion Analysis */}
              <div className="p-4 border rounded-lg bg-purple-50">
                <h3 className="font-medium mb-3 text-purple-800">Emotional Analysis</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.emotions).map(([emotion, score]) => (
                    <div key={emotion} className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs capitalize text-purple-700">{emotion}</span>
                        <span className="text-xs text-purple-600">{Math.round(score * 100)}%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-1.5">
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-3">
            <Button variant="outline" onClick={resetForm}>
              Take Another Assessment
            </Button>
            <Button 
              onClick={() => window.location.href = '/referrals'} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              View Support Resources
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AssessmentForm;
