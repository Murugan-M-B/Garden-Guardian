import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Leaf, 
  Camera, 
  Shield, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import heroImage from '@/assets/garden-hero.jpg';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Camera,
      title: 'Photo Analysis',
      description: 'Upload a photo of your diseased plant for instant analysis'
    },
    {
      icon: Shield,
      title: 'Disease Detection',
      description: 'AI-powered diagnosis of common plant diseases and pests'
    },
    {
      icon: Leaf,
      title: 'Organic Solutions',
      description: 'Eco-friendly treatment options for healthier gardens'
    },
    {
      icon: Sparkles,
      title: 'Prevention Tips',
      description: 'Learn how to prevent future plant health issues'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-accent/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-success/20 rounded-full animate-wave"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-warning/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-gradient-primary/20 rounded-full animate-wave" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Healthy garden"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="mb-12 animate-bounce-in">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-hero rounded-full shadow-glow relative">
              <Leaf className="h-14 w-14 text-primary-foreground animate-wave" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 animate-fade-in-scale">
            <span className="bg-gradient-hero bg-clip-text text-transparent">Garden Guardian</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Your AI-powered companion for plant health. Upload a photo of your diseased 
            fruits or vegetables and get instant diagnosis with 
            <span className="text-primary font-semibold"> organic and chemical </span>
            treatment recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{animationDelay: '0.3s'}}>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onGetStarted}
              className="text-xl px-12 py-8 h-auto group relative overflow-hidden"
            >
              <span className="relative z-10">Start Diagnosing</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              <span>Free • No Registration Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in-scale">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              How Garden Guardian Helps
            </span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Professional plant care guidance at your fingertips with AI-powered precision
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group p-8 text-center hover:shadow-lifted transition-all duration-500 hover:-translate-y-2 bg-card/60 backdrop-blur-md border-primary/20 relative overflow-hidden animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-primary/10 rounded-2xl group-hover:bg-gradient-primary/20 transition-all duration-500 group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors duration-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-hero py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-wave"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-fade-in-scale">
            Ready to Save Your Garden?
          </h3>
          <p className="text-primary-foreground/90 text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Join thousands of gardeners who trust Garden Guardian for plant health. 
            Get instant, professional-grade diagnosis powered by advanced AI technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={onGetStarted}
              className="text-xl px-12 py-8 h-auto bg-white/95 hover:bg-white text-primary hover:scale-105 transition-all duration-500 shadow-lifted group relative overflow-hidden"
            >
              <span className="relative z-10">Get Started Now</span>
              <Camera className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
            
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-success rounded-full border-2 border-white/20"></div>
                <div className="w-8 h-8 bg-gradient-warning rounded-full border-2 border-white/20"></div>
                <div className="w-8 h-8 bg-gradient-accent rounded-full border-2 border-white/20"></div>
              </div>
              <span className="text-sm">Trusted by 10,000+ gardeners</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};