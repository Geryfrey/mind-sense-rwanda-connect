
# Mental Health Assessment Flask Backend

This Flask backend provides ML-powered mental health assessment using VADER sentiment analysis.

## Features

- VADER sentiment analysis for mental health text processing
- Risk level assessment (Low, Moderate, High)
- Emotion detection (Joy, Sadness, Anger, Fear, Anxiety)
- Supabase integration for data storage
- JWT authentication with existing React frontend
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export SUPABASE_URL="https://bxownsyanecfszaktxis.supabase.co"
export SUPABASE_KEY="your_supabase_anon_key"
```

3. Run the server:
```bash
python app.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /submit
Submit text for mental health assessment
- Requires: JWT token in Authorization header
- Body: `{"text": "your text here"}`
- Returns: Assessment results with sentiment, emotions, and risk level

### GET /assessments
Get user's assessment history
- Requires: JWT token in Authorization header
- Returns: Array of past assessments

### GET /admin/analytics
Get analytics data (admin only)
- Requires: Admin JWT token in Authorization header
- Returns: Aggregated assessment statistics

### GET /health
Health check endpoint
- Returns: Server status

## Risk Assessment

The system uses multiple factors to determine risk levels:

- **High Risk**: Contains suicidal ideation or self-harm keywords
- **Moderate Risk**: Shows stress indicators or moderate negative sentiment
- **Low Risk**: Generally positive or neutral sentiment

## Integration with React Frontend

The backend is designed to work seamlessly with your existing React application and Supabase authentication system.
