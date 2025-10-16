"""
Flask API for AI-based Disease Prediction System
Provides endpoints for disease prediction using Bayesian inference.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from bayesian_model import BayesianDiseaseModel
from flask import session
import uuid
from difflib import get_close_matches
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])  # Enable CORS for React frontend with Authorization header

# Initialize the Bayesian model
model = BayesianDiseaseModel()

# In-memory user and history storage
users = {
    "testuser": {"password": "testpass", "name": "Test User"}
}
user_histories = {}
sessions = {}

# In-memory storage for custom symptoms per user
user_custom_symptoms = {}


def _normalize_symptom(name: str) -> str:
    return re.sub(r"\s+", " ", name.strip()).title()


def _validate_symptom_text(symptom: str, model_symptoms) -> (bool, str, str):
    if not symptom or not isinstance(symptom, str):
        return False, "Symptom must be a non-empty string", ""
    normalized = _normalize_symptom(symptom)
    if not re.match(r"^[A-Za-z\s\-/]+$", normalized):
        return False, "Only letters, spaces, hyphen and slash are allowed", ""

    # Already exists in model
    if normalized in model_symptoms:
        return False, "Symptom already exists in the system", normalized

    # Basic quality checks for custom symptoms
    tokens = [t for t in re.split(r"\s+", normalized) if t]
    if len(tokens) < 2:
        return False, "Please provide a more descriptive symptom (e.g., 'Back Pain').", ""
    if any(len(t) < 3 for t in tokens):
        return False, "Each word should have at least 3 letters.", ""

    # Require a medical descriptor to avoid nonsense terms
    descriptors = {
        "Pain", "Ache", "Swelling", "Rash", "Numbness", "Itching", "Bleeding",
        "Cramp", "Stiffness", "Burning", "Tingling", "Weakness", "Fatigue",
        "Diarrhea", "Vomiting", "Nausea", "Cough", "Fever", "Dizziness",
        "Shortness", "Breath", "Soreness", "Inflammation"
    }
    if tokens[-1] not in descriptors and not any(t in descriptors for t in tokens):
        return False, "Please end with a medical descriptor like 'Pain', 'Rash', 'Swelling', etc.", ""

    # At least one non-descriptor token should be a known anatomical/symptom term
    allowed_terms = {
        # Anatomy
        "Head","Scalp","Face","Eye","Ear","Nose","Mouth","Tooth","Gum","Throat","Neck",
        "Shoulder","Arm","Elbow","Wrist","Hand","Finger","Chest","Breast","Back","Upper","Lower",
        "Abdomen","Stomach","Hip","Groin","Thigh","Knee","Calf","Ankle","Foot","Toe","Spine","Waist",
        "Skin","Joint","Muscle",
        # Systems / general
        "Breathing","Vision","Hearing","Urination","Bowel","Sleep","Appetite"
    }
    non_descriptor_tokens = [t for t in tokens if t not in descriptors]
    has_known_term = False
    for t in non_descriptor_tokens:
        if t in allowed_terms:
            has_known_term = True
            break
        # fuzzy check to nearest allowed term
        close_allowed = get_close_matches(t, list(allowed_terms), n=1, cutoff=0.85)
        if close_allowed:
            has_known_term = True
            break
    if not has_known_term:
        close_any = get_close_matches(non_descriptor_tokens[0], list(allowed_terms), n=1, cutoff=0.7)
        hint = f" Did you mean '{close_any[0]}'?" if close_any else ""
        return False, "Please use a recognizable body area or symptom term." + hint, ""

    # Suggest closest existing symptom if typo
    close = get_close_matches(normalized, model_symptoms, n=1, cutoff=0.85)
    if close:
        return False, f"Did you mean '{close[0]}'? This symptom already exists.", close[0]

    return True, "", normalized


def _get_username_from_auth_header():
    auth = request.headers.get('Authorization') or ''
    token = auth.replace('Bearer ', '').strip()
    if not token:
        return None
    return sessions.get(token)


@app.route("/")
def home():
    return "API is running!"

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
        
        # Determine allowed symptoms (built-in + user's custom)
        username = _get_username_from_auth_header()
        user_allowed = set(user_custom_symptoms.get(username, [])) if username else set()
        allowed_symptoms = set(model.symptoms) | user_allowed
        
        # Validate symptoms format
        if not isinstance(symptoms, dict):
            return jsonify({"error": "Symptoms must be a dictionary"}), 400
        
        # Validate symptom names and severity levels
        for symptom, severity in symptoms.items():
            if symptom not in allowed_symptoms:
                return jsonify({
                    "error": f"Unknown symptom: {symptom}",
                    "valid_symptoms": list(allowed_symptoms)
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

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = users.get(username)
    if user and user['password'] == password:
        token = str(uuid.uuid4())
        sessions[token] = username
        return jsonify({"success": True, "token": token, "name": user["name"]})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    if not username or not password or not name:
        return jsonify({"success": False, "error": "Missing fields"}), 400
    if username in users:
        return jsonify({"success": False, "error": "Username already exists"}), 409
    users[username] = {"password": password, "name": name}
    return jsonify({"success": True})

@app.route('/api/history', methods=['GET'])
def get_history():
    username = _get_username_from_auth_header()
    if not username:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    return jsonify({"success": True, "history": user_histories.get(username, [])})

@app.route('/api/history', methods=['POST'])
def add_history():
    username = _get_username_from_auth_header()
    if not username:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    data = request.get_json()
    entry = data.get('entry')
    if not entry:
        return jsonify({"success": False, "error": "Missing entry"}), 400
    user_histories.setdefault(username, []).append(entry)
    return jsonify({"success": True})

@app.route('/api/validate-symptom', methods=['POST'])
def validate_symptom():
    data = request.get_json() or {}
    text = data.get('text', '')
    is_valid, message, suggested = _validate_symptom_text(text, model.symptoms)
    return jsonify({"valid": is_valid, "message": message, "normalized": suggested or _normalize_symptom(text)})


@app.route('/api/custom-symptoms', methods=['GET'])
def get_custom_symptoms():
    username = _get_username_from_auth_header()
    if not username:
        return jsonify({"success": False, "error": "Unauthorized"}), 401
    return jsonify({
        "success": True,
        "custom_symptoms": user_custom_symptoms.get(username, [])
    })


@app.route('/api/custom-symptoms', methods=['POST'])
def add_custom_symptom():
    username = _get_username_from_auth_header()
    if not username:
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    data = request.get_json() or {}
    text = data.get('text', '')

    is_valid, message, normalized = _validate_symptom_text(text, model.symptoms)
    if not is_valid:
        return jsonify({"success": False, "error": message, "suggestion": normalized}), 400

    current = user_custom_symptoms.setdefault(username, [])
    if normalized in current:
        return jsonify({"success": False, "error": "Symptom already added"}), 409

    current.append(normalized)
    return jsonify({"success": True, "custom_symptoms": current})


@app.route('/api/custom-symptoms', methods=['DELETE'])
def remove_custom_symptom():
    username = _get_username_from_auth_header()
    if not username:
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    data = request.get_json() or {}
    text = _normalize_symptom(data.get('text', ''))

    current = user_custom_symptoms.setdefault(username, [])
    if text in current:
        current.remove(text)
        return jsonify({"success": True, "custom_symptoms": current})
    return jsonify({"success": False, "error": "Symptom not found"}), 404

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
