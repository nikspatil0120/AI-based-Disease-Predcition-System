import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Stethoscope, Activity, Thermometer, Zap, AlertCircle, User, Snowflake } from "lucide-react";
import { useNavigate } from "react-router-dom";

const baseSymptoms = [
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
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState("");
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [adding, setAdding] = useState(false);

  const allSymptoms = [
    ...baseSymptoms,
    ...customSymptoms.map((cs) => ({ id: cs, label: cs, icon: AlertCircle }))
  ];

  useEffect(() => {
    const loadCustomSymptoms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:5000";
        const res = await fetch(`${BASE_URL}/api/custom-symptoms`, {
          headers: { Authorization: token }
        });
        if (res.status === 401) {
          setValidationMsg("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          setTimeout(() => {
            navigate("/login");
          }, 800);
          return;
        }
        const data = await res.json();
        if (data.success) setCustomSymptoms(data.custom_symptoms || []);
      } catch (_) {}
    };
    loadCustomSymptoms();
  }, []);

  const handleSymptomChange = (symptomId: string, severity: string) => {
    setSymptomSeverities(prev => ({
      ...prev,
      [symptomId]: severity
    }));
  };

  const validateAndAddSymptom = async () => {
    setValidationMsg("");
    const text = newSymptom.trim();
    if (!text) return;
    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:5000";
      const res = await fetch(`${BASE_URL}/api/custom-symptoms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || ""
        },
        body: JSON.stringify({ text })
      });
      if (res.status === 401) {
        setValidationMsg("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setTimeout(() => navigate("/login"), 800);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setCustomSymptoms(data.custom_symptoms);
        setNewSymptom("");
        setValidationMsg("Added successfully");
        setTimeout(() => setValidationMsg(""), 1500);
      } else {
        setValidationMsg(data.error || "Invalid symptom");
      }
    } catch (_) {
      setValidationMsg("Network error");
    } finally {
      setAdding(false);
    }
  };

  const handleSubmit = async () => {
    const reportedSymptoms = Object.entries(symptomSeverities)
      .filter(([_, severity]) => severity && severity !== "None")
      .map(([symptomId, severity]) => {
        const symptom = allSymptoms.find(s => s.id === symptomId);
        return { symptom: symptom?.id || symptomId, severity };
      });

    if (reportedSymptoms.length === 0) {
      alert("Please select severity levels for at least one symptom to analyze.");
      return;
    }
    navigate("/results", { state: { symptoms: reportedSymptoms } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Disease Prediction Form</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please rate the severity of each symptom you're experiencing. You can also add custom symptoms below.
            </p>
          </div>

          <Card className="shadow-[var(--card-shadow)] border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold">Symptom Assessment</CardTitle>
              <CardDescription className="text-base">Rate each symptom and add your own if needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom symptom input */}
              <div className="bg-background/60 p-4 rounded-lg border border-border/60">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    placeholder="Type a custom symptom (e.g., Back Pain)"
                    className="flex-1 border border-border/70 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  />
                  <Button onClick={validateAndAddSymptom} disabled={adding}>
                    Add
                  </Button>
                </div>
                {validationMsg && (
                  <div className="text-sm mt-2 text-muted-foreground">{validationMsg}</div>
                )}
                {customSymptoms.length > 0 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Added: {customSymptoms.join(", ")}
                  </div>
                )}
              </div>

              {/* Symptoms Form */}
              <div className="grid gap-6">
                {allSymptoms.map((symptom) => {
                  const IconComponent = symptom.icon;
                  return (
                    <div key={symptom.id} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <label className="text-sm font-medium text-foreground">{symptom.label}</label>
                      </div>
                      <Select value={symptomSeverities[symptom.id] || ""} onValueChange={(value) => handleSymptomChange(symptom.id, value)}>
                        <SelectTrigger className="w-full bg-background border-border hover:border-primary/50 transition-colors">
                          <SelectValue placeholder="Select severity level" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border shadow-lg z-50">
                          {severityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8">
                <Button onClick={handleSubmit} variant="medical" size="lg" className="w-full h-14 text-lg font-semibold">
                  <Activity className="w-6 h-6 mr-3" />
                  Analyze Symptoms & Predict Disease
                </Button>
              </div>

              {Object.values(symptomSeverities).some((severity) => severity && severity !== "None") && (
                <div className="pt-6 border-t border-border/50">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Current Assessment Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(symptomSeverities)
                      .filter(([_, severity]) => severity && severity !== "None")
                      .map(([symptomId, severity]) => {
                        const symptom = allSymptoms.find((s) => s.id === symptomId);
                        const severityColor =
                          severity === "Severe"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : severity === "Moderate"
                            ? "bg-orange-100 text-orange-800 border-orange-200"
                            : severity === "Mild"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-800 border-gray-200";

                        return (
                          <div key={symptomId} className={`px-3 py-2 rounded-lg border text-sm font-medium ${severityColor}`}>
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