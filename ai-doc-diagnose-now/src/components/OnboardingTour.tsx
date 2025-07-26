import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, Mic, Image, Send, History } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  highlight?: string;
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'voice-recorder',
    title: 'Voice Recording',
    description: 'Record your symptoms and medical concerns. Our AI will analyze your voice for preliminary diagnosis.',
    icon: <Mic className="h-5 w-5" />,
    position: { top: '20%', left: '20%' },
    highlight: 'voice-recorder'
  },
  {
    id: 'image-upload',
    title: 'Medical Images',
    description: 'Upload X-rays, scans, or photos of medical conditions for AI analysis and diagnosis.',
    icon: <Image className="h-5 w-5" />,
    position: { top: '40%', left: '20%' },
    highlight: 'image-upload'
  },
  {
    id: 'submit-button',
    title: 'Get Diagnosis',
    description: 'Submit your recording or image to receive an AI-powered medical diagnosis and recommendations.',
    icon: <Send className="h-5 w-5" />,
    position: { top: '60%', left: '30%' },
    highlight: 'submit-button'
  },
  {
    id: 'history-panel',
    title: 'Medical History',
    description: 'View all your past diagnoses, track health trends, and listen to previous consultations.',
    icon: <History className="h-5 w-5" />,
    position: { top: '20%', right: '20%' },
    highlight: 'history-panel'
  }
];

export const OnboardingTour = ({ isOpen, onClose }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Tour card */}
      <Card 
        className="absolute z-10 w-80 medical-card border-primary/50"
        style={step.position}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                {step.icon}
              </div>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {step.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Skip Tour
              </Button>
              
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-8 px-3"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                size="sm"
                className="h-8 px-3 medical-glow"
              >
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < tourSteps.length - 1 && (
                  <ArrowRight className="h-3 w-3 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlight effect */}
      {step.highlight && (
        <div
          className="absolute pointer-events-none border-2 border-primary rounded-lg shadow-lg animate-pulse"
          style={{
            boxShadow: '0 0 0 4px hsl(var(--primary) / 0.2), 0 0 20px hsl(var(--primary) / 0.4)'
          }}
        />
      )}
    </div>
  );
};