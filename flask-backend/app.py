
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import os
from supabase import create_client, Client
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import jwt
from functools import wraps
import re

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
SUPABASE_URL = "https://bxownsyanecfszaktxis.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4b3duc3lhbmVjZnN6YWt0eGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzA1MTksImV4cCI6MjA2MjkwNjUxOX0.4hiEIma-HhZr0lTy2glyB32Hzye5LgtzVpXih6zMJ1g"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Mental health risk keywords for enhanced analysis
HIGH_RISK_KEYWORDS = [
    'suicide', 'kill myself', 'end it all', 'want to die', 'no point living',
    'self harm', 'cut myself', 'hurt myself', 'worthless', 'hopeless'
]

MODERATE_RISK_KEYWORDS = [
    'depressed', 'anxious', 'panic', 'overwhelmed', 'stressed', 'lonely',
    'sad', 'worried', 'scared', 'angry', 'frustrated', 'tired', 'exhausted'
]

def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Verify token with Supabase
            user = supabase.auth.get_user(token)
            if not user:
                return jsonify({'error': 'Invalid token'}), 401
            
            request.user = user
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token verification failed'}), 401
    
    return decorated_function

def analyze_sentiment_and_emotions(text):
    """
    Analyze text using VADER sentiment analysis and extract emotions
    """
    # Get VADER scores
    scores = analyzer.polarity_scores(text)
    
    # Extract basic emotions from compound score and text analysis
    compound_score = scores['compound']
    
    # Initialize emotion scores
    emotions = {
        'joy': 0.0,
        'sadness': 0.0,
        'anger': 0.0,
        'fear': 0.0,
        'anxiety': 0.0
    }
    
    # Simple emotion detection based on keywords and sentiment
    text_lower = text.lower()
    
    # Joy indicators
    joy_words = ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'joy', 'pleased']
    if any(word in text_lower for word in joy_words) or compound_score > 0.5:
        emotions['joy'] = min(1.0, max(0.0, compound_score))
    
    # Sadness indicators
    sadness_words = ['sad', 'depressed', 'down', 'unhappy', 'disappointed', 'lonely']
    if any(word in text_lower for word in sadness_words) or compound_score < -0.3:
        emotions['sadness'] = min(1.0, abs(scores['neg']))
    
    # Anger indicators
    anger_words = ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'hate']
    if any(word in text_lower for word in anger_words):
        emotions['anger'] = min(1.0, scores['neg'])
    
    # Fear indicators
    fear_words = ['afraid', 'scared', 'terrified', 'worried', 'nervous']
    if any(word in text_lower for word in fear_words):
        emotions['fear'] = min(1.0, abs(compound_score) if compound_score < 0 else 0.3)
    
    # Anxiety indicators
    anxiety_words = ['anxious', 'panic', 'overwhelmed', 'stressed', 'tense']
    if any(word in text_lower for word in anxiety_words):
        emotions['anxiety'] = min(1.0, abs(scores['neg']) + 0.2)
    
    return scores, emotions

def determine_risk_level(text, sentiment_scores, emotions):
    """
    Determine risk level based on text content, sentiment, and emotions
    """
    text_lower = text.lower()
    
    # Check for high-risk keywords
    high_risk_found = any(keyword in text_lower for keyword in HIGH_RISK_KEYWORDS)
    if high_risk_found:
        return 'high', ['suicidal ideation', 'self-harm risk']
    
    # Check for moderate risk indicators
    moderate_risk_found = any(keyword in text_lower for keyword in MODERATE_RISK_KEYWORDS)
    
    # Risk assessment based on sentiment and emotions
    compound_score = sentiment_scores['compound']
    max_negative_emotion = max([emotions['sadness'], emotions['anger'], emotions['fear'], emotions['anxiety']])
    
    risk_factors = []
    
    if compound_score <= -0.6 or max_negative_emotion >= 0.7:
        if moderate_risk_found:
            risk_factors.extend(['severe emotional distress', 'depression indicators'])
            return 'high', risk_factors
        else:
            risk_factors.append('negative emotional state')
            return 'moderate', risk_factors
    elif compound_score <= -0.3 or max_negative_emotion >= 0.5 or moderate_risk_found:
        if moderate_risk_found:
            risk_factors.append('stress indicators')
        if max_negative_emotion >= 0.5:
            risk_factors.append('emotional distress')
        return 'moderate', risk_factors
    else:
        return 'low', []

def get_referrals_for_risk_level(risk_level, risk_factors):
    """
    Get appropriate referrals based on risk level and factors
    """
    try:
        # Query referrals from Supabase based on risk level
        response = supabase.table('referrals').select('*').eq('category', risk_level).execute()
        
        if response.data:
            return response.data
        else:
            # Fallback referrals if database is empty
            if risk_level == 'high':
                return [{
                    'name': 'University of Rwanda - Counseling and Mental Health',
                    'type': 'urgent_care',
                    'contact': '+250 788 123 456',
                    'description': 'Immediate professional mental health support',
                    'category': 'high'
                }]
            elif risk_level == 'moderate':
                return [{
                    'name': 'Student Counseling Services',
                    'type': 'counseling',
                    'contact': '+250 788 654 321',
                    'description': 'Professional counseling and support',
                    'category': 'moderate'
                }]
            else:
                return [{
                    'name': 'Self-Care Resources',
                    'type': 'self_help',
                    'contact': 'Available online',
                    'description': 'Wellness tips and stress management',
                    'category': 'low'
                }]
    except Exception as e:
        print(f"Error fetching referrals: {e}")
        return []

@app.route('/submit', methods=['POST'])
@verify_token
def submit_assessment():
    """
    Main endpoint for processing mental health assessments
    """
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Get user ID from token
        user_id = request.user.user.id
        
        # Analyze sentiment and emotions
        sentiment_scores, emotions = analyze_sentiment_and_emotions(text)
        
        # Determine risk level
        risk_level, risk_factors = determine_risk_level(text, sentiment_scores, emotions)
        
        # Get appropriate referrals
        referrals = get_referrals_for_risk_level(risk_level, risk_factors)
        
        # Create assessment result
        assessment_result = {
            'id': str(uuid.uuid4()),
            'text': text,
            'sentiment': sentiment_scores['compound'],
            'emotions': emotions,
            'riskLevel': risk_level,
            'riskFactors': risk_factors,
            'confidence': abs(sentiment_scores['compound']),
            'timestamp': datetime.now().isoformat(),
            'referrals': referrals
        }
        
        # Store assessment in Supabase
        try:
            supabase.table('assessments').insert({
                'id': assessment_result['id'],
                'user_id': user_id,
                'text_input': text,
                'sentiment_score': sentiment_scores['compound'],
                'emotions': emotions,
                'risk_level': risk_level,
                'risk_factors': risk_factors,
                'confidence_score': abs(sentiment_scores['compound']),
                'created_at': assessment_result['timestamp']
            }).execute()
        except Exception as db_error:
            print(f"Database error: {db_error}")
            # Continue with response even if DB save fails
        
        return jsonify(assessment_result), 200
        
    except Exception as e:
        print(f"Error processing assessment: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/assessments', methods=['GET'])
@verify_token
def get_user_assessments():
    """
    Get assessment history for the authenticated user
    """
    try:
        user_id = request.user.user.id
        
        response = supabase.table('assessments').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        
        # Format assessments for frontend
        formatted_assessments = []
        for assessment in response.data:
            formatted_assessments.append({
                'id': assessment['id'],
                'text': assessment['text_input'],
                'sentiment': assessment['sentiment_score'],
                'emotions': assessment['emotions'],
                'riskLevel': assessment['risk_level'],
                'riskFactors': assessment['risk_factors'],
                'confidence': assessment['confidence_score'],
                'timestamp': assessment['created_at']
            })
        
        return jsonify(formatted_assessments), 200
        
    except Exception as e:
        print(f"Error fetching assessments: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/admin/analytics', methods=['GET'])
@verify_token
def get_admin_analytics():
    """
    Get analytics data for admin dashboard
    """
    try:
        # Verify admin role
        user_id = request.user.user.id
        profile_response = supabase.table('profiles').select('role').eq('user_id', user_id).single().execute()
        
        if not profile_response.data or profile_response.data['role'] != 'admin':
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
        
        # Get assessment statistics
        assessments_response = supabase.table('assessments').select('risk_level, created_at').execute()
        
        analytics_data = {
            'totalAssessments': len(assessments_response.data),
            'riskDistribution': {
                'low': 0,
                'moderate': 0,
                'high': 0
            },
            'recentTrends': []
        }
        
        # Calculate risk distribution
        for assessment in assessments_response.data:
            risk_level = assessment['risk_level']
            if risk_level in analytics_data['riskDistribution']:
                analytics_data['riskDistribution'][risk_level] += 1
        
        return jsonify(analytics_data), 200
        
    except Exception as e:
        print(f"Error fetching analytics: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({'status': 'healthy', 'message': 'Flask ML backend is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
