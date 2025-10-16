# AI Disease Prediction System - Setup Guide

This guide will help you set up and run the complete AI-based Disease Prediction System with both frontend and backend components.

## System Overview

The system consists of:
- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: Flask API with Bayesian inference (Port 5000)
- **AI Model**: Bayesian network with 10 diseases and 14 symptoms

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Flask server
```bash
python app.py
```

The backend API will be available at `http://localhost:5000`

### 4. Test the backend (optional)
```bash
python test_api.py
```

## Frontend Setup

### 1. Navigate to project root
```bash
cd ..
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Backend API (http://localhost:5000)

- `GET /health` - Health check
- `GET /api/diseases` - List all diseases
- `GET /api/symptoms` - List all symptoms
- `GET /api/disease-info/<name>` - Get disease details
- `POST /api/predict` - Predict disease from symptoms
- `POST /api/batch-predict` - Batch predictions

### Example API Usage

```bash
# Predict disease
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": {
      "Fever": "Severe",
      "Cough": "Moderate",
      "Headache": "Mild"
    }
  }'
```

## Diseases Supported

1. Common Cold
2. Influenza (Flu)
3. Malaria
4. Dengue
5. Typhoid
6. Pneumonia
7. COVID-19
8. Asthma
9. Tuberculosis (TB)
10. Diabetes (Type 2)

## Symptoms Supported

1. Fever
2. Cough
3. Headache
4. Fatigue / Weakness
5. Body Pain / Muscle Ache
6. Sore Throat
7. Runny Nose
8. Difficulty Breathing
9. Chills / Sweating
10. Loss of Taste/Smell
11. Nausea / Vomiting
12. Diarrhea
13. Weight Loss
14. Frequent Urination

## Severity Levels

- None
- Mild
- Moderate
- Severe

## How It Works

1. **User Input**: Select symptoms and their severity levels
2. **API Call**: Frontend sends symptoms to backend API
3. **Bayesian Inference**: Backend uses conditional probability tables
4. **Results**: Returns disease probabilities and recommendations
5. **Display**: Frontend shows results with detailed information

## Troubleshooting

### Backend Issues
- Ensure Python dependencies are installed
- Check if port 5000 is available
- Verify Flask server is running

### Frontend Issues
- Ensure Node.js dependencies are installed
- Check if port 5173 is available
- Verify backend API is accessible

### CORS Issues
- Backend has CORS enabled for localhost:5173
- If using different ports, update CORS settings in `backend/app.py`

## Development

### Backend Development
- Model logic: `backend/bayesian_model.py`
- API endpoints: `backend/app.py`
- Dependencies: `backend/requirements.txt`

### Frontend Development
- Main pages: `src/pages/`
- Components: `src/components/`
- Styling: `src/index.css`, `tailwind.config.ts`

## Production Deployment

### Backend
- Use a production WSGI server (e.g., Gunicorn)
- Set up environment variables
- Configure proper CORS for production domain

### Frontend
- Build for production: `npm run build`
- Deploy to static hosting (e.g., Vercel, Netlify)
- Update API URLs for production

## Medical Disclaimer

This system is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.
