"""
Flask API for AI-based Disease Prediction System
Provides endpoints for disease prediction using Bayesian inference.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from bayesian_model import BayesianDiseaseModel

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize the Bayesian model
model = BayesianDiseaseModel()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "message": "AI Disease Prediction API is running",
        "diseases_count": len(model.diseases),
        "symptoms_count": len(model.symptoms)
    })

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    """Get list of all supported diseases."""
    return jsonify({
        "diseases": model.diseases,
        "count": len(model.diseases)
    })

@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of all supported symptoms."""
    return jsonify({
        "symptoms": model.symptoms,
        "severity_levels": model.severity_levels,
        "count": len(model.symptoms)
    })

@app.route('/api/disease-info/<disease_name>', methods=['GET'])
def get_disease_info(disease_name):
    """Get detailed information about a specific disease."""
    try:
        disease_info = model.get_disease_info(disease_name)
        if disease_info["description"] == "No additional information available.":
            return jsonify({"error": "Disease not found"}), 404
        
        return jsonify({
            "disease": disease_name,
            "info": disease_info
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict_disease():
    """
    Predict disease based on symptoms.
    
    Expected JSON format:
    {
        "symptoms": {
            "Fever": "Severe",
            "Cough": "Moderate",
            "Headache": "Mild"
        }
    }
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.get_json()
        
        if 'symptoms' not in data:
            return jsonify({"error": "Missing 'symptoms' field"}), 400
        
        symptoms = data['symptoms']
        
        # Validate symptoms format
        if not isinstance(symptoms, dict):
            return jsonify({"error": "Symptoms must be a dictionary"}), 400
        
        # Validate symptom names and severity levels
        for symptom, severity in symptoms.items():
            if symptom not in model.symptoms:
                return jsonify({
                    "error": f"Unknown symptom: {symptom}",
                    "valid_symptoms": model.symptoms
                }), 400
            
            if severity not in model.severity_levels:
                return jsonify({
                    "error": f"Invalid severity level: {severity}",
                    "valid_levels": model.severity_levels
                }), 400
        
        # Make prediction
        prediction_result = model.predict(symptoms)
        
        # Get detailed information for top diseases
        top_diseases = []
        for disease, probability in prediction_result["all_diseases"][:5]:  # Top 5 diseases
            disease_info = model.get_disease_info(disease)
            top_diseases.append({
                "name": disease,
                "probability": probability,
                "description": disease_info["description"],
                "common_causes": disease_info["common_causes"],
                "severity": disease_info["severity"]
            })
        
        # Prepare response
        response = {
            "success": True,
            "input_symptoms": symptoms,
            "most_probable_disease": prediction_result["most_probable_disease"],
            "most_probable_probability": prediction_result["most_probable_probability"],
            "top_diseases": top_diseases,
            "all_probabilities": prediction_result["probability_distribution"],
            "analysis_metadata": {
                "total_diseases_analyzed": len(model.diseases),
                "symptoms_provided": len(symptoms),
                "model_type": "Bayesian Network"
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict diseases for multiple symptom sets.
    
    Expected JSON format:
    {
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
    }
    """
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.get_json()
        
        if 'cases' not in data or not isinstance(data['cases'], list):
            return jsonify({"error": "Missing or invalid 'cases' field"}), 400
        
        results = []
        
        for case in data['cases']:
            if 'id' not in case or 'symptoms' not in case:
                results.append({
                    "id": case.get('id', 'unknown'),
                    "error": "Missing 'id' or 'symptoms' field"
                })
                continue
            
            try:
                prediction = model.predict(case['symptoms'])
                results.append({
                    "id": case['id'],
                    "success": True,
                    "most_probable_disease": prediction["most_probable_disease"],
                    "most_probable_probability": prediction["most_probable_probability"],
                    "symptoms": case['symptoms']
                })
            except Exception as e:
                results.append({
                    "id": case['id'],
                    "success": False,
                    "error": str(e)
                })
        
        return jsonify({
            "success": True,
            "results": results,
            "total_cases": len(results)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Batch prediction failed: {str(e)}"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("Starting AI Disease Prediction API...")
    print(f"Supported diseases: {len(model.diseases)}")
    print(f"Supported symptoms: {len(model.symptoms)}")
    print("API endpoints:")
    print("  GET  /health - Health check")
    print("  GET  /api/diseases - List all diseases")
    print("  GET  /api/symptoms - List all symptoms")
    print("  GET  /api/disease-info/<name> - Get disease details")
    print("  POST /api/predict - Predict disease from symptoms")
    print("  POST /api/batch-predict - Batch predictions")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
