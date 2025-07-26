import { useState } from 'react';
import { Volume2, Bot, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiagnosisOutputProps {
  diagnosis: string | null;
  isLoading: boolean;
  onPlayTTS: (text: string) => void;
  timestamp?: Date;
}

export const DiagnosisOutput = ({ diagnosis, isLoading, onPlayTTS, timestamp }: DiagnosisOutputProps) => {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const handlePlayTTS = async () => {
    if (!diagnosis || isPlayingTTS) return;
    
    setIsPlayingTTS(true);
    try {
      await onPlayTTS(diagnosis);
    } finally {
      setIsPlayingTTS(false);
    }
  };

  if (!diagnosis && !isLoading) return null;

  return (
    <div className="medical-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-medical-green/20">
          <Bot className="h-6 w-6 text-medical-green" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Diagnosis</h3>
          {timestamp && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{timestamp.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="loading-spinner h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
              <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          <p className="text-center text-medical-green mt-4 font-medium">
            AI Doctor is analyzing your case...
          </p>
        </div>
      ) : diagnosis ? (
        <div className="glass-effect rounded-xl p-6 space-y-4">
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {diagnosis}
            </p>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              onClick={handlePlayTTS}
              variant="outline"
              size="sm"
              disabled={isPlayingTTS}
              className="rounded-xl hover:bg-primary/10 border-primary/30"
            >
              <Volume2 className={`mr-2 h-4 w-4 ${isPlayingTTS ? 'animate-pulse' : ''}`} />
              {isPlayingTTS ? 'Playing...' : 'Listen'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};