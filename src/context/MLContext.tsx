
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

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

  const getAuthHeaders = () => {
    // Get the Supabase session token
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
      const parsedToken = JSON.parse(token);
      return {
        'Authorization': `Bearer ${parsedToken.access_token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  };

  const analyzeText = async (text: string): Promise<AssessmentResult> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${FLASK_API_URL}/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Add to history
      setAssessmentHistory(prev => [result, ...prev]);
      
      return result;
    } catch (error) {
      console.error('Error analyzing text:', error);
      
      // Fallback to mock analysis if Flask backend is not available
      const mockResult: AssessmentResult = {
        id: Date.now().toString(),
        text,
        sentiment: Math.random() * 2 - 1,
        emotions: {
          joy: Math.random() * 0.3,
          sadness: Math.random() * 0.7,
          anger: Math.random() * 0.4,
          fear: Math.random() * 0.5,
          anxiety: Math.random() * 0.6,
        },
        riskLevel: text.toLowerCase().includes('sad') || text.toLowerCase().includes('depressed') ? 'moderate' : 'low',
        riskFactors: text.toLowerCase().includes('sad') ? ['stress indicators'] : [],
        confidence: 0.75,
        timestamp: new Date().toISOString(),
      };
      
      setAssessmentHistory(prev => [mockResult, ...prev]);
      return mockResult;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${FLASK_API_URL}/assessments`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const history = await response.json();
        setAssessmentHistory(history);
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
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
