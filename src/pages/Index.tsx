import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Stethoscope, TrendingUp, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/medical-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced Bayesian reasoning algorithms analyze your symptoms with medical precision."
    },
    {
      icon: Stethoscope,
      title: "Medical Accuracy",
      description: "Based on established medical knowledge and symptom correlation patterns."
    },
    {
      icon: TrendingUp,
      title: "Quick Results",
      description: "Get instant analysis and predictions in seconds, not hours."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health data is processed securely and never stored permanently."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/80 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative z-20 container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Medical Icon */}
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-primary to-secondary rounded-full shadow-[var(--hero-shadow)]">
                <Activity className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              AI-Based Disease
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Prediction System
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Select your symptoms and we'll predict possible diseases using Bayesian reasoning.
            </p>

            {/* CTA Button */}
            <Button 
              onClick={() => navigate("/diagnosis")}
              size="xl"
              className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[var(--hero-shadow)] hover:scale-[1.02] transition-all duration-300 font-semibold"
            >
              <Stethoscope className="w-6 h-6 mr-3" />
              Start Diagnosis
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Trusted by Healthcare Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Advanced Medical AI Technology
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our system combines cutting-edge artificial intelligence with established medical knowledge 
                to provide accurate symptom analysis and disease prediction.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="text-center shadow-[var(--card-shadow)] hover:shadow-[var(--hero-shadow)] transition-all duration-300 hover:-translate-y-1 border-0 bg-card/80 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-accent/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Select Symptoms</h3>
                <p className="text-muted-foreground">Choose from our comprehensive list of symptoms</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">Our Bayesian AI processes your symptom data</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-medical-teal text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Predictions</h3>
                <p className="text-muted-foreground">Receive accurate disease probability assessments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">AI-Based Disease Prediction System</p>
            <p className="text-sm">
              This is a demonstration system. Always consult with healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;