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
  commonCauses: string[];
}

// Mock disease prediction results based on symptoms
const mockDiseases: Disease[] = [
  {
    name: "Common Cold",
    probability: 78,
    severity: "low",
    description: "A viral infection of the upper respiratory tract that is generally harmless.",
    commonCauses: ["Rhinovirus", "Coronavirus", "Seasonal transmission"]
  },
  {
    name: "Seasonal Flu",
    probability: 65,
    severity: "moderate", 
    description: "Influenza is a viral infection that attacks the respiratory system.",
    commonCauses: ["Influenza A virus", "Influenza B virus", "Seasonal outbreak"]
  },
  {
    name: "Viral Gastroenteritis",
    probability: 42,
    severity: "moderate",
    description: "Inflammation of the stomach and intestines caused by viral infection.",
    commonCauses: ["Norovirus", "Rotavirus", "Contaminated food/water"]
  },
  {
    name: "Migraine",
    probability: 28,
    severity: "moderate",
    description: "A neurological condition characterized by intense headaches.",
    commonCauses: ["Stress", "Hormonal changes", "Dietary triggers"]
  },
  {
    name: "Tension Headache",
    probability: 15,
    severity: "low",
    description: "The most common type of headache caused by muscle tension.",
    commonCauses: ["Stress", "Poor posture", "Eye strain"]
  }
];

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [symptoms, setSymptoms] = useState<Array<{symptom: string, severity: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get symptoms from navigation state
    const symptomData = location.state?.symptoms || [];
    setSymptoms(symptomData);
    
    // Simulate analysis time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const topDisease = mockDiseases[0];
  const alternativeDiseases = mockDiseases.slice(1);

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
                      {item.symptom}: {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
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
                <h2 className="text-4xl font-bold text-foreground mb-2">{topDisease.name}</h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className={`text-3xl font-bold ${getProbabilityColor(topDisease.probability)}`}>
                    {topDisease.probability}%
                  </span>
                  <Badge className={getSeverityColor(topDisease.severity)} variant="outline">
                    {topDisease.severity.charAt(0).toUpperCase() + topDisease.severity.slice(1)} Risk
                  </Badge>
                </div>
                <Progress 
                  value={topDisease.probability} 
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
                    {topDisease.commonCauses.map((cause, index) => (
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
                      <h3 className="font-semibold text-foreground mb-1">{disease.name}</h3>
                      <p className="text-sm text-muted-foreground">{disease.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(disease.severity)} variant="outline">
                      {disease.severity}
                    </Badge>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${getProbabilityColor(disease.probability)}`}>
                        {disease.probability}%
                      </span>
                      <Progress 
                        value={disease.probability} 
                        className="w-24 h-2 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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