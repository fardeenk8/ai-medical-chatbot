import { Clock, Mic, FileImage, Volume2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface HistoryItem {
  id: string;
  type: 'audio' | 'image';
  diagnosis: string;
  timestamp: Date;
  fileName?: string;
  audioUrl?: string;
  imageUrl?: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onPlayTTS: (text: string) => void;
  apiBaseUrl: string;
}

export const HistoryPanel = ({ history, onPlayTTS, apiBaseUrl }: HistoryPanelProps) => {
  if (history.length === 0) {
    return (
      <div className="medical-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Diagnoses</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No diagnoses yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start by recording your voice or uploading a medical image
          </p>
        </div>
      </div>
    );
  }

  const handleDownloadPdf = (diagnosisId: string) => {
    const pdfUrl = `${apiBaseUrl}/api/diagnosis/pdf/${diagnosisId}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="medical-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Diagnoses</h3>
      
      <ScrollArea className="h-[450px]">
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="glass-effect rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.type === 'audio' ? (
                    <Mic className="h-4 w-4 text-primary" />
                  ) : (
                    <FileImage className="h-4 w-4 text-accent" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {item.type === 'audio' ? 'Voice' : 'Image'} Analysis
                  </span>
                  {item.fileName && (
                    <span className="text-xs text-muted-foreground truncate max-w-24">
                      • {item.fileName}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{item.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
              
              {item.audioUrl && (
                <audio controls src={item.audioUrl} className="w-full mt-2" />
              )}
              {item.imageUrl && (
                <img src={item.imageUrl} alt="Uploaded medical image" className="w-full h-auto rounded-md object-cover mt-2" />
              )}
              <p className="text-sm text-foreground/90 leading-relaxed">
                {item.diagnosis}
              </p>
              
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => handleDownloadPdf(item.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs rounded-lg hover:bg-primary/10"
                >
                  <FileText className="mr-1 h-3 w-3" />
                  PDF
                </Button>
                <Button
                  onClick={() => onPlayTTS(item.diagnosis)}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs rounded-lg hover:bg-primary/10"
                >
                  <Volume2 className="mr-1 h-3 w-3" />
                  Listen
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};