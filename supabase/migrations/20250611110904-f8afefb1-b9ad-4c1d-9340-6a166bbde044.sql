
-- Drop existing RLS policies first
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Admins can view all assessments" ON public.assessments;

-- Update the assessments table to support the new ML analysis structure
ALTER TABLE public.assessments 
DROP COLUMN IF EXISTS anxiety_score,
DROP COLUMN IF EXISTS depression_score,
DROP COLUMN IF EXISTS stress_score,
DROP COLUMN IF EXISTS answers,
DROP COLUMN IF EXISTS recommendations;

-- Add new columns for the ML analysis results
ALTER TABLE public.assessments 
ADD COLUMN IF NOT EXISTS text_input TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS emotions JSONB NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS risk_level TEXT NOT NULL DEFAULT 'low',
ADD COLUMN IF NOT EXISTS risk_factors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL NOT NULL DEFAULT 0;

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assessments
CREATE POLICY "Users can view their own assessments" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON public.assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON public.assessments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" ON public.assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Admin policy to view all assessments for analytics
CREATE POLICY "Admins can view all assessments" ON public.assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
