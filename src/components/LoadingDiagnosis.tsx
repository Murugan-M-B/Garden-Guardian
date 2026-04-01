import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Leaf, Microscope, Search } from 'lucide-react';

export const LoadingDiagnosis: React.FC = () => {
  const steps = [
    { icon: Search, text: 'Analyzing image...', delay: 0 },
    { icon: Microscope, text: 'Detecting disease patterns...', delay: 500 },
    { icon: Leaf, text: 'Generating diagnosis...', delay: 1000 }
  ];

  return (
    <Card className="p-12 text-center bg-gradient-nature border-primary/30 shadow-lifted relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 w-16 h-16 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute top-8 right-8 w-12 h-12 bg-accent/10 rounded-full animate-wave"></div>
        <div className="absolute bottom-8 left-1/3 w-20 h-20 bg-success/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-4 right-1/4 w-8 h-8 bg-warning/10 rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary/15 rounded-full animate-pulse-glow shadow-soft">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 animate-fade-in-scale">
          Analyzing Your Plant
        </h2>
        
        <div className="space-y-6 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 bg-card/60 backdrop-blur-sm rounded-xl animate-slide-up shadow-depth hover:bg-card/80 transition-all duration-300"
              style={{ animationDelay: `${step.delay}ms` }}
            >
              <div className="p-3 bg-primary/10 rounded-xl shadow-soft">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-muted-foreground font-medium">
                {step.text}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-muted-foreground ml-3">
            This may take a few moments...
          </p>
        </div>
      </div>
    </Card>
  );
};