
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
    anxiety: number; // Added anxiety as a key emotional indicator for mental health
  };
  sentiment: number; // -1 to 1, negative to positive
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;
  riskFactors: string[]; // New field to provide specific risk factors detected
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
      emotions: { joy: 0, sadness: 0, anger: 0, fear: 0, anxiety: 0 },
      sentiment: 0,
      riskLevel: 'low',
      confidence: 0,
      riskFactors: []
    };
  },
  assessmentHistory: [],
  loadModel: async () => {}
});

// Mental health specific keywords and phrases - expanded to be more comprehensive
const mentalHealthIndicators = {
  depression: [
    "depressed", "worthless", "hopeless", "empty", "sad all the time", 
    "no interest", "can't enjoy", "don't enjoy", "tired all the time", 
    "no energy", "can't sleep", "sleeping too much", "want to die",
    "better off dead", "not worth living", "end my life", "kill myself",
    "suicide", "harming myself", "self-harm", "cutting myself"
  ],
  anxiety: [
    "anxious", "worried", "panic", "fear", "nervous", "on edge", 
    "can't relax", "restless", "heart racing", "breathing fast",
    "chest tight", "dizzy", "lightheaded", "afraid", "terrified",
    "stressed", "overthinking", "obsessing", "can't stop thinking"
  ],
  trauma: [
    "trauma", "flashback", "nightmare", "abuse", "assault", "attack",
    "terrifying experience", "traumatic", "can't forget", "keeps coming back",
    "triggered", "ptsd", "scared to go out", "avoiding"
  ],
  isolation: [
    "lonely", "alone", "isolated", "no friends", "no one understands", 
    "no one cares", "disconnected", "cut off", "by myself", "abandoned",
    "rejected", "unwanted", "unloved"
  ],
  academicStress: [
    "failing", "grades", "exam", "test", "assignment", "school stress",
    "academic pressure", "university", "college", "class", "studying",
    "homework", "can't focus", "can't concentrate", "distracted"
  ]
};

// Mock assessment history for the current user
const mockAssessmentHistory: AssessmentResult[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    text: "I've been feeling really stressed about exams lately, but I'm managing ok.",
    emotions: { joy: 0.1, sadness: 0.4, anger: 0.2, fear: 0.5, anxiety: 0.6 },
    sentiment: -0.2,
    riskLevel: 'low',
    confidence: 0.78,
    riskFactors: ['academic stress']
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    text: "I'm struggling to get out of bed and attend classes. Everything feels overwhelming.",
    emotions: { joy: 0.05, sadness: 0.8, anger: 0.3, fear: 0.6, anxiety: 0.7 },
    sentiment: -0.7,
    riskLevel: 'high',
    confidence: 0.89,
    riskFactors: ['possible depression', 'academic stress']
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
      
      // Load toxicity model (still useful as one data point)
      const model = await toxicity.load(0.7, ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene']);
      
      setToxicityModel(model);
      setIsModelLoaded(true);
      console.log("ML model loaded successfully");
    } catch (error) {
      console.error("Error loading ML model:", error);
    }
  };
  
  // Improved function to analyze mental health indicators in text
  const analyzeMentalHealthIndicators = (text: string) => {
    const lowercaseText = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    const results: Record<string, number> = {};
    const detectedRiskFactors: string[] = [];
    
    // Calculate scores for each category based on keyword presence and density
    Object.entries(mentalHealthIndicators).forEach(([category, keywords]) => {
      let matches = 0;
      
      keywords.forEach(keyword => {
        if (lowercaseText.includes(keyword)) {
          matches++;
          
          // Add category to risk factors if any keywords match
          if (!detectedRiskFactors.includes(category)) {
            detectedRiskFactors.push(category);
          }
        }
      });
      
      // Calculate score based on matches and text length
      // Normalization formula to increase score impact for shorter texts
      const normalizer = Math.max(1, Math.log(wordCount) / Math.log(10));
      results[category] = Math.min(1, matches / (keywords.length * normalizer) * 2);
    });
    
    return {
      scores: results,
      riskFactors: detectedRiskFactors
    };
  };
  
  // Function to analyze text using the ML model
  const analyzeText = async (text: string): Promise<AssessmentResult> => {
    setIsAnalyzing(true);
    
    try {
      // Basic emotional indicators
      let emotionScores = { joy: 0, sadness: 0, anger: 0, fear: 0, anxiety: 0 };
      let sentimentScore = 0;
      let confidence = 0;
      let detectedRiskFactors: string[] = [];
      
      // Initial mental health analysis using our enhanced keyword approach
      const mentalHealthAnalysis = analyzeMentalHealthIndicators(text);
      
      // If toxicity model is loaded, use it as one data source
      if (toxicityModel) {
        try {
          const predictions = await toxicityModel.classify([text]);
          
          // Extract scores from toxicity model
          const toxicityScore = predictions[0].results[0].probabilities[1];
          const severeToxicityScore = predictions[1].results[0].probabilities[1];
          const threatScore = predictions[4].results[0].probabilities[1];
          
          // Blend toxicity scores with keyword-based analysis
          emotionScores = {
            joy: Math.max(0, 1 - (toxicityScore * 0.5) - (mentalHealthAnalysis.scores.depression || 0) * 0.7),
            sadness: Math.max(mentalHealthAnalysis.scores.depression || 0, toxicityScore * 0.5),
            anger: Math.max(mentalHealthAnalysis.scores.trauma || 0, severeToxicityScore),
            fear: Math.max(mentalHealthAnalysis.scores.anxiety || 0, threatScore),
            anxiety: mentalHealthAnalysis.scores.anxiety || 0
          };
          
          // Calculate sentiment with more weight to mental health indicators
          sentimentScore = -1 * (
            toxicityScore * 0.3 + 
            (mentalHealthAnalysis.scores.depression || 0) * 0.3 + 
            (mentalHealthAnalysis.scores.anxiety || 0) * 0.2 +
            (mentalHealthAnalysis.scores.isolation || 0) * 0.2
          );
          sentimentScore = Math.max(-1, Math.min(1, sentimentScore * 2 - 0.5)); // Recalibrate to -1 to 1 range
          
          // Average confidence with more weight to mental health indicators
          confidence = 0.5 + (predictions.reduce((sum, p) => 
            sum + p.results[0].probabilities.reduce((a, b) => Math.max(a, b), 0), 0) 
            / predictions.length) * 0.3;
          
        } catch (error) {
          console.error("Error using toxicity model:", error);
          // Continue with fallback approach if toxicity model fails
        }
      } else {
        // Mental health-focused fallback
        
        // Map mental health indicators to emotions
        emotionScores = {
          joy: Math.max(0, 1 - 
            ((mentalHealthAnalysis.scores.depression || 0) * 0.7) - 
            ((mentalHealthAnalysis.scores.anxiety || 0) * 0.3)
          ),
          sadness: mentalHealthAnalysis.scores.depression || 0,
          anger: mentalHealthAnalysis.scores.trauma || 0 * 0.5,
          fear: (mentalHealthAnalysis.scores.trauma || 0) * 0.5,
          anxiety: mentalHealthAnalysis.scores.anxiety || 0
        };
        
        // Calculate sentiment based on mental health indicators
        sentimentScore = -1 * (
          (mentalHealthAnalysis.scores.depression || 0) * 0.4 + 
          (mentalHealthAnalysis.scores.anxiety || 0) * 0.3 +
          (mentalHealthAnalysis.scores.isolation || 0) * 0.2 +
          (mentalHealthAnalysis.scores.trauma || 0) * 0.1
        );
        sentimentScore = Math.max(-1, Math.min(1, sentimentScore * 2)); // Recalibrate to -1 to 1 range
        
        confidence = 0.7; // Higher confidence for our enhanced mental health analysis
      }
      
      // Add detected risk factors with human-readable labels
      if (mentalHealthAnalysis.scores.depression && mentalHealthAnalysis.scores.depression > 0.4) {
        detectedRiskFactors.push('signs of depression');
      }
      
      if (mentalHealthAnalysis.scores.anxiety && mentalHealthAnalysis.scores.anxiety > 0.4) {
        detectedRiskFactors.push('anxiety symptoms');
      }
      
      if (mentalHealthAnalysis.scores.trauma && mentalHealthAnalysis.scores.trauma > 0.3) {
        detectedRiskFactors.push('possible trauma');
      }
      
      if (mentalHealthAnalysis.scores.isolation && mentalHealthAnalysis.scores.isolation > 0.4) {
        detectedRiskFactors.push('social isolation');
      }
      
      if (mentalHealthAnalysis.scores.academicStress && mentalHealthAnalysis.scores.academicStress > 0.3) {
        detectedRiskFactors.push('academic stress');
      }
      
      // Add text-specific risk factors for concerning phrases
      const lowercaseText = text.toLowerCase();
      if (lowercaseText.includes('suicide') || lowercaseText.includes('kill myself') || 
          lowercaseText.includes('end my life') || lowercaseText.includes('better off dead')) {
        detectedRiskFactors.push('suicidal ideation');
      }
      
      if (lowercaseText.includes('harm myself') || lowercaseText.includes('cutting') || 
          lowercaseText.includes('self-harm') || lowercaseText.includes('hurt myself')) {
        detectedRiskFactors.push('self-harm risk');
      }
      
      // Determine risk level based on emotion scores, sentiment, and specific risk factors
      let riskLevel: 'low' | 'moderate' | 'high' = 'low';
      
      const hasSuicidalIdeation = detectedRiskFactors.includes('suicidal ideation');
      const hasSelfHarmRisk = detectedRiskFactors.includes('self-harm risk');
      const negativeEmotionScore = emotionScores.sadness + emotionScores.fear + emotionScores.anxiety;
      
      if (hasSuicidalIdeation || hasSelfHarmRisk || negativeEmotionScore > 2 || sentimentScore < -0.8) {
        riskLevel = 'high';
      } else if (negativeEmotionScore > 1.2 || sentimentScore < -0.5 || detectedRiskFactors.length >= 2) {
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
        confidence,
        riskFactors: detectedRiskFactors
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
        emotions: { joy: 0, sadness: 0, anger: 0, fear: 0, anxiety: 0 },
        sentiment: 0,
        riskLevel: 'low',
        confidence: 0.5,
        riskFactors: ['analysis error']
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
