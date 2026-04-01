import React, { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ImageUpload } from '@/components/ImageUpload';
import { LoadingDiagnosis } from '@/components/LoadingDiagnosis';
import { DiagnosisResult, DiagnosisData } from '@/components/DiagnosisResult';
import { getMockDiagnosis } from '@/utils/mockDiagnosis';
import { analyzeImageForDisease } from '@/utils/imageAnalysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AppState = 'welcome' | 'upload' | 'loading' | 'result';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setCurrentState('upload');
  };

  const handleImageUpload = async (file: File) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);

    // Show loading state
    setCurrentState('loading');

    try {
      // First, analyze the image to check if it's an infected plant
      console.log('Starting image analysis...');
      const analysisResult = await analyzeImageForDisease(previewUrl);
      console.log('Analysis result:', analysisResult);

      if (!analysisResult.isValidPlant) {
        // Not a valid infected plant image - show error
        console.log('Image rejected - no visible disease or not a plant');
        toast({
          title: "Infected Plant Required",
          description: "Please upload a clear photo of an infected plant showing visible signs of disease (like brown spots, yellowing, blight). Healthy fruits, other objects, or generic images without clear disease symptoms are not supported.",
          variant: "destructive",
        });
        setCurrentState('upload');
        return;
      }

      console.log('Image accepted - proceeding with diagnosis');
      // Image is likely a tomato - proceed with diagnosis
      const result = await getMockDiagnosis();
      setDiagnosis(result);
      setCurrentState('result');

      toast({
        title: "Diagnosis Complete!",
        description: `Detected: ${result.disease} with ${result.confidence}% confidence`,
      });
    } catch (error) {
      console.error('Error during image processing:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
      setCurrentState('upload');
    }
  };

  const handleClearImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setCurrentState('upload');
  };

  const handleNewDiagnosis = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setDiagnosis(null);
    setCurrentState('upload');
  };

  const handleBackToWelcome = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setDiagnosis(null);
    setCurrentState('welcome');
  };

  // Welcome screen
  if (currentState === 'welcome') {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  // Main app container for upload, loading, and result states
  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-accent/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-success/10 rounded-full animate-wave"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-warning/8 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-gradient-primary/10 rounded-full animate-wave" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative z-10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 animate-fade-in-scale">
            <Button
              variant="ghost"
              onClick={handleBackToWelcome}
              className="text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">Garden Guardian</h1>
              <p className="text-muted-foreground">Plant Disease Diagnosis</p>
            </div>
            
            <div className="w-24" /> {/* Spacer for center alignment */}
          </div>

          {/* Content based on current state */}
          {currentState === 'upload' && (
            <div className="max-w-2xl mx-auto animate-fade-in-scale">
              <Card className="p-10 bg-card/70 backdrop-blur-md border-primary/30 shadow-lifted">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-3">
                    Upload Infected Plant Photo
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Take a clear photo of the affected plant parts showing visible disease signs for accurate diagnosis
                  </p>
                </div>
                
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  preview={uploadedImage || undefined}
                  onClearImage={handleClearImage}
                />
              </Card>
            </div>
          )}

          {currentState === 'loading' && (
            <div className="max-w-2xl mx-auto animate-fade-in-scale">
              <LoadingDiagnosis />
            </div>
          )}

          {currentState === 'result' && diagnosis && (
            <div className="max-w-5xl mx-auto animate-fade-in-scale">
              <DiagnosisResult
                diagnosis={diagnosis}
                onNewDiagnosis={handleNewDiagnosis}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
