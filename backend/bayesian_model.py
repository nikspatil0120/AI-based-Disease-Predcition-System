"""
Bayesian Disease Prediction Model
Implements a Bayesian network for disease prediction based on symptoms.
"""

import json
from typing import Dict, List, Tuple, Any
from collections import defaultdict

class BayesianDiseaseModel:
    def __init__(self):
        """Initialize the Bayesian model with conditional probability tables."""
        self.diseases = [
            "Common Cold", "Influenza", "Malaria", "Dengue", "Typhoid",
            "Pneumonia", "COVID-19", "Asthma", "Tuberculosis", "Diabetes",
            "Gastroenteritis", "Migraine", "Anemia", "Allergic Rhinitis"
        ]
        
        self.symptoms = [
            "Fever", "Cough", "Headache", "Fatigue", "Body Pain", "Sore Throat",
            "Runny Nose", "Difficulty Breathing", "Chills", "Loss of Taste/Smell",
            "Nausea", "Chest Pain", "Dizziness", "Confusion"
        ]
        
        self.severity_levels = ["None", "Mild", "Moderate", "Severe"]
        
        # Initialize prior probabilities (equal for all diseases)
        self.prior_probabilities = {disease: 1.0 / len(self.diseases) for disease in self.diseases}
        
        # Load conditional probability tables
        self.cpt = self._load_cpt()
    
    def _load_cpt(self) -> Dict[str, Dict[str, Dict[str, float]]]:
        """Load the conditional probability tables."""
        return {
            "Common Cold": {
                "Fever": {"None": 0.20, "Mild": 0.50, "Moderate": 0.25, "Severe": 0.05},
                "Cough": {"None": 0.10, "Mild": 0.40, "Moderate": 0.40, "Severe": 0.10},
                "Headache": {"None": 0.40, "Mild": 0.40, "Moderate": 0.15, "Severe": 0.05},
                "Fatigue": {"None": 0.30, "Mild": 0.40, "Moderate": 0.20, "Severe": 0.10},
                "Body Pain": {"None": 0.40, "Mild": 0.40, "Moderate": 0.15, "Severe": 0.05},
                "Sore Throat": {"None": 0.10, "Mild": 0.50, "Moderate": 0.30, "Severe": 0.10},
                "Runny Nose": {"None": 0.05, "Mild": 0.40, "Moderate": 0.40, "Severe": 0.15},
                "Difficulty Breathing": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Chills": {"None": 0.60, "Mild": 0.30, "Moderate": 0.08, "Severe": 0.02},
                "Loss of Taste/Smell": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Nausea": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Chest Pain": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                "Dizziness": {"None": 0.85, "Mild": 0.12, "Moderate": 0.03, "Severe": 0.00},
                "Confusion": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00}
            },
            "Influenza": {
                "Fever": {"None": 0.05, "Mild": 0.15, "Moderate": 0.35, "Severe": 0.45},
                "Cough": {"None": 0.05, "Mild": 0.25, "Moderate": 0.40, "Severe": 0.30},
                "Headache": {"None": 0.15, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.20},
                "Fatigue": {"None": 0.10, "Mild": 0.30, "Moderate": 0.40, "Severe": 0.20},
                "Body Pain": {"None": 0.15, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.20},
                "Sore Throat": {"None": 0.20, "Mild": 0.35, "Moderate": 0.30, "Severe": 0.15},
                "Runny Nose": {"None": 0.20, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.15},
                "Difficulty Breathing": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                "Chills": {"None": 0.15, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.20},
                "Loss of Taste/Smell": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Nausea": {"None": 0.75, "Mild": 0.15, "Moderate": 0.08, "Severe": 0.02},
                "Chest Pain": {"None": 0.85, "Mild": 0.12, "Moderate": 0.03, "Severe": 0.00},
                "Dizziness": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Confusion": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00}
            },
            "Malaria": {
                "Fever": {"None": 0.05, "Mild": 0.10, "Moderate": 0.25, "Severe": 0.60},
                "Cough": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Headache": {"None": 0.15, "Mild": 0.25, "Moderate": 0.35, "Severe": 0.25},
                "Fatigue": {"None": 0.05, "Mild": 0.20, "Moderate": 0.40, "Severe": 0.35},
                "Body Pain": {"None": 0.10, "Mild": 0.20, "Moderate": 0.40, "Severe": 0.30},
                "Sore Throat": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Runny Nose": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                "Difficulty Breathing": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Chills": {"None": 0.05, "Mild": 0.15, "Moderate": 0.35, "Severe": 0.45},
                "Loss of Taste/Smell": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Nausea": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                "Chest Pain": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Dizziness": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Confusion": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01}
            },
            "Dengue": {
                "Fever": {"None": 0.05, "Mild": 0.10, "Moderate": 0.25, "Severe": 0.60},
                "Cough": {"None": 0.75, "Mild": 0.15, "Moderate": 0.08, "Severe": 0.02},
                "Headache": {"None": 0.10, "Mild": 0.20, "Moderate": 0.40, "Severe": 0.30},
                "Fatigue": {"None": 0.05, "Mild": 0.15, "Moderate": 0.40, "Severe": 0.40},
                "Body Pain": {"None": 0.05, "Mild": 0.15, "Moderate": 0.40, "Severe": 0.40},
                "Sore Throat": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Runny Nose": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Difficulty Breathing": {"None": 0.75, "Mild": 0.15, "Moderate": 0.08, "Severe": 0.02},
                "Chills": {"None": 0.10, "Mild": 0.20, "Moderate": 0.35, "Severe": 0.35},
                "Loss of Taste/Smell": {"None": 0.90, "Mild": 0.07, "Moderate": 0.02, "Severe": 0.01},
                "Nausea": {"None": 0.50, "Mild": 0.25, "Moderate": 0.15, "Severe": 0.10},
                "Chest Pain": {"None": 0.75, "Mild": 0.15, "Moderate": 0.08, "Severe": 0.02},
                "Dizziness": {"None": 0.65, "Mild": 0.20, "Moderate": 0.10, "Severe": 0.05},
                "Confusion": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01}
            },
            "Typhoid": {
                "Fever": {"None": 0.05, "Mild": 0.15, "Moderate": 0.35, "Severe": 0.45},
                "Cough": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Headache": {"None": 0.20, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.15},
                "Fatigue": {"None": 0.05, "Mild": 0.20, "Moderate": 0.40, "Severe": 0.35},
                "Body Pain": {"None": 0.15, "Mild": 0.25, "Moderate": 0.35, "Severe": 0.25},
                "Sore Throat": {"None": 0.75, "Mild": 0.15, "Moderate": 0.07, "Severe": 0.03},
                "Runny Nose": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Difficulty Breathing": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Chills": {"None": 0.20, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.15},
                "Loss of Taste/Smell": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Nausea": {"None": 0.40, "Mild": 0.30, "Moderate": 0.20, "Severe": 0.10},
                "Chest Pain": {"None": 0.60, "Mild": 0.25, "Moderate": 0.12, "Severe": 0.03},
                "Dizziness": {"None": 0.55, "Mild": 0.25, "Moderate": 0.15, "Severe": 0.05},
                "Confusion": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02}
            },
            "Pneumonia": {
                "Fever": {"None": 0.05, "Mild": 0.15, "Moderate": 0.30, "Severe": 0.50},
                "Cough": {"None": 0.05, "Mild": 0.20, "Moderate": 0.40, "Severe": 0.35},
                "Headache": {"None": 0.40, "Mild": 0.30, "Moderate": 0.20, "Severe": 0.10},
                "Fatigue": {"None": 0.10, "Mild": 0.25, "Moderate": 0.35, "Severe": 0.30},
                "Body Pain": {"None": 0.30, "Mild": 0.30, "Moderate": 0.25, "Severe": 0.15},
                "Sore Throat": {"None": 0.40, "Mild": 0.35, "Moderate": 0.20, "Severe": 0.05},
                "Runny Nose": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Difficulty Breathing": {"None": 0.05, "Mild": 0.15, "Moderate": 0.35, "Severe": 0.45},
                "Chills": {"None": 0.20, "Mild": 0.30, "Moderate": 0.30, "Severe": 0.20},
                "Loss of Taste/Smell": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Nausea": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Chest Pain": {"None": 0.20, "Mild": 0.25, "Moderate": 0.30, "Severe": 0.25},
                "Dizziness": {"None": 0.75, "Mild": 0.15, "Moderate": 0.07, "Severe": 0.03},
                "Confusion": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01}
            },
            "COVID-19": {
                "Fever": {"None": 0.10, "Mild": 0.20, "Moderate": 0.35, "Severe": 0.35},
                "Cough": {"None": 0.10, "Mild": 0.25, "Moderate": 0.35, "Severe": 0.30},
                "Headache": {"None": 0.20, "Mild": 0.30, "Moderate": 0.30, "Severe": 0.20},
                "Fatigue": {"None": 0.10, "Mild": 0.25, "Moderate": 0.35, "Severe": 0.30},
                "Body Pain": {"None": 0.20, "Mild": 0.30, "Moderate": 0.30, "Severe": 0.20},
                "Sore Throat": {"None": 0.15, "Mild": 0.35, "Moderate": 0.35, "Severe": 0.15},
                "Runny Nose": {"None": 0.30, "Mild": 0.35, "Moderate": 0.25, "Severe": 0.10},
                "Difficulty Breathing": {"None": 0.15, "Mild": 0.25, "Moderate": 0.30, "Severe": 0.30},
                "Chills": {"None": 0.20, "Mild": 0.30, "Moderate": 0.30, "Severe": 0.20},
                "Loss of Taste/Smell": {"None": 0.10, "Mild": 0.20, "Moderate": 0.30, "Severe": 0.40},
                "Nausea": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Chest Pain": {"None": 0.75, "Mild": 0.15, "Moderate": 0.07, "Severe": 0.03},
                "Dizziness": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Confusion": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01}
            },
            "Asthma": {
                "Fever": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Cough": {"None": 0.10, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.25},
                "Headache": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Fatigue": {"None": 0.30, "Mild": 0.30, "Moderate": 0.25, "Severe": 0.15},
                "Body Pain": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                "Sore Throat": {"None": 0.50, "Mild": 0.30, "Moderate": 0.15, "Severe": 0.05},
                "Runny Nose": {"None": 0.50, "Mild": 0.30, "Moderate": 0.15, "Severe": 0.05},
                "Difficulty Breathing": {"None": 0.05, "Mild": 0.15, "Moderate": 0.35, "Severe": 0.45},
                "Chills": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Loss of Taste/Smell": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Nausea": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Chest Pain": {"None": 0.30, "Mild": 0.25, "Moderate": 0.25, "Severe": 0.20},
                "Dizziness": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Confusion": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01}
            },
            "Tuberculosis": {
                "Fever": {"None": 0.15, "Mild": 0.25, "Moderate": 0.30, "Severe": 0.30},
                "Cough": {"None": 0.05, "Mild": 0.20, "Moderate": 0.35, "Severe": 0.40},
                "Headache": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                "Fatigue": {"None": 0.10, "Mild": 0.25, "Moderate": 0.35, "Severe": 0.30},
                "Body Pain": {"None": 0.20, "Mild": 0.35, "Moderate": 0.30, "Severe": 0.15},
                "Sore Throat": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Runny Nose": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Difficulty Breathing": {"None": 0.15, "Mild": 0.25, "Moderate": 0.30, "Severe": 0.30},
                "Chills": {"None": 0.40, "Mild": 0.30, "Moderate": 0.20, "Severe": 0.10},
                "Loss of Taste/Smell": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                "Nausea": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                "Chest Pain": {"None": 0.25, "Mild": 0.25, "Moderate": 0.25, "Severe": 0.25},
                "Dizziness": {"None": 0.75, "Mild": 0.15, "Moderate": 0.07, "Severe": 0.03},
                "Confusion": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01}
            },
            "Diabetes": {
                "Fever": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                "Cough": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                "Headache": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                "Fatigue": {"None": 0.20, "Mild": 0.35, "Moderate": 0.30, "Severe": 0.15},
                "Body Pain": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                "Sore Throat": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                "Runny Nose": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                "Difficulty Breathing": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                "Chills": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                "Loss of Taste/Smell": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                "Nausea": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                                 "Chest Pain": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                 "Dizziness": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                 "Confusion": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02}
             },
             "Gastroenteritis": {
                 "Fever": {"None": 0.30, "Mild": 0.40, "Moderate": 0.25, "Severe": 0.05},
                 "Cough": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                 "Headache": {"None": 0.50, "Mild": 0.30, "Moderate": 0.15, "Severe": 0.05},
                 "Fatigue": {"None": 0.20, "Mild": 0.35, "Moderate": 0.30, "Severe": 0.15},
                 "Body Pain": {"None": 0.40, "Mild": 0.35, "Moderate": 0.20, "Severe": 0.05},
                 "Sore Throat": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                 "Runny Nose": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Difficulty Breathing": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                 "Chills": {"None": 0.40, "Mild": 0.35, "Moderate": 0.20, "Severe": 0.05},
                 "Loss of Taste/Smell": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Nausea": {"None": 0.05, "Mild": 0.20, "Moderate": 0.40, "Severe": 0.35},
                 "Chest Pain": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Dizziness": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                 "Confusion": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01}
             },
             "Migraine": {
                 "Fever": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Cough": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Headache": {"None": 0.00, "Mild": 0.10, "Moderate": 0.30, "Severe": 0.60},
                 "Fatigue": {"None": 0.20, "Mild": 0.30, "Moderate": 0.35, "Severe": 0.15},
                 "Body Pain": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                 "Sore Throat": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Runny Nose": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Difficulty Breathing": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                 "Chills": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                 "Loss of Taste/Smell": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Nausea": {"None": 0.30, "Mild": 0.35, "Moderate": 0.25, "Severe": 0.10},
                 "Chest Pain": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Dizziness": {"None": 0.20, "Mild": 0.30, "Moderate": 0.30, "Severe": 0.20},
                 "Confusion": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02}
             },
             "Anemia": {
                 "Fever": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Cough": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Headache": {"None": 0.30, "Mild": 0.35, "Moderate": 0.25, "Severe": 0.10},
                 "Fatigue": {"None": 0.00, "Mild": 0.15, "Moderate": 0.35, "Severe": 0.50},
                 "Body Pain": {"None": 0.40, "Mild": 0.35, "Moderate": 0.20, "Severe": 0.05},
                 "Sore Throat": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Runny Nose": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Difficulty Breathing": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                 "Chills": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                 "Loss of Taste/Smell": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Nausea": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                 "Chest Pain": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                 "Dizziness": {"None": 0.20, "Mild": 0.30, "Moderate": 0.30, "Severe": 0.20},
                 "Confusion": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05}
             },
             "Allergic Rhinitis": {
                 "Fever": {"None": 0.95, "Mild": 0.04, "Moderate": 0.01, "Severe": 0.00},
                 "Cough": {"None": 0.30, "Mild": 0.35, "Moderate": 0.25, "Severe": 0.10},
                 "Headache": {"None": 0.60, "Mild": 0.25, "Moderate": 0.10, "Severe": 0.05},
                 "Fatigue": {"None": 0.50, "Mild": 0.30, "Moderate": 0.15, "Severe": 0.05},
                 "Body Pain": {"None": 0.80, "Mild": 0.15, "Moderate": 0.04, "Severe": 0.01},
                 "Sore Throat": {"None": 0.20, "Mild": 0.35, "Moderate": 0.30, "Severe": 0.15},
                 "Runny Nose": {"None": 0.00, "Mild": 0.20, "Moderate": 0.40, "Severe": 0.40},
                 "Difficulty Breathing": {"None": 0.40, "Mild": 0.30, "Moderate": 0.20, "Severe": 0.10},
                 "Chills": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Loss of Taste/Smell": {"None": 0.70, "Mild": 0.20, "Moderate": 0.08, "Severe": 0.02},
                 "Nausea": {"None": 0.85, "Mild": 0.10, "Moderate": 0.04, "Severe": 0.01},
                 "Chest Pain": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00},
                 "Dizziness": {"None": 0.75, "Mild": 0.15, "Moderate": 0.07, "Severe": 0.03},
                 "Confusion": {"None": 0.90, "Mild": 0.08, "Moderate": 0.02, "Severe": 0.00}
             }
         }
    
    def predict(self, symptoms: Dict[str, str]) -> Dict[str, Any]:
        """
        Predict disease probabilities using Bayesian inference.
        
        Args:
            symptoms: Dictionary mapping symptom names to severity levels
            
        Returns:
            Dictionary containing most probable disease and full probability distribution
        """
        # Calculate posterior probabilities for each disease
        posterior_probs = {}
        
        for disease in self.diseases:
            # Start with prior probability
            posterior = self.prior_probabilities[disease]
            
            # Multiply by likelihood of observed symptoms
            for symptom, severity in symptoms.items():
                if symptom in self.cpt[disease] and severity in self.cpt[disease][symptom]:
                    posterior *= self.cpt[disease][symptom][severity]
            
            posterior_probs[disease] = posterior
        
        # Normalize probabilities to sum to 1
        total_prob = sum(posterior_probs.values())
        if total_prob > 0:
            posterior_probs = {disease: prob / total_prob for disease, prob in posterior_probs.items()}
        
        # Find most probable disease
        most_probable = max(posterior_probs.items(), key=lambda x: x[1])
        
        # Sort diseases by probability (descending)
        sorted_diseases = sorted(posterior_probs.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "most_probable_disease": most_probable[0],
            "most_probable_probability": round(most_probable[1] * 100, 2),
            "probability_distribution": {disease: round(prob * 100, 2) for disease, prob in sorted_diseases},
            "all_diseases": sorted_diseases
        }
    
    def get_disease_info(self, disease_name: str) -> Dict[str, Any]:
        """Get additional information about a disease."""
        disease_descriptions = {
            "Common Cold": {
                "description": "A viral infection of the upper respiratory tract that is generally harmless.",
                "common_causes": ["Rhinovirus", "Coronavirus", "Seasonal transmission"],
                "severity": "low"
            },
            "Influenza": {
                "description": "Influenza is a viral infection that attacks the respiratory system.",
                "common_causes": ["Influenza A virus", "Influenza B virus", "Seasonal outbreak"],
                "severity": "moderate"
            },
            "Malaria": {
                "description": "A mosquito-borne infectious disease caused by Plasmodium parasites.",
                "common_causes": ["Plasmodium falciparum", "Plasmodium vivax", "Mosquito bites"],
                "severity": "high"
            },
            "Dengue": {
                "description": "A mosquito-borne viral infection causing flu-like illness.",
                "common_causes": ["Dengue virus", "Aedes mosquito", "Tropical regions"],
                "severity": "moderate"
            },
            "Typhoid": {
                "description": "A bacterial infection caused by Salmonella typhi.",
                "common_causes": ["Salmonella typhi", "Contaminated food/water", "Poor sanitation"],
                "severity": "moderate"
            },
            "Pneumonia": {
                "description": "Infection that inflames air sacs in one or both lungs.",
                "common_causes": ["Bacteria", "Viruses", "Fungi", "Weakened immune system"],
                "severity": "moderate"
            },
            "COVID-19": {
                "description": "Coronavirus disease caused by SARS-CoV-2 virus.",
                "common_causes": ["SARS-CoV-2 virus", "Respiratory droplets", "Close contact"],
                "severity": "moderate"
            },
            "Asthma": {
                "description": "A chronic respiratory condition causing airway inflammation.",
                "common_causes": ["Allergens", "Respiratory infections", "Environmental factors"],
                "severity": "moderate"
            },
            "Tuberculosis": {
                "description": "A bacterial infection that mainly affects the lungs.",
                "common_causes": ["Mycobacterium tuberculosis", "Airborne transmission", "Weakened immune system"],
                "severity": "high"
            },
                         "Diabetes": {
                 "description": "A chronic condition affecting blood sugar regulation.",
                 "common_causes": ["Insulin resistance", "Genetic factors", "Lifestyle factors"],
                 "severity": "moderate"
             },
             "Gastroenteritis": {
                 "description": "Inflammation of the stomach and intestines, commonly caused by viral or bacterial infection.",
                 "common_causes": ["Norovirus", "Rotavirus", "Food poisoning", "Contaminated water"],
                 "severity": "moderate"
             },
             "Migraine": {
                 "description": "A neurological condition characterized by intense, recurring headaches often accompanied by other symptoms.",
                 "common_causes": ["Genetic factors", "Hormonal changes", "Stress", "Certain foods", "Environmental triggers"],
                 "severity": "moderate"
             },
             "Anemia": {
                 "description": "A condition where the body lacks enough healthy red blood cells to carry adequate oxygen to tissues.",
                 "common_causes": ["Iron deficiency", "Vitamin B12 deficiency", "Chronic disease", "Blood loss", "Genetic disorders"],
                 "severity": "moderate"
             },
             "Allergic Rhinitis": {
                 "description": "An allergic response causing inflammation of the nasal passages and upper respiratory tract.",
                 "common_causes": ["Pollen", "Dust mites", "Pet dander", "Mold spores", "Seasonal allergens"],
                 "severity": "low"
             }
        }
        
        return disease_descriptions.get(disease_name, {
            "description": "No additional information available.",
            "common_causes": [],
            "severity": "unknown"
        })
