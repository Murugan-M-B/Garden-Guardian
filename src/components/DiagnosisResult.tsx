import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Leaf, 
  Droplets, 
  Sun, 
  Scissors,
  RotateCcw
} from 'lucide-react';

export interface DiagnosisData {
  disease: string;
  confidence: number;
  cause: string;
  severity: 'low' | 'medium' | 'high';
  organicSolutions: string[];
  chemicalSolutions: string[];
  prevention: string[];
}

interface DiagnosisResultProps {
  diagnosis: DiagnosisData;
  onNewDiagnosis: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosis,
  onNewDiagnosis
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'organic': return <Leaf className="h-4 w-4" />;
      case 'chemical': return <Droplets className="h-4 w-4" />;
      case 'prevention': return <Sun className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Main diagnosis */}
      <Card className="p-8 bg-gradient-nature border-primary/30 shadow-lifted relative overflow-hidden group">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary/5 rounded-full animate-wave"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-accent/5 rounded-full animate-float"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-2xl shadow-soft animate-pulse-glow">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {diagnosis.disease}
                </h2>
                <p className="text-lg text-muted-foreground">
                  Confidence: <span className="font-semibold text-primary">{diagnosis.confidence}%</span>
                </p>
              </div>
            </div>
            <Badge className={`${getSeverityColor(diagnosis.severity)} text-sm px-4 py-2 animate-bounce-in`}>
              {diagnosis.severity.toUpperCase()}
            </Badge>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-depth">
            <h3 className="font-bold text-foreground mb-3 text-lg">Cause</h3>
            <p className="text-muted-foreground leading-relaxed">{diagnosis.cause}</p>
          </div>
        </div>
      </Card>

      {/* Solutions */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Organic Solutions */}
        <Card className="p-8 border-success/30 hover:shadow-lifted transition-all duration-500 hover:-translate-y-1 bg-gradient-success/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-success/10 rounded-full animate-float"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-success/10 rounded-xl shadow-soft">
                <Leaf className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Organic Solutions
              </h3>
            </div>
            <ul className="space-y-4">
              {diagnosis.organicSolutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3 group/item">
                  <div className="w-3 h-3 bg-gradient-success rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300" />
                  <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 leading-relaxed">
                    {solution}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Chemical Solutions */}
        <Card className="p-8 border-warning/30 hover:shadow-lifted transition-all duration-500 hover:-translate-y-1 bg-gradient-warning/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-warning/10 rounded-full animate-wave"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-warning/10 rounded-xl shadow-soft">
                <Droplets className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Chemical Solutions
              </h3>
            </div>
            <ul className="space-y-4">
              {diagnosis.chemicalSolutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3 group/item">
                  <div className="w-3 h-3 bg-gradient-warning rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300" />
                  <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 leading-relaxed">
                    {solution}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Prevention */}
      <Card className="p-8 bg-gradient-earth/30 border-primary/30 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-accent/5"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl shadow-soft animate-float">
              <Sun className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Prevention Tips
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosis.prevention.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-card/60 rounded-lg border border-border/30 hover:bg-card/80 transition-all duration-300 group/tip">
                <Scissors className="h-5 w-5 text-primary mt-1 flex-shrink-0 group-hover/tip:rotate-12 transition-transform duration-300" />
                <span className="text-sm text-muted-foreground group-hover/tip:text-foreground transition-colors duration-300 leading-relaxed">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* New diagnosis button */}
      <div className="flex justify-center pt-4">
        <Button 
          variant="garden" 
          size="lg" 
          onClick={onNewDiagnosis}
          className="text-lg px-10 py-6 h-auto group relative overflow-hidden"
        >
          <span className="relative z-10">Diagnose Another Plant</span>
          <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </Button>
      </div>
    </div>
  );
};