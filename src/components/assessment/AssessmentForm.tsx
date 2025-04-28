
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
  const { analyzeText } = useML();

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
              
              <div className={`p-4 border rounded-lg ${
                result.riskLevel === 'low' ? 'bg-green-50' : 
                result.riskLevel === 'moderate' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <h3 className="font-medium mb-2">Support Recommendation</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl font-semibold capitalize">{result.riskLevel} Priority</span>
                </div>
                <p className="text-sm">
                  {result.riskLevel === 'low' 
                    ? "Your message suggests you're managing well overall. Remember that maintaining mental wellness is an ongoing practice."
                    : result.riskLevel === 'moderate'
                    ? "Based on your message, we've identified some concerns. Consider reaching out to a friend or counselor."
                    : "Your message indicates significant distress. Please consider speaking with a mental health professional soon - support is available."
                  }
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={resetForm}>
              Take Another Assessment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AssessmentForm;
