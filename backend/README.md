# AI Disease Prediction Backend

This is the Flask backend API for the AI-based Disease Prediction System. It implements a Bayesian network for disease prediction based on symptom analysis.

## Features

- **Bayesian Inference**: Uses conditional probability tables (CPT) for accurate disease prediction
- **10 Diseases**: Common Cold, Influenza, Malaria, Dengue, Typhoid, Pneumonia, COVID-19, Asthma, Tuberculosis, Diabetes
- **14 Symptoms**: Comprehensive symptom set with severity levels (None, Mild, Moderate, Severe)
- **RESTful API**: Clean API endpoints for integration with frontend
- **CORS Support**: Ready for React frontend integration

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/health` - Check API status

### Data Endpoints
- **GET** `/api/diseases` - Get list of all supported diseases
- **GET** `/api/symptoms` - Get list of all supported symptoms
- **GET** `/api/disease-info/<disease_name>` - Get detailed disease information

### Prediction Endpoints
- **POST** `/api/predict` - Predict disease from symptoms
- **POST** `/api/batch-predict` - Batch predictions for multiple cases

## Usage Examples

### Single Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": {
      "Fever": "Severe",
      "Cough": "Moderate",
      "Headache": "Mild",
      "Fatigue": "Moderate"
    }
  }'
```

### Batch Prediction
```bash
curl -X POST http://localhost:5000/api/batch-predict \
  -H "Content-Type: application/json" \
  -d '{
    "cases": [
      {
        "id": "case1",
        "symptoms": {"Fever": "Severe", "Cough": "Moderate"}
      },
      {
        "id": "case2",
        "symptoms": {"Headache": "Mild", "Fatigue": "Moderate"}
      }
    ]
  }'
```

## Response Format

### Successful Prediction Response
```json
{
  "success": true,
  "input_symptoms": {
    "Fever": "Severe",
    "Cough": "Moderate"
  },
  "most_probable_disease": "Malaria",
  "most_probable_probability": 45.2,
  "top_diseases": [
    {
      "name": "Malaria",
      "probability": 45.2,
      "description": "A mosquito-borne infectious disease...",
      "common_causes": ["Plasmodium falciparum", "Mosquito bites"],
      "severity": "high"
    }
  ],
  "all_probabilities": {
    "Malaria": 45.2,
    "Dengue": 23.1,
    "Influenza": 15.8
  }
}
```

## Model Architecture

The Bayesian model uses:
- **Prior Probabilities**: Equal probability for all diseases (1/10)
- **Conditional Probability Tables**: 140 CPTs (10 diseases × 14 symptoms)
- **Bayes' Theorem**: P(Disease|Symptoms) ∝ P(Symptoms|Disease) × P(Disease)
- **Normalization**: Probabilities sum to 1

## Development

The model is implemented in `bayesian_model.py` with:
- `BayesianDiseaseModel` class for inference
- Comprehensive CPT data for all disease-symptom combinations
- Disease information and metadata
- Robust error handling and validation
