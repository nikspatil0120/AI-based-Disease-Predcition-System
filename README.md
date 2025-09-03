# AI-Based Disease Prediction System

A comprehensive web application that uses Bayesian inference to predict diseases based on symptom analysis. The system combines a React frontend with a Flask backend API to provide accurate disease predictions using medical knowledge and conditional probability tables.

## 🏥 Features

- **AI-Powered Analysis**: Advanced Bayesian reasoning algorithms analyze symptoms with medical precision
- **14 Diseases**: Common Cold, Influenza, Malaria, Dengue, Typhoid, Pneumonia, COVID-19, Asthma, Tuberculosis, Diabetes, Gastroenteritis, Migraine, Anemia, Allergic Rhinitis
- **14 Symptoms**: Comprehensive symptom set including Fever, Cough, Headache, Fatigue, Body Pain, and more
- **Severity Levels**: None, Mild, Moderate, Severe for each symptom
- **Real-time Predictions**: Instant analysis and predictions using Bayesian networks
- **Professional UI**: Medical-themed design with modern, responsive interface
- **Detailed Results**: Disease probabilities, descriptions, common causes, and severity assessments

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **React Query** for data fetching

### Backend
- **Flask** Python web framework
- **Bayesian Network** for disease prediction
- **Conditional Probability Tables** (140 CPTs)
- **CORS** support for frontend integration
- **RESTful API** design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_REPO_URL>
cd AI-based-Disease-Predcition-System
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend will be available at `http://localhost:5000`

3. **Frontend Setup**
```bash
cd ..
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

## 📊 How It Works

1. **Symptom Selection**: Users select from 14 symptoms and rate their severity
2. **API Processing**: Frontend sends symptom data to Flask backend
3. **Bayesian Inference**: Backend uses conditional probability tables to calculate disease probabilities
4. **Results Display**: Frontend shows top predictions with detailed medical information

## 🔬 Bayesian Model

The system uses a Bayesian network with:
- **Prior Probabilities**: Equal probability for all diseases (1/14)
- **Conditional Probability Tables**: 196 CPTs (14 diseases × 14 symptoms)
- **Bayes' Theorem**: P(Disease|Symptoms) ∝ P(Symptoms|Disease) × P(Disease)
- **Normalization**: Probabilities sum to 1

## 📡 API Endpoints

- `GET /health` - Health check
- `GET /api/diseases` - List all diseases
- `GET /api/symptoms` - List all symptoms
- `GET /api/disease-info/<name>` - Get disease details
- `POST /api/predict` - Predict disease from symptoms
- `POST /api/batch-predict` - Batch predictions

## 🧪 Testing

Test the backend API:
```bash
cd backend
python test_api.py
```

## 📁 Project Structure

```
AI-based-Disease-Predcition-System/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── bayesian_model.py      # Bayesian inference model
│   ├── test_api.py           # API test script
│   ├── requirements.txt      # Python dependencies
│   └── README.md            # Backend documentation
├── src/
│   ├── pages/
│   │   ├── Index.tsx         # Home page
│   │   ├── Diagnosis.tsx     # Symptom selection
│   │   └── Results.tsx       # Prediction results
│   ├── components/ui/        # UI components
│   └── ...
├── SETUP.md                  # Detailed setup guide
└── README.md                 # This file
```

## ⚠️ Medical Disclaimer

This system is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
