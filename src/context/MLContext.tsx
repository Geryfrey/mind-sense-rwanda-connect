
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

export interface AssessmentResult {
  id: string;
  timestamp: Date;
  text: string;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
  };
  sentiment: number; // -1 to 1, negative to positive
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;
}

interface MLContextType {
  isModelLoaded: boolean;
  isAnalyzing: boolean;
  analyzeText: (text: string) => Promise<AssessmentResult>;
  assessmentHistory: AssessmentResult[];
  loadModel: () => Promise<void>;
}

const MLContext = createContext<MLContextType>({
  isModelLoaded: false,
  isAnalyzing: false,
  analyzeText: async () => {
    return {
      id: '',
      timestamp: new Date(),
      text: '',
      emotions: { joy: 0, sadness: 0, anger: 0, fear: 0 },
      sentiment: 0,
      riskLevel: 'low',
      confidence: 0
    };
  },
  assessmentHistory: [],
  loadModel: async () => {}
});

// Mock assessment history for the current user
const mockAssessmentHistory: AssessmentResult[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    text: "I've been feeling really stressed about exams lately, but I'm managing ok.",
    emotions: { joy: 0.1, sadness: 0.4, anger: 0.2, fear: 0.5 },
    sentiment: -0.2,
    riskLevel: 'low',
    confidence: 0.78
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    text: "I'm struggling to get out of bed and attend classes. Everything feels overwhelming.",
    emotions: { joy: 0.05, sadness: 0.8, anger: 0.3, fear: 0.6 },
    sentiment: -0.7,
    riskLevel: 'high',
    confidence: 0.89
  }
];

export const MLProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toxicityModel, setToxicityModel] = useState<toxicity.ToxicityClassifier | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>(mockAssessmentHistory);
  
  // Load the ML model
  const loadModel = async () => {
    if (toxicityModel) return;
    
    try {
      // Load TensorFlow.js model
      await tf.ready();
      
      // Load toxicity model (as a proxy for emotion detection in this demo)
      const model = await toxicity.load(0.7, ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene']);
      
      setToxicityModel(model);
      setIsModelLoaded(true);
      console.log("ML model loaded successfully");
    } catch (error) {
      console.error("Error loading ML model:", error);
    }
  };
  
  // Function to analyze text using the ML model
  const analyzeText = async (text: string): Promise<AssessmentResult> => {
    setIsAnalyzing(true);
    
    try {
      // For a real implementation, we would use a proper emotion analysis model
      // Here we're using toxicity as a proxy
      let emotionScores = { joy: 0, sadness: 0, anger: 0, fear: 0 };
      let sentimentScore = 0;
      let confidence = 0;
      
      // If model is loaded, use it
      if (toxicityModel) {
        const predictions = await toxicityModel.classify([text]);
        
        // Extract scores from toxicity model (for demo purposes)
        const toxicityScore = predictions[0].results[0].probabilities[1];
        const severeToxicityScore = predictions[1].results[0].probabilities[1];
        const threatScore = predictions[4].results[0].probabilities[1];
        
        // Map toxicity scores to our emotion model (for demo)
        emotionScores = {
          joy: Math.max(0, 1 - toxicityScore * 1.5),
          sadness: toxicityScore * 0.7,
          anger: severeToxicityScore,
          fear: threatScore
        };
        
        // Calculate sentiment (-1 to 1)
        sentimentScore = -1 * (toxicityScore * 2 - 1);
        
        // Average confidence
        confidence = predictions.reduce((sum, p) => sum + p.results[0].probabilities.reduce((a, b) => Math.max(a, b), 0), 0) 
                    / predictions.length;
      } else {
        // Fallback to simple heuristics if model not loaded
        // This is a very basic fallback - in a real app, we'd ensure the model is loaded
        
        // Simple keywords for emotion detection
        const joyKeywords = ["happy", "excited", "great", "wonderful", "joy", "good"];
        const sadnessKeywords = ["sad", "depressed", "unhappy", "miserable", "lonely", "grief"];
        const angerKeywords = ["angry", "mad", "furious", "annoyed", "hate", "rage"];
        const fearKeywords = ["afraid", "scared", "anxious", "worried", "fear", "panic"];
        
        const lowercaseText = text.toLowerCase();
        
        // Count keyword occurrences
        joyKeywords.forEach(word => {
          if (lowercaseText.includes(word)) emotionScores.joy += 0.2;
        });
        
        sadnessKeywords.forEach(word => {
          if (lowercaseText.includes(word)) emotionScores.sadness += 0.2;
        });
        
        angerKeywords.forEach(word => {
          if (lowercaseText.includes(word)) emotionScores.anger += 0.2;
        });
        
        fearKeywords.forEach(word => {
          if (lowercaseText.includes(word)) emotionScores.fear += 0.2;
        });
        
        // Normalize scores
        emotionScores = {
          joy: Math.min(emotionScores.joy, 1),
          sadness: Math.min(emotionScores.sadness, 1),
          anger: Math.min(emotionScores.anger, 1),
          fear: Math.min(emotionScores.fear, 1)
        };
        
        // Simple sentiment analysis
        const positiveWords = ["happy", "good", "great", "excellent", "wonderful", "amazing", "love", "like"];
        const negativeWords = ["bad", "terrible", "awful", "horrible", "hate", "dislike", "sad", "angry", "depressed"];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        positiveWords.forEach(word => {
          if (lowercaseText.includes(word)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
          if (lowercaseText.includes(word)) negativeCount++;
        });
        
        const totalWords = text.split(/\s+/).length;
        const sentimentRaw = (positiveCount - negativeCount) / Math.max(1, totalWords);
        sentimentScore = Math.max(-1, Math.min(1, sentimentRaw)); // Clamp between -1 and 1
        
        confidence = 0.6; // Lower confidence for the heuristic method
      }
      
      // Determine risk level based on emotion scores and sentiment
      let riskLevel: 'low' | 'moderate' | 'high' = 'low';
      
      // High sadness/fear/anger and negative sentiment suggests higher risk
      const negativeEmotionScore = emotionScores.sadness + emotionScores.fear + emotionScores.anger;
      
      if (negativeEmotionScore > 1.8 || sentimentScore < -0.7) {
        riskLevel = 'high';
      } else if (negativeEmotionScore > 1 || sentimentScore < -0.3) {
        riskLevel = 'moderate';
      }
      
      // Create the assessment result
      const result: AssessmentResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        text,
        emotions: emotionScores,
        sentiment: sentimentScore,
        riskLevel,
        confidence
      };
      
      // Add to history
      setAssessmentHistory(prev => [result, ...prev]);
      
      return result;
    } catch (error) {
      console.error("Error analyzing text:", error);
      
      // Return fallback result
      const fallbackResult: AssessmentResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        text,
        emotions: { joy: 0, sadness: 0, anger: 0, fear: 0 },
        sentiment: 0,
        riskLevel: 'low',
        confidence: 0.5
      };
      
      return fallbackResult;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <MLContext.Provider
      value={{
        isModelLoaded,
        isAnalyzing,
        analyzeText,
        assessmentHistory,
        loadModel
      }}
    >
      {children}
    </MLContext.Provider>
  );
};

export const useML = () => useContext(MLContext);
