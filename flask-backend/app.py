
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
    'self harm', 'cut myself', 'hurt myself', 'worthless', 'hopeless',
    'better off dead', 'no future', 'give up', 'can\'t go on'
]

MODERATE_RISK_KEYWORDS = [
    'depressed', 'anxious', 'panic', 'overwhelmed', 'stressed', 'lonely',
    'sad', 'worried', 'scared', 'angry', 'frustrated', 'tired', 'exhausted',
    'can\'t cope', 'breaking down', 'falling apart'
]

# Enhanced and expanded context-aware mental health tags mapping
MENTAL_HEALTH_TAGS = {
    '#AcademicStress': [
        'failing', 'grades', 'exam', 'test', 'assignment', 'coursework', 'study', 'studying',
        'homework', 'class', 'classes', 'professor', 'academic', 'semester', 'deadline',
        'gpa', 'marks', 'performance', 'behind in', 'catching up', 'workload', 'thesis',
        'dissertation', 'research', 'presentation', 'quiz', 'midterm', 'final', 'paper'
    ],
    '#FinancialStress': [
        'money', 'broke', 'financial', 'afford', 'expensive', 'cost', 'budget',
        'debt', 'loan', 'tuition', 'fees', 'bills', 'payment', 'poverty',
        'poor', 'economic', 'salary', 'income', 'scholarship', 'bursary',
        'financial aid', 'rent', 'food costs', 'textbooks'
    ],
    '#Anxiety': [
        'anxious', 'anxiety', 'panic', 'nervous', 'worry', 'worried', 'fear',
        'scared', 'terrified', 'tense', 'restless', 'uneasy', 'apprehensive',
        'overwhelmed', 'stressed out', 'racing thoughts', 'heart racing',
        'breathing fast', 'sweating', 'shaking', 'trembling'
    ],
    '#LowMood': [
        'sad', 'depressed', 'down', 'low', 'unhappy', 'miserable', 'gloomy',
        'melancholy', 'dejected', 'discouraged', 'disappointed', 'blue',
        'empty', 'numb', 'hopeless', 'despair', 'crying', 'tears'
    ],
    '#SocialAnxiety': [
        'social', 'people', 'friends', 'lonely', 'isolated', 'alone', 'shy',
        'awkward', 'embarrassed', 'judged', 'self-conscious', 'withdrawn',
        'antisocial', 'introvert', 'relationships', 'fitting in', 'rejection',
        'talking to people', 'making friends', 'social situations'
    ],
    '#SleepDeprived': [
        'sleep', 'tired', 'exhausted', 'insomnia', 'can\'t sleep', 'sleepless',
        'awake', 'restless nights', 'fatigue', 'drowsy', 'sleepy', 'no sleep',
        'staying up', 'all night', 'sleep schedule', 'sleeping problems',
        'nightmares', 'tossing', 'turning'
    ],
    '#HighRisk': [
        'suicide', 'kill myself', 'end it all', 'want to die', 'no point',
        'self harm', 'cut myself', 'hurt myself', 'worthless', 'hopeless',
        'give up', 'can\'t go on', 'better off dead', 'no future',
        'ending it', 'not worth living'
    ],
    '#RelationshipStress': [
        'relationship', 'boyfriend', 'girlfriend', 'partner', 'breakup', 'broke up',
        'heartbreak', 'dating', 'love', 'romantic', 'marriage', 'divorce',
        'cheating', 'trust issues', 'fighting', 'argument', 'couples',
        'commitment', 'jealousy', 'toxic relationship'
    ],
    '#FamilyIssues': [
        'family', 'parents', 'mom', 'dad', 'mother', 'father', 'home', 'siblings',
        'relatives', 'family problems', 'family conflict', 'family pressure',
        'divorce', 'separation', 'abuse', 'neglect', 'toxic family',
        'family expectations', 'disappointment'
    ],
    '#BodyImage': [
        'fat', 'ugly', 'appearance', 'looks', 'weight', 'skinny', 'body',
        'mirror', 'clothes', 'eating', 'diet', 'exercise', 'gym',
        'self-image', 'confidence', 'attractive', 'beautiful', 'handsome'
    ],
    '#Perfectionism': [
        'perfect', 'perfectionist', 'mistake', 'failure', 'not good enough',
        'disappointing', 'high standards', 'expectations', 'flawless',
        'error', 'wrong', 'mess up', 'control', 'obsessive'
    ],
    '#TimeManagement': [
        'time', 'busy', 'schedule', 'deadline', 'rushing', 'late', 'procrastination',
        'procrastinating', 'putting off', 'time management', 'overwhelmed',
        'too much', 'not enough time', 'behind schedule'
    ],
    '#SubstanceUse': [
        'drinking', 'alcohol', 'drugs', 'smoking', 'weed', 'marijuana',
        'pills', 'medication', 'addiction', 'substance', 'high', 'drunk',
        'party', 'escape', 'numb', 'cope'
    ],
    '#Identity': [
        'identity', 'who am i', 'purpose', 'meaning', 'direction', 'lost',
        'confused', 'identity crisis', 'belonging', 'values', 'beliefs',
        'sexuality', 'gender', 'race', 'culture', 'religion'
    ]
}

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

def extract_mental_health_tags(text):
    """
    Extract context-aware mental health tags from text using enhanced keyword matching
    and contextual analysis
    """
    text_lower = text.lower()
    detected_tags = []
    
    # Basic keyword matching
    for tag, keywords in MENTAL_HEALTH_TAGS.items():
        if any(keyword in text_lower for keyword in keywords):
            detected_tags.append(tag)
    
    # Contextual analysis for better tag assignment
    words = text_lower.split()
    
    # Enhanced stress detection based on combinations
    stress_indicators = ['stress', 'pressure', 'burden', 'weight', 'heavy']
    if any(indicator in text_lower for indicator in stress_indicators):
        # Determine type of stress based on context
        if any(word in text_lower for word in ['school', 'university', 'college', 'student']):
            if '#AcademicStress' not in detected_tags:
                detected_tags.append('#AcademicStress')
        elif any(word in text_lower for word in ['work', 'job', 'career', 'employment']):
            detected_tags.append('#WorkStress')
    
    # Enhanced anxiety detection
    anxiety_symptoms = ['heart racing', 'can\'t breathe', 'panic attack', 'shaking']
    if any(symptom in text_lower for symptom in anxiety_symptoms):
        if '#Anxiety' not in detected_tags:
            detected_tags.append('#Anxiety')
    
    # Relationship context enhancement
    if any(word in text_lower for word in ['fight', 'argument', 'conflict']) and \
       any(word in text_lower for word in ['boyfriend', 'girlfriend', 'partner', 'relationship']):
        if '#RelationshipStress' not in detected_tags:
            detected_tags.append('#RelationshipStress')
    
    # Academic performance specific detection
    performance_words = ['failing', 'behind', 'struggling', 'difficulty']
    academic_context = ['class', 'course', 'subject', 'study', 'exam']
    if any(perf in text_lower for perf in performance_words) and \
       any(acad in text_lower for acad in academic_context):
        if '#AcademicStress' not in detected_tags:
            detected_tags.append('#AcademicStress')
    
    # Remove duplicates while preserving order
    return list(dict.fromkeys(detected_tags))

def analyze_sentiment_and_emotions(text):
    """
    Enhanced sentiment and emotion analysis using VADER and contextual cues
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
    
    # Enhanced emotion detection based on keywords and context
    text_lower = text.lower()
    
    # Joy indicators with intensity
    joy_words = ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'joy', 'pleased', 'thrilled', 'delighted']
    joy_intensity = sum(1 for word in joy_words if word in text_lower)
    if joy_intensity > 0 or compound_score > 0.5:
        emotions['joy'] = min(1.0, max(0.0, compound_score + (joy_intensity * 0.1)))
    
    # Sadness indicators with context
    sadness_words = ['sad', 'depressed', 'down', 'unhappy', 'disappointed', 'lonely', 'empty', 'numb']
    sadness_intensity = sum(1 for word in sadness_words if word in text_lower)
    if sadness_intensity > 0 or compound_score < -0.3:
        emotions['sadness'] = min(1.0, abs(scores['neg']) + (sadness_intensity * 0.1))
    
    # Anger indicators
    anger_words = ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'hate', 'rage', 'annoyed']
    anger_intensity = sum(1 for word in anger_words if word in text_lower)
    if anger_intensity > 0:
        emotions['anger'] = min(1.0, scores['neg'] + (anger_intensity * 0.1))
    
    # Fear indicators
    fear_words = ['afraid', 'scared', 'terrified', 'worried', 'nervous', 'frightened']
    fear_intensity = sum(1 for word in fear_words if word in text_lower)
    if fear_intensity > 0:
        emotions['fear'] = min(1.0, abs(compound_score) if compound_score < 0 else 0.3 + (fear_intensity * 0.1))
    
    # Anxiety indicators with physical symptoms
    anxiety_words = ['anxious', 'panic', 'overwhelmed', 'stressed', 'tense', 'restless', 'uneasy']
    anxiety_symptoms = ['racing heart', 'can\'t breathe', 'sweating', 'shaking']
    anxiety_intensity = sum(1 for word in anxiety_words if word in text_lower)
    symptom_intensity = sum(1 for symptom in anxiety_symptoms if symptom in text_lower)
    
    if anxiety_intensity > 0 or symptom_intensity > 0:
        emotions['anxiety'] = min(1.0, abs(scores['neg']) + 0.2 + (anxiety_intensity * 0.1) + (symptom_intensity * 0.15))
    
    return scores, emotions

def determine_risk_level(text, sentiment_scores, emotions, tags):
    """
    Enhanced risk assessment considering multiple factors including new tags
    """
    text_lower = text.lower()
    
    # Check for high-risk keywords or tags
    high_risk_found = any(keyword in text_lower for keyword in HIGH_RISK_KEYWORDS)
    has_high_risk_tag = '#HighRisk' in tags
    
    if high_risk_found or has_high_risk_tag:
        return 'high', ['suicidal ideation', 'self-harm risk', 'immediate intervention needed']
    
    # Check for moderate risk indicators
    moderate_risk_found = any(keyword in text_lower for keyword in MODERATE_RISK_KEYWORDS)
    
    # Enhanced risk assessment based on sentiment, emotions, and tags
    compound_score = sentiment_scores['compound']
    max_negative_emotion = max([emotions['sadness'], emotions['anger'], emotions['fear'], emotions['anxiety']])
    
    # Consider multiple stress tags as risk escalation
    stress_tags = [tag for tag in tags if tag in ['#AcademicStress', '#FinancialStress', '#Anxiety', '#LowMood', '#RelationshipStress', '#FamilyIssues']]
    critical_tags = [tag for tag in tags if tag in ['#SubstanceUse', '#BodyImage', '#Perfectionism']]
    
    risk_factors = []
    
    # High risk conditions
    if compound_score <= -0.7 or max_negative_emotion >= 0.8 or len(stress_tags) >= 4 or len(critical_tags) >= 2:
        if moderate_risk_found or len(stress_tags) >= 3:
            risk_factors.extend(['severe emotional distress', 'multiple stressors', 'crisis intervention recommended'])
            return 'high', risk_factors
        else:
            risk_factors.extend(['significant emotional distress', 'professional support recommended'])
            return 'high', risk_factors
    
    # Moderate risk conditions
    elif (compound_score <= -0.4 or max_negative_emotion >= 0.5 or 
          moderate_risk_found or len(stress_tags) >= 2 or len(critical_tags) >= 1):
        
        if moderate_risk_found:
            risk_factors.append('stress and mood indicators')
        if max_negative_emotion >= 0.5:
            risk_factors.append('elevated emotional distress')
        if len(stress_tags) >= 2:
            risk_factors.append('multiple life stressors')
        if len(critical_tags) >= 1:
            risk_factors.append('concerning behavioral patterns')
        
        return 'moderate', risk_factors
    
    else:
        if len(stress_tags) >= 1:
            risk_factors.append('manageable stress levels')
        return 'low', risk_factors

def get_referrals_for_risk_level(risk_level, risk_factors, tags):
    """
    Get appropriate referrals based on risk level, factors, and detected tags
    """
    try:
        # Query referrals from Supabase based on risk level
        response = supabase.table('referrals').select('*').eq('category', risk_level).execute()
        
        if response.data:
            return response.data
        else:
            # Enhanced fallback referrals based on tags and risk level
            if risk_level == 'high':
                return [{
                    'name': 'Crisis Intervention Hotline',
                    'type': 'emergency',
                    'contact': '988 (Suicide & Crisis Lifeline)',
                    'description': 'Immediate crisis support available 24/7',
                    'category': 'high'
                }, {
                    'name': 'University Emergency Counseling',
                    'type': 'urgent_care',
                    'contact': '+250 788 123 456',
                    'description': 'Emergency mental health services for students',
                    'category': 'high'
                }]
            elif risk_level == 'moderate':
                referrals = [{
                    'name': 'Student Counseling Services',
                    'type': 'counseling',
                    'contact': '+250 788 654 321',
                    'description': 'Professional counseling and support',
                    'category': 'moderate'
                }]
                
                # Add specialized referrals based on tags
                if '#AcademicStress' in tags:
                    referrals.append({
                        'name': 'Academic Support Center',
                        'type': 'academic_support',
                        'contact': 'academic.support@university.edu',
                        'description': 'Study skills and academic stress management',
                        'category': 'moderate'
                    })
                
                if '#FinancialStress' in tags:
                    referrals.append({
                        'name': 'Financial Aid Office',
                        'type': 'financial_support',
                        'contact': 'finaid@university.edu',
                        'description': 'Financial assistance and budgeting help',
                        'category': 'moderate'
                    })
                
                return referrals
            else:
                return [{
                    'name': 'Wellness Resources',
                    'type': 'self_help',
                    'contact': 'Available online and on campus',
                    'description': 'Self-care tips and stress management resources',
                    'category': 'low'
                }]
    except Exception as e:
        print(f"Error fetching referrals: {e}")
        return []

@app.route('/submit', methods=['POST'])
@verify_token
def submit_assessment():
    """
    Enhanced endpoint for processing mental health assessments with dynamic tagging
    """
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Get user ID from token
        user_id = request.user.user.id
        
        # Extract mental health tags with enhanced detection
        tags = extract_mental_health_tags(text)
        
        # Analyze sentiment and emotions
        sentiment_scores, emotions = analyze_sentiment_and_emotions(text)
        
        # Determine risk level with enhanced assessment
        risk_level, risk_factors = determine_risk_level(text, sentiment_scores, emotions, tags)
        
        # Get appropriate referrals based on tags and risk
        referrals = get_referrals_for_risk_level(risk_level, risk_factors, tags)
        
        # Create enhanced assessment result
        assessment_result = {
            'id': str(uuid.uuid4()),
            'text': text,
            'sentiment': sentiment_scores['compound'],
            'emotions': emotions,
            'riskLevel': risk_level,
            'riskFactors': risk_factors,
            'tags': tags,
            'confidence': abs(sentiment_scores['compound']) + 0.1,  # Enhanced confidence
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
                'tags': tags,
                'confidence_score': abs(sentiment_scores['compound']) + 0.1,
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
                'tags': assessment.get('tags', []),
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
    Enhanced analytics with comprehensive tag distribution and trends
    """
    try:
        # Verify admin role
        user_id = request.user.user.id
        profile_response = supabase.table('profiles').select('role').eq('user_id', user_id).single().execute()
        
        if not profile_response.data or profile_response.data['role'] != 'admin':
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
        
        # Get assessment statistics
        assessments_response = supabase.table('assessments').select('risk_level, tags, created_at, emotions').execute()
        
        analytics_data = {
            'totalAssessments': len(assessments_response.data),
            'riskDistribution': {
                'low': 0,
                'moderate': 0,
                'high': 0
            },
            'tagDistribution': {},
            'emotionTrends': {
                'joy': 0,
                'sadness': 0,
                'anger': 0,
                'fear': 0,
                'anxiety': 0
            },
            'recentTrends': [],
            'tagCorrelations': {}
        }
        
        # Calculate comprehensive analytics
        for assessment in assessments_response.data:
            risk_level = assessment['risk_level']
            if risk_level in analytics_data['riskDistribution']:
                analytics_data['riskDistribution'][risk_level] += 1
            
            # Count tag occurrences
            assessment_tags = assessment.get('tags', [])
            for tag in assessment_tags:
                if tag in analytics_data['tagDistribution']:
                    analytics_data['tagDistribution'][tag] += 1
                else:
                    analytics_data['tagDistribution'][tag] = 1
            
            # Calculate emotion averages
            emotions = assessment.get('emotions', {})
            for emotion, value in emotions.items():
                if emotion in analytics_data['emotionTrends']:
                    analytics_data['emotionTrends'][emotion] += value
        
        # Calculate emotion averages
        total_assessments = max(1, len(assessments_response.data))
        for emotion in analytics_data['emotionTrends']:
            analytics_data['emotionTrends'][emotion] /= total_assessments
        
        return jsonify(analytics_data), 200
        
    except Exception as e:
        print(f"Error fetching analytics: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy', 
        'message': 'Enhanced Flask ML backend with dynamic tagging is running',
        'features': [
            'Dynamic tag assignment',
            'Enhanced emotion detection',
            'Contextual risk assessment',
            'Supabase integration',
            'Real-time assessment storage'
        ]
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
