
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useML, AssessmentResult } from "@/context/MLContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const AssessmentForm: React.FC = () => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const { analyzeText, isAnalyzing } = useML();

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
    
    setIsAssessing(true);
    
    try {
      const assessmentResult = await analyzeText(text);
      setResult(assessmentResult);
    } catch (error) {
      console.error("Error during assessment:", error);
    } finally {
      setIsAssessing(false);
    }
  };

  const resetForm = () => {
    setText("");
    setWordCount(0);
    setResult(null);
  };

  // Feedback messages based on risk level
  const getFeedbackMessage = (riskLevel: 'low' | 'moderate' | 'high') => {
    switch(riskLevel) {
      case 'low':
        return "Your message suggests you're managing well overall. Remember that maintaining mental wellness is an ongoing practice.";
      case 'moderate':
        return "It sounds like you're experiencing some challenges. Consider reaching out to a friend or counselor to discuss what you're going through.";
      case 'high':
        return "Your message indicates significant distress. Please consider speaking with a mental health professional soon - support is available.";
      default:
        return "Thank you for sharing. Regular check-ins on your mental health are important.";
    }
  };

  // Get emotion with highest score
  const getPrimaryEmotion = (emotions: { joy: number; sadness: number; anger: number; fear: number }) => {
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

  return (
    <div className="max-w-2xl mx-auto">
      {!result ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Mental Health Assessment</CardTitle>
            <CardDescription>
              Share how you've been feeling lately, and our system will help identify potential support resources.
              Your responses are confidential.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="assessment-text" className="block text-sm font-medium text-gray-700 mb-1">
                    How are you feeling today?
                  </label>
                  <Textarea
                    id="assessment-text"
                    placeholder="For example: I've been feeling overwhelmed with my coursework lately and having trouble sleeping. I'm worried about my upcoming exams..."
                    className="min-h-[150px]"
                    value={text}
                    onChange={handleTextChange}
                    disabled={isAssessing}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>For best results, write at least 20 words</span>
                    <span>{wordCount} words</span>
                  </div>
                </div>
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
                    Analyzing
                  </>
                ) : 'Submit Assessment'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Assessment Results</CardTitle>
            <CardDescription>
              Based on your input, we've analyzed your current emotional state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-background">
                <h3 className="font-medium mb-2">Your message:</h3>
                <p className="text-sm text-gray-700">{result.text}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-medium mb-2">Primary Emotion</h3>
                  <p className="text-xl font-semibold">{getPrimaryEmotion(result.emotions)}</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h3 className="font-medium mb-2">Overall Sentiment</h3>
                  <p className="text-xl font-semibold">{getSentimentDescription(result.sentiment)}</p>
                </div>
                
                <div className={`p-4 border rounded-lg col-span-1 md:col-span-2 ${
                  result.riskLevel === 'low' ? 'bg-green-50' : 
                  result.riskLevel === 'moderate' ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <h3 className="font-medium mb-2">Support Recommendation</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl font-semibold capitalize">{result.riskLevel} Priority</span>
                    {result.riskLevel !== 'low' && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.riskLevel === 'moderate' ? 'bg-yellow-200 text-yellow-800' : 
                        'bg-red-200 text-red-800'
                      }`}>
                        {result.riskLevel === 'high' ? 'Consider speaking with a professional soon' : 
                        'Follow-up recommended'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{getFeedbackMessage(result.riskLevel)}</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-background">
                <h3 className="font-medium mb-2">Emotions Detected</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(result.emotions).map(([emotion, score]) => (
                    <div key={emotion} className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm capitalize">{emotion}</span>
                        <span className="text-xs">{Math.round(score * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            emotion === 'joy' ? 'bg-green-500' : 
                            emotion === 'sadness' ? 'bg-blue-500' : 
                            emotion === 'anger' ? 'bg-red-500' : 'bg-yellow-500'
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
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button variant="outline" onClick={resetForm}>
              Take Another Assessment
            </Button>
            <Button onClick={() => window.location.href = '/referrals'}>
              View Recommended Services
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AssessmentForm;
