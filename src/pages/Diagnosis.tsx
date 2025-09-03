import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Stethoscope, Activity, Thermometer, Zap, AlertCircle, User, Snowflake, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

const symptoms = [
  { id: "fever", label: "Fever", icon: Thermometer },
  { id: "cough", label: "Cough", icon: Activity },
  { id: "headache", label: "Headache", icon: AlertCircle },
  { id: "fatigue", label: "Fatigue", icon: Zap },
  { id: "body_pain", label: "Body Pain", icon: User },
  { id: "nausea", label: "Nausea", icon: AlertCircle },
  { id: "cold_shivers", label: "Cold/Shivers", icon: Snowflake },
  { id: "rash", label: "Rash", icon: Palette }
];

const severityOptions = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" }
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

  const handleSubmit = () => {
    const reportedSymptoms = Object.entries(symptomSeverities)
      .filter(([_, severity]) => severity && severity !== "none")
      .map(([symptomId, severity]) => {
        const symptom = symptoms.find(s => s.id === symptomId);
        return `${symptom?.label}: ${severity}`;
      });

    if (reportedSymptoms.length === 0) {
      alert("Please select severity levels for at least one symptom to analyze.");
      return;
    }
    
    alert(`Disease Prediction Analysis\n\nReported Symptoms:\n${reportedSymptoms.join("\n")}\n\nThis is a demonstration. In a real application, this would use Bayesian reasoning to predict possible diseases based on symptom severity levels.`);
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
              {Object.values(symptomSeverities).some(severity => severity && severity !== "none") && (
                <div className="pt-6 border-t border-border/50">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Current Assessment Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(symptomSeverities)
                      .filter(([_, severity]) => severity && severity !== "none")
                      .map(([symptomId, severity]) => {
                        const symptom = symptoms.find(s => s.id === symptomId);
                        const severityColor = 
                          severity === "severe" ? "bg-red-100 text-red-800 border-red-200" :
                          severity === "moderate" ? "bg-orange-100 text-orange-800 border-orange-200" :
                          severity === "mild" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                          "bg-gray-100 text-gray-800 border-gray-200";
                        
                        return (
                          <div
                            key={symptomId}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium ${severityColor}`}
                          >
                            {symptom?.label}: {severity.charAt(0).toUpperCase() + severity.slice(1)}
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