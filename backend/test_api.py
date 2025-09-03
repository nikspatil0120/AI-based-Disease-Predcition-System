"""
Test script for the AI Disease Prediction API
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint."""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_symptoms():
    """Test symptoms endpoint."""
    print("Testing symptoms endpoint...")
    response = requests.get(f"{BASE_URL}/api/symptoms")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_diseases():
    """Test diseases endpoint."""
    print("Testing diseases endpoint...")
    response = requests.get(f"{BASE_URL}/api/diseases")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_prediction():
    """Test prediction endpoint."""
    print("Testing prediction endpoint...")
    
    # Test case 1: Fever and cough (likely flu/cold)
    symptoms1 = {
        "Fever": "Severe",
        "Cough": "Moderate",
        "Headache": "Mild",
        "Fatigue": "Moderate"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/predict",
        headers={"Content-Type": "application/json"},
        json={"symptoms": symptoms1}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_disease_info():
    """Test disease info endpoint."""
    print("Testing disease info endpoint...")
    response = requests.get(f"{BASE_URL}/api/disease-info/Malaria")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

if __name__ == "__main__":
    print("=== AI Disease Prediction API Tests ===\n")
    
    try:
        test_health()
        test_symptoms()
        test_diseases()
        test_disease_info()
        test_prediction()
        
        print("All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure the Flask server is running on http://localhost:5000")
    except Exception as e:
        print(f"Error: {e}")
