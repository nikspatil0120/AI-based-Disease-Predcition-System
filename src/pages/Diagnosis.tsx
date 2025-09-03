import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Stethoscope, Activity, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const commonSymptoms = [
  { id: "fever", label: "Fever", category: "General" },
  { id: "headache", label: "Headache", category: "Neurological" },
  { id: "cough", label: "Cough", category: "Respiratory" },
  { id: "sore_throat", label: "Sore Throat", category: "Respiratory" },
  { id: "fatigue", label: "Fatigue", category: "General" },
  { id: "nausea", label: "Nausea", category: "Digestive" },
  { id: "stomach_pain", label: "Stomach Pain", category: "Digestive" },
  { id: "muscle_aches", label: "Muscle Aches", category: "Musculoskeletal" },
  { id: "shortness_breath", label: "Shortness of Breath", category: "Respiratory" },
  { id: "chest_pain", label: "Chest Pain", category: "Cardiovascular" },
  { id: "dizziness", label: "Dizziness", category: "Neurological" },
  { id: "skin_rash", label: "Skin Rash", category: "Dermatological" }
];

const categories = ["General", "Respiratory", "Neurological", "Digestive", "Cardiovascular", "Musculoskeletal", "Dermatological"];

const Diagnosis = () => {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    }
  };

  const handleAnalyze = () => {
    // For now, just show an alert with selected symptoms
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom to analyze.");
      return;
    }
    
    const selectedLabels = commonSymptoms
      .filter(symptom => selectedSymptoms.includes(symptom.id))
      .map(symptom => symptom.label);
    
    alert(`Analyzing symptoms: ${selectedLabels.join(", ")}\n\nThis is a demo. In a real application, this would use Bayesian reasoning to predict possible diseases.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
              Symptom Analysis
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select your symptoms below and our AI will analyze them using Bayesian reasoning to predict possible conditions.
            </p>
          </div>

          {/* Symptoms Selection */}
          <div className="grid gap-8">
            {categories.map(category => {
              const categorySymptoms = commonSymptoms.filter(symptom => symptom.category === category);
              return (
                <Card key={category} className="shadow-[var(--card-shadow)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category === "Cardiovascular" && <Heart className="w-5 h-5 text-primary" />}
                      {category === "Respiratory" && <Activity className="w-5 h-5 text-primary" />}
                      {category !== "Cardiovascular" && category !== "Respiratory" && <Stethoscope className="w-5 h-5 text-primary" />}
                      {category} Symptoms
                    </CardTitle>
                    <CardDescription>
                      Select any {category.toLowerCase()} symptoms you're experiencing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorySymptoms.map(symptom => (
                        <div key={symptom.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom.id}
                            checked={selectedSymptoms.includes(symptom.id)}
                            onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                          />
                          <label
                            htmlFor={symptom.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {symptom.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Analysis Section */}
          {selectedSymptoms.length > 0 && (
            <Card className="mt-8 shadow-[var(--card-shadow)]">
              <CardHeader>
                <CardTitle>Selected Symptoms</CardTitle>
                <CardDescription>
                  You have selected {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedSymptoms.map(symptomId => {
                    const symptom = commonSymptoms.find(s => s.id === symptomId);
                    return (
                      <span
                        key={symptomId}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {symptom?.label}
                      </span>
                    );
                  })}
                </div>
                <Button 
                  onClick={handleAnalyze}
                  variant="medical"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Analyze Symptoms
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;