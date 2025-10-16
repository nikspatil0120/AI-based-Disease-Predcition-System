import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, TrendingUp, Info, Stethoscope, Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Disease {
  name: string;
  probability: number;
  severity: "low" | "moderate" | "high";
  description: string;
  common_causes: string[];
}

interface PredictionResponse {
  success: boolean;
  input_symptoms: Record<string, string>;
  most_probable_disease: string;
  most_probable_probability: number;
  top_diseases: Disease[];
  all_probabilities: Record<string, number>;
  analysis_metadata: {
    total_diseases_analyzed: number;
    symptoms_provided: number;
    model_type: string;
  };
}

// Symptom mapping for display
const symptomLabels: Record<string, string> = {
  "Fever": "Fever",
  "Cough": "Cough", 
  "Headache": "Headache",
  "Fatigue": "Fatigue / Weakness",
  "Body Pain": "Body Pain / Muscle Ache",
  "Sore Throat": "Sore Throat",
  "Runny Nose": "Runny Nose",
  "Difficulty Breathing": "Difficulty Breathing",
  "Chills": "Chills / Sweating",
  "Loss of Taste/Smell": "Loss of Taste/Smell",
  "Nausea": "Nausea / Vomiting",
  "Chest Pain": "Chest Pain",
  "Dizziness": "Dizziness",
  "Confusion": "Confusion / Mental Fog"
};

// Disease name mapping for better display
const diseaseLabels: Record<string, string> = {
  "Common Cold": "Common Cold",
  "Influenza": "Influenza",
  "Malaria": "Malaria",
  "Dengue": "Dengue",
  "Typhoid": "Typhoid",
  "Pneumonia": "Pneumonia",
  "COVID-19": "COVID-19",
  "Asthma": "Asthma",
  "Tuberculosis": "Tuberculosis",
  "Diabetes": "Diabetes",
  "Gastroenteritis": "Gastroenteritis (Stomach Flu)",
  "Migraine": "Migraine",
  "Anemia": "Anemia",
  "Allergic Rhinitis": "Allergic Rhinitis (Hay Fever)"
};

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [symptoms, setSymptoms] = useState<Array<{symptom: string, severity: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      // Get symptoms from navigation state
      const symptomData = location.state?.symptoms || [];
      console.log('Symptom data received:', symptomData);
      setSymptoms(symptomData);
      
      if (symptomData.length === 0) {
        console.log('No symptoms provided, redirecting to diagnosis');
        setError("No symptoms provided for analysis. Please go back and select symptoms.");
        setIsLoading(false);
        return;
      }

      try {
        // Convert symptoms to API format
        const apiSymptoms: Record<string, string> = {};
        symptomData.forEach((item: {symptom: string, severity: string}) => {
          apiSymptoms[item.symptom] = item.severity;
        });
        
        console.log('API symptoms being sent:', apiSymptoms);

        // Call backend API
        const token = localStorage.getItem("token");
        const BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:5000";
        const response = await fetch(`${BASE_URL}/api/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: token } : {})
          },
          body: JSON.stringify({ symptoms: apiSymptoms }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data: PredictionResponse = await response.json();
        
        if (data.success) {
          setPredictionData(data);
          // Save to history if logged in
          const token = localStorage.getItem("token");
          if (token) {
            fetch(`${BASE_URL}/api/history`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token
              },
              body: JSON.stringify({
                entry: {
                  date: new Date().toISOString(),
                  symptoms: apiSymptoms,
                  most_probable_disease: data.most_probable_disease,
                  most_probable_probability: data.most_probable_probability
                }
              })
            });
          }
        } else {
          throw new Error('Prediction failed');
        }
      } catch (err) {
        console.error('Prediction error:', err);
        setError(err instanceof Error ? err.message : 'Failed to get prediction');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [location.state]);

  const topDisease = predictionData?.top_diseases[0];
  const alternativeDiseases = predictionData?.top_diseases.slice(1) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "moderate": return "bg-orange-100 text-orange-800 border-orange-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return "text-red-600";
    if (probability >= 50) return "text-orange-600";
    if (probability >= 30) return "text-yellow-600";
    return "text-green-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
            <Activity className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Analyzing Your Symptoms</h2>
            <p className="text-muted-foreground">Our AI is processing your data using Bayesian reasoning...</p>
          </div>
          <div className="w-64 mx-auto">
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in max-w-md mx-auto">
          <div className="p-4 bg-red-100 rounded-full mx-auto w-fit">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Analysis Failed</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate("/diagnosis")}
              variant="medical"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go to Diagnosis
            </Button>
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!predictionData || !topDisease) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="p-4 bg-muted rounded-full mx-auto w-fit">
            <Info className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">No Results Available</h2>
            <p className="text-muted-foreground">Please go through the diagnosis process to get predictions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate("/diagnosis")}
              variant="medical"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Start Diagnosis
            </Button>
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/diagnosis")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back to Symptoms
            </Button>
            <Badge variant="outline" className="text-primary border-primary/30">
              Analysis Complete
            </Badge>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Disease Prediction Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Based on your symptoms, here are the most likely conditions analyzed using advanced Bayesian reasoning.
            </p>
          </div>

          {/* Analyzed Symptoms Summary */}
          {symptoms.length > 0 && (
            <Card className="mb-8 shadow-[var(--card-shadow)] border-0 bg-card/80 backdrop-blur-sm animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Analyzed Symptoms
                </CardTitle>
                <CardDescription>
                  Your reported symptoms used in this analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((item, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="px-3 py-1"
                    >
                      {symptomLabels[item.symptom] || item.symptom}: {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Prediction - Highlighted Card */}
          <Card className="mb-8 shadow-[var(--hero-shadow)] border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 animate-scale-in">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl font-bold text-primary">Most Probable Diagnosis</CardTitle>
              </div>
              <CardDescription className="text-base">
                Highest probability match based on your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                             <div className="text-center">
                 <h2 className="text-4xl font-bold text-foreground mb-2">{diseaseLabels[topDisease.name] || topDisease.name}</h2>
                                                  <div className="flex items-center justify-center gap-4 mb-4">
                   <span className={`text-3xl font-bold ${getProbabilityColor(topDisease.probability * 100)}`}>
                     {(topDisease.probability * 100).toFixed(2)}%
                   </span>
                   <Badge className={getSeverityColor(topDisease.severity)} variant="outline">
                     {topDisease.severity.charAt(0).toUpperCase() + topDisease.severity.slice(1)} Risk
                   </Badge>
                 </div>
                 <Progress 
                   value={topDisease.probability * 100} 
                   className="w-full max-w-md mx-auto h-3 mb-4"
                 />
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 space-y-3">
                <p className="text-foreground leading-relaxed">
                  {topDisease.description}
                </p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Common Causes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {topDisease.common_causes.map((cause, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cause}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Diagnoses */}
          <Card className="shadow-[var(--card-shadow)] border-0 bg-card/80 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Alternative Possible Diagnoses
              </CardTitle>
              <CardDescription>
                Other conditions that match your symptoms, ranked by probability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alternativeDiseases.map((disease, index) => (
                <div 
                  key={disease.name}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-semibold text-sm">
                      {index + 2}
                    </div>
                                         <div className="flex-1">
                       <h3 className="font-semibold text-foreground mb-1">{diseaseLabels[disease.name] || disease.name}</h3>
                       <p className="text-sm text-muted-foreground">{disease.description}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(disease.severity)} variant="outline">
                      {disease.severity}
                    </Badge>
                                                              <div className="text-right">
                       <span className={`text-xl font-bold ${getProbabilityColor(disease.probability * 100)}`}>
                         {(disease.probability * 100).toFixed(2)}%
                       </span>
                       <Progress 
                         value={disease.probability * 100} 
                         className="w-24 h-2 mt-1"
                       />
                     </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analysis Metadata */}
          {predictionData.analysis_metadata && (
            <Card className="mt-8 shadow-[var(--card-shadow)] border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Analysis Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="font-semibold text-foreground">{predictionData.analysis_metadata.total_diseases_analyzed}</div>
                    <div className="text-muted-foreground">Diseases Analyzed</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="font-semibold text-foreground">{predictionData.analysis_metadata.symptoms_provided}</div>
                    <div className="text-muted-foreground">Symptoms Provided</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="font-semibold text-foreground">{predictionData.analysis_metadata.model_type}</div>
                    <div className="text-muted-foreground">Model Type</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold mb-1">Medical Disclaimer</p>
                <p>
                  This is a demonstration of AI-based disease prediction. These results should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              onClick={() => navigate("/diagnosis")}
              variant="medical"
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Analyze Different Symptoms
            </Button>
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;