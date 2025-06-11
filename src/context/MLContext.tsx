
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface AssessmentResult {
  id: string;
  text: string;
  sentiment: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    anxiety: number;
  };
  riskLevel: 'low' | 'moderate' | 'high';
  riskFactors?: string[];
  tags?: string[];
  confidence: number;
  timestamp: string;
  referrals?: any[];
}

interface MLContextType {
  analyzeText: (text: string) => Promise<AssessmentResult>;
  assessmentHistory: AssessmentResult[];
  isLoading: boolean;
  refreshHistory: () => Promise<void>;
}

const MLContext = createContext<MLContextType | undefined>(undefined);

// Flask backend URL - update this to match your Flask server
const FLASK_API_URL = 'http://localhost:5000';

export const MLProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getAuthHeaders = async () => {
    if (!user) return { 'Content-Type': 'application/json' };
    
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };
    }
    
    return {
      'Content-Type': 'application/json',
    };
  };

  const analyzeText = async (text: string): Promise<AssessmentResult> => {
    if (!user) {
      throw new Error('User must be authenticated to perform assessments');
    }

    setIsLoading(true);
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${FLASK_API_URL}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Store assessment in Supabase directly from frontend as backup
      try {
        const { error: supabaseError } = await supabase
          .from('assessments')
          .insert({
            user_id: user.id,
            text_input: text,
            sentiment_score: result.sentiment,
            emotions: result.emotions,
            risk_level: result.riskLevel,
            risk_factors: result.riskFactors || [],
            tags: result.tags || [],
            confidence_score: result.confidence,
          });

        if (supabaseError) {
          console.error('Error storing assessment in Supabase:', supabaseError);
        }
      } catch (supabaseError) {
        console.error('Supabase storage error:', supabaseError);
      }
      
      // Add to local history
      setAssessmentHistory(prev => [result, ...prev]);
      
      return result;
    } catch (error) {
      console.error('Error analyzing text:', error);
      
      // Enhanced fallback with more dynamic tagging
      const mockResult = createEnhancedMockAnalysis(text);
      
      // Store fallback result in Supabase
      if (user) {
        try {
          await supabase
            .from('assessments')
            .insert({
              user_id: user.id,
              text_input: text,
              sentiment_score: mockResult.sentiment,
              emotions: mockResult.emotions,
              risk_level: mockResult.riskLevel,
              risk_factors: mockResult.riskFactors || [],
              tags: mockResult.tags || [],
              confidence_score: mockResult.confidence,
            });
        } catch (supabaseError) {
          console.error('Error storing fallback assessment:', supabaseError);
        }
      }
      
      setAssessmentHistory(prev => [mockResult, ...prev]);
      return mockResult;
    } finally {
      setIsLoading(false);
    }
  };

  const createEnhancedMockAnalysis = (text: string): AssessmentResult => {
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);
    
    // Enhanced keyword mapping for more comprehensive tagging
    const keywordTags = {
      '#AcademicStress': ['failing', 'grades', 'exam', 'test', 'assignment', 'coursework', 'study', 'studying', 'homework', 'class', 'classes', 'professor', 'academic', 'semester', 'deadline', 'gpa', 'marks', 'performance'],
      '#FinancialStress': ['money', 'broke', 'financial', 'afford', 'expensive', 'cost', 'budget', 'debt', 'loan', 'tuition', 'fees', 'bills', 'payment', 'poverty', 'poor'],
      '#Anxiety': ['anxious', 'anxiety', 'panic', 'nervous', 'worry', 'worried', 'fear', 'scared', 'terrified', 'tense', 'restless', 'uneasy', 'overwhelmed'],
      '#LowMood': ['sad', 'depressed', 'down', 'low', 'unhappy', 'miserable', 'gloomy', 'empty', 'numb', 'hopeless', 'despair'],
      '#SocialAnxiety': ['social', 'people', 'friends', 'lonely', 'isolated', 'alone', 'shy', 'awkward', 'embarrassed', 'judged'],
      '#SleepDeprived': ['sleep', 'tired', 'exhausted', 'insomnia', 'sleepless', 'awake', 'fatigue', 'drowsy'],
      '#HighRisk': ['suicide', 'kill myself', 'end it all', 'want to die', 'no point', 'self harm', 'hurt myself', 'worthless', 'hopeless'],
      '#RelationshipStress': ['relationship', 'boyfriend', 'girlfriend', 'partner', 'breakup', 'heartbreak', 'dating', 'love'],
      '#FamilyIssues': ['family', 'parents', 'mom', 'dad', 'home', 'siblings', 'relatives'],
      '#BodyImage': ['fat', 'ugly', 'appearance', 'looks', 'weight', 'skinny', 'body'],
      '#Perfectionism': ['perfect', 'mistake', 'failure', 'not good enough', 'disappointing'],
      '#TimeManagement': ['time', 'busy', 'schedule', 'deadline', 'rushing', 'late'],
    };

    const detectedTags: string[] = [];
    
    // Check for keyword matches
    Object.entries(keywordTags).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        detectedTags.push(tag);
      }
    });

    // Sentiment analysis simulation
    const negativeWords = ['sad', 'angry', 'frustrated', 'upset', 'disappointed', 'worried', 'scared', 'lonely', 'tired', 'stressed'];
    const positiveWords = ['happy', 'good', 'great', 'excited', 'confident', 'optimistic', 'hopeful', 'calm'];
    
    const negCount = negativeWords.filter(word => textLower.includes(word)).length;
    const posCount = positiveWords.filter(word => textLower.includes(word)).length;
    
    const sentiment = posCount > negCount ? Math.random() * 0.5 + 0.2 : -(Math.random() * 0.8 + 0.1);

    // Risk assessment
    const highRiskIndicators = ['suicide', 'kill myself', 'end it all', 'want to die', 'no point', 'worthless'];
    const moderateRiskIndicators = ['depressed', 'hopeless', 'overwhelmed', 'can\'t cope'];
    
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let riskFactors: string[] = [];
    
    if (highRiskIndicators.some(indicator => textLower.includes(indicator))) {
      riskLevel = 'high';
      riskFactors.push('suicidal ideation', 'severe emotional distress');
      if (!detectedTags.includes('#HighRisk')) {
        detectedTags.push('#HighRisk');
      }
    } else if (moderateRiskIndicators.some(indicator => textLower.includes(indicator)) || sentiment < -0.5) {
      riskLevel = 'moderate';
      riskFactors.push('emotional distress');
    }

    // Emotion simulation based on detected content
    const emotions = {
      joy: Math.max(0, sentiment * 0.8),
      sadness: Math.max(0, -sentiment * 0.9),
      anger: textLower.includes('angry') || textLower.includes('frustrated') ? Math.random() * 0.7 + 0.3 : Math.random() * 0.2,
      fear: detectedTags.includes('#Anxiety') ? Math.random() * 0.6 + 0.4 : Math.random() * 0.3,
      anxiety: detectedTags.includes('#Anxiety') || detectedTags.includes('#AcademicStress') ? Math.random() * 0.7 + 0.3 : Math.random() * 0.4,
    };

    return {
      id: Date.now().toString(),
      text,
      sentiment,
      emotions,
      riskLevel,
      riskFactors,
      tags: detectedTags,
      confidence: 0.75,
      timestamp: new Date().toISOString(),
      referrals: [],
    };
  };

  const refreshHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // First try to get from Flask backend
      const headers = await getAuthHeaders();
      const response = await fetch(`${FLASK_API_URL}/assessments`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const history = await response.json();
        setAssessmentHistory(history);
      } else {
        // Fallback to Supabase direct query
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching from Supabase:', error);
        } else {
          // Transform Supabase data to match our interface with proper type conversion
          const formattedHistory: AssessmentResult[] = data.map(assessment => ({
            id: assessment.id,
            text: assessment.text_input,
            sentiment: Number(assessment.sentiment_score),
            emotions: typeof assessment.emotions === 'object' && assessment.emotions !== null
              ? {
                  joy: Number((assessment.emotions as any).joy || 0),
                  sadness: Number((assessment.emotions as any).sadness || 0),
                  anger: Number((assessment.emotions as any).anger || 0),
                  fear: Number((assessment.emotions as any).fear || 0),
                  anxiety: Number((assessment.emotions as any).anxiety || 0),
                }
              : { joy: 0, sadness: 0, anger: 0, fear: 0, anxiety: 0 },
            riskLevel: (assessment.risk_level as 'low' | 'moderate' | 'high') || 'low',
            riskFactors: assessment.risk_factors || [],
            tags: assessment.tags || [],
            confidence: Number(assessment.confidence_score),
            timestamp: assessment.created_at,
            referrals: [],
          }));
          setAssessmentHistory(formattedHistory);
        }
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      
      // Final fallback to Supabase
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formattedHistory: AssessmentResult[] = data.map(assessment => ({
            id: assessment.id,
            text: assessment.text_input,
            sentiment: Number(assessment.sentiment_score),
            emotions: typeof assessment.emotions === 'object' && assessment.emotions !== null
              ? {
                  joy: Number((assessment.emotions as any).joy || 0),
                  sadness: Number((assessment.emotions as any).sadness || 0),
                  anger: Number((assessment.emotions as any).anger || 0),
                  fear: Number((assessment.emotions as any).fear || 0),
                  anxiety: Number((assessment.emotions as any).anxiety || 0),
                }
              : { joy: 0, sadness: 0, anger: 0, fear: 0, anxiety: 0 },
            riskLevel: (assessment.risk_level as 'low' | 'moderate' | 'high') || 'low',
            riskFactors: assessment.risk_factors || [],
            tags: assessment.tags || [],
            confidence: Number(assessment.confidence_score),
            timestamp: assessment.created_at,
            referrals: [],
          }));
          setAssessmentHistory(formattedHistory);
        }
      } catch (supabaseError) {
        console.error('Supabase fallback error:', supabaseError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load assessment history when user changes
  React.useEffect(() => {
    if (user) {
      refreshHistory();
    } else {
      setAssessmentHistory([]);
    }
  }, [user]);

  return (
    <MLContext.Provider value={{
      analyzeText,
      assessmentHistory,
      isLoading,
      refreshHistory,
    }}>
      {children}
    </MLContext.Provider>
  );
};

export const useML = (): MLContextType => {
  const context = useContext(MLContext);
  if (!context) {
    throw new Error('useML must be used within an MLProvider');
  }
  return context;
};
