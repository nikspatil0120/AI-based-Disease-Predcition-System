import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Stethoscope, Activity, Thermometer, Zap, AlertCircle, User, Snowflake, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

const symptoms = [
  { id: "Fever", label: "Fever", icon: Thermometer },
  { id: "Cough", label: "Cough", icon: Activity },
  { id: "Headache", label: "Headache", icon: AlertCircle },
  { id: "Fatigue", label: "Fatigue / Weakness", icon: Zap },
  { id: "Body Pain", label: "Body Pain / Muscle Ache", icon: User },
  { id: "Sore Throat", label: "Sore Throat", icon: AlertCircle },
  { id: "Runny Nose", label: "Runny Nose", icon: Activity },
  { id: "Difficulty Breathing", label: "Difficulty Breathing", icon: AlertCircle },
  { id: "Chills", label: "Chills / Sweating", icon: Snowflake },
  { id: "Loss of Taste/Smell", label: "Loss of Taste/Smell", icon: Activity },
  { id: "Nausea", label: "Nausea / Vomiting", icon: AlertCircle },
  { id: "Chest Pain", label: "Chest Pain", icon: AlertCircle },
  { id: "Dizziness", label: "Dizziness", icon: AlertCircle },
  { id: "Confusion", label: "Confusion / Mental Fog", icon: AlertCircle }
];

const severityOptions = [
  { value: "None", label: "None" },
  { value: "Mild", label: "Mild" },
  { value: "Moderate", label: "Moderate" },
  { value: "Severe", label: "Severe" }
];

const Diagnosis = () => {
  const navigate = useNavigate();
  const [symptomSeverities, setSymptomSeverities] = useState<Record<string, string>>({});

  const handleSymptomChange = (symptomId: string, severity: string) => {
    setSymptomSeverities(prev => ({
      ...prev,
      [symptomId]: severity
    }));
  };

  const handleSubmit = async () => {
    const reportedSymptoms = Object.entries(symptomSeverities)
      .filter(([_, severity]) => severity && severity !== "None")
      .map(([symptomId, severity]) => {
        const symptom = symptoms.find(s => s.id === symptomId);
        return { symptom: symptom?.id || symptomId, severity };
      });

    if (reportedSymptoms.length === 0) {
      alert("Please select severity levels for at least one symptom to analyze.");
      return;
    }
    
    // Navigate to results page with symptom data
    navigate("/results", { 
      state: { 
        symptoms: reportedSymptoms 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Disease Prediction Form
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please rate the severity of each symptom you're experiencing. Our AI will analyze your responses using Bayesian reasoning.
            </p>
          </div>

          {/* Main Form Card */}
          <Card className="shadow-[var(--card-shadow)] border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold">Symptom Assessment</CardTitle>
              <CardDescription className="text-base">
                Rate each symptom from None to Severe based on your current condition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Symptoms Form */}
              <div className="grid gap-6">
                {symptoms.map((symptom) => {
                  const IconComponent = symptom.icon;
                  return (
                    <div key={symptom.id} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <label className="text-sm font-medium text-foreground">
                          {symptom.label}
                        </label>
                      </div>
                      <Select 
                        value={symptomSeverities[symptom.id] || ""} 
                        onValueChange={(value) => handleSymptomChange(symptom.id, value)}
                      >
                        <SelectTrigger className="w-full bg-background border-border hover:border-primary/50 transition-colors">
                          <SelectValue placeholder="Select severity level" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border shadow-lg z-50">
                          {severityOptions.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <Button 
                  onClick={handleSubmit}
                  variant="medical"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold"
                >
                  <Activity className="w-6 h-6 mr-3" />
                  Analyze Symptoms & Predict Disease
                </Button>
              </div>

              {/* Summary */}
              {Object.values(symptomSeverities).some(severity => severity && severity !== "None") && (
                <div className="pt-6 border-t border-border/50">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Current Assessment Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(symptomSeverities)
                      .filter(([_, severity]) => severity && severity !== "None")
                      .map(([symptomId, severity]) => {
                        const symptom = symptoms.find(s => s.id === symptomId);
                        const severityColor = 
                          severity === "Severe" ? "bg-red-100 text-red-800 border-red-200" :
                          severity === "Moderate" ? "bg-orange-100 text-orange-800 border-orange-200" :
                          severity === "Mild" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                          "bg-gray-100 text-gray-800 border-gray-200";
                        
                        return (
                          <div
                            key={symptomId}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium ${severityColor}`}
                          >
                            {symptom?.label}: {String(severity).charAt(0).toUpperCase() + String(severity).slice(1)}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;