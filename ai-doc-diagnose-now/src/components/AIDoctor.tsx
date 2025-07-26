import { useState, useEffect } from 'react';
import { Brain, Send, Loader2, HelpCircle, BarChart3, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { VoiceRecorder } from './VoiceRecorder';
import { ImageUpload } from './ImageUpload';
import { DiagnosisOutput } from './DiagnosisOutput';
import { HistoryPanel, HistoryItem } from './HistoryPanel';
import { OnboardingTour } from './OnboardingTour';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { HelpTooltip } from './HelpTooltip';
import { HealthTrendChart } from './HealthTrendChart';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AIDoctor = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [diagnosisTimestamp, setDiagnosisTimestamp] = useState<Date | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { toast } = useToast();

  // Generate sample health trend data
  const [healthTrendData, setHealthTrendData] = useState(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        diagnosisCount: Math.floor(Math.random() * 5) + 1,
        severity: Math.floor(Math.random() * 40) + 20,
        responseTime: Math.random() * 3 + 1,
        confidence: Math.floor(Math.random() * 20) + 80,
      });
    }
    return data;
  });


  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const handleSubmitDiagnosis = async () => {
    if (!audioBlob && !selectedImage) {
      toast({
        title: "No input provided",
        description: "Please record your voice or upload a medical image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentDiagnosis(null);

    try {
      const newId = Date.now().toString(); // Generate ID here
      const formData = new FormData();
      if (audioBlob) formData.append("audio", audioBlob, "recording.wav");
      if (selectedImage) formData.append("image", selectedImage);
      if (selectedSymptom) formData.append("symptom", selectedSymptom);
      formData.append("frontendId", newId); // Add frontendId to formData

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Diagnosis failed");

      const result = await response.json();
      const { diagnosis, transcript, voice_url } = result;

      const timestamp = new Date();
      setDiagnosisTimestamp(timestamp);
      setCurrentDiagnosis(diagnosis);

      setHistory(prev => [
        {
          id: newId,
          type: audioBlob && selectedImage ? 'audio' : audioBlob ? 'audio' : 'image',
          diagnosis,
          timestamp,
          fileName: selectedImage?.name,
          audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
          imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        },
        ...prev,
      ]);

      const audio = new Audio(voice_url);
      audio.play();
      audio.addEventListener('ended', () => URL.revokeObjectURL(voice_url));

      toast({
        title: "Diagnosis Complete",
        description: "AI Doctor has analyzed your case and responded.",
      });

      setAudioBlob(null);
      setAudioUrl(null);
      setSelectedImage(null);
      setImageUrl(null);

    } catch (error) {
      console.error("Diagnosis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTTS = async (text: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
      audio.addEventListener('ended', () => URL.revokeObjectURL(audioUrl));
    } catch (error) {
      console.error('TTS error:', error);
      toast({
        title: "Audio Playback Failed",
        description: "Unable to play the diagnosis audio.",
        variant: "destructive",
      });
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setAudioUrl(URL.createObjectURL(blob));
    setImageUrl(null);
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImageUrl(URL.createObjectURL(file));
    setAudioUrl(null);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImageUrl(null);
  };

  const canSubmit = (audioBlob || selectedImage) && !isLoading;

  const handleTourComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/MediCare-AI-logo1.png" alt="MediCare AI Logo" className="h-16 w-16" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">MediCare AI </h1>
                <p className="text-sm text-muted-foreground">
                  Your personal medical AI assistant 
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpTooltip content="Need help? Click to restart the tutorial tour">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOnboarding(true)}
                  className="h-8 w-8 p-0"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </HelpTooltip>
              {!isLoggedIn ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <Button onClick={handleLogout} size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Logout
                </Button>
              )}
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="diagnosis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Diagnosis
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagnosis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Input Methods */}
                <div className="lg:col-span-2 space-y-6">
                  <div id="voice-recorder">
                    <VoiceRecorder 
                      onRecordingComplete={handleRecordingComplete}
                      isDisabled={isLoading}
                      onSymptomSelect={setSelectedSymptom}
                    />
                  </div>
                  
                  <div id="image-upload">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      selectedImage={selectedImage}
                      onImageRemove={handleImageRemove}
                      isDisabled={isLoading}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center" id="submit-button">
                    <Button
                      onClick={handleSubmitDiagnosis}
                      disabled={!canSubmit}
                      className="h-14 px-8 rounded-2xl font-semibold text-lg bg-primary hover:bg-primary/90 medical-glow transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="mr-3 h-6 w-6" />
                          Get Diagnosis
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Diagnosis Output */}
                  <DiagnosisOutput
                    diagnosis={currentDiagnosis}
                    isLoading={isLoading}
                    onPlayTTS={handlePlayTTS}
                    timestamp={diagnosisTimestamp}
                  />
                </div>

                {/* Right Column - Quick History */}
                <div className="lg:col-span-1" id="history-panel">
                  <HistoryPanel 
                    history={history.slice(0, 5)}
                    onPlayTTS={handlePlayTTS}
                    apiBaseUrl={API_BASE_URL}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <HealthTrendChart data={healthTrendData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <footer className="mt-16 py-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground max-w-xl mx-auto px-4">
          ⚠️ <span className="font-medium italic">Disclaimer:</span> This AI assistant is for educational and informational purposes only. It is not a licensed medical professional. Please consult a qualified doctor for any serious health concerns.
        </p>
      </footer>
      <OnboardingTour isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};