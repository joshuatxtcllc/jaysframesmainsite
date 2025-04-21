import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mic, MicOff, Send, Volume2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Add TypeScript types for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
  error?: any;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

// Extend Window interface to include Speech API
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface FrameAssistantResponse {
  response: string;
}

export default function VoiceFrameAssistant() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAutoSubmit, setIsAutoSubmit] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          const { resultIndex, results } = event;
          let newTranscript = '';
          
          for (let i = resultIndex; i < results.length; i++) {
            if (results[i].isFinal) {
              newTranscript += results[i][0].transcript;
            }
          }
          
          if (newTranscript.trim()) {
            setTranscript(prevTranscript => {
              const combinedTranscript = prevTranscript + ' ' + newTranscript;
              setMessage(combinedTranscript.trim());
              return combinedTranscript.trim();
            });
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone Access Required",
              description: "Please allow microphone access to use voice features.",
              variant: "destructive"
            });
          }
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          // Auto-submit when speech recognition ends if auto-submit is enabled
          if (isAutoSubmit && transcript.trim() && !isLoading) {
            handleSubmit();
          }
          setIsListening(false);
        };
      }
    } else {
      setSpeechSupported(false);
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition. Please use a different browser or the text input.",
        variant: "destructive"
      });
    }
    
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        if (isListening) {
          recognitionRef.current.stop();
        }
      }
      
      if (synthesisRef.current && synthesisRef.current.speaking) {
        synthesisRef.current.cancel();
      }
    };
  }, [isAutoSubmit, transcript, isLoading]);

  const toggleListening = () => {
    if (!speechSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition. Please use a different browser or the text input.",
        variant: "destructive"
      });
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          toast({
            title: "Recognition Error",
            description: "Failed to start speech recognition. Please try again.",
            variant: "destructive"
          });
        }
      }
    }
  };

  const speakResponse = (text: string) => {
    if (!synthesisRef.current) return;
    
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    synthesisRef.current.speak(utterance);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter or speak a message');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const fetchResponse = await apiRequest(
        'POST',
        '/api/frame-assistant',
        { message }
      );
      
      const result = await fetchResponse.json() as FrameAssistantResponse;
      setResponse(result.response);
      
      // Speak the response
      if (synthesisRef.current) {
        speakResponse(result.response);
      }
    } catch (err) {
      console.error('Error contacting Frame Assistant:', err);
      setError('Failed to get a response from the Frame Design Assistant. Please try again.');
    } finally {
      setIsLoading(false);
      setTranscript(''); // Reset transcript after submission
      setMessage(''); // Reset message after submission
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Voice-Activated Frame Design Assistant</h1>
      <p className="text-center mb-8 text-gray-600">
        Ask the Frame Design Assistant using your voice or text about custom framing, materials, preservation techniques, or design recommendations.
      </p>

      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-submit" className="text-sm">Auto-submit when speech ends</Label>
          <Switch 
            id="auto-submit"
            checked={isAutoSubmit} 
            onCheckedChange={setIsAutoSubmit} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Question</CardTitle>
              {isListening && (
                <Badge variant="outline" className="bg-red-100 text-red-800 animate-pulse">
                  Listening...
                </Badge>
              )}
            </div>
            <CardDescription>
              Be specific about artwork style, colors, dimensions, or preservation needs.
            </CardDescription>
          </CardHeader>
          <form onSubmit={(e) => handleSubmit(e)}>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="For example: 'I have a vintage watercolor painting of a beach scene with soft blues and sandy colors. It's 11x14 inches. What frame would complement this?'"
                className="min-h-[120px]"
              />
              {error && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleListening}
                  disabled={!speechSupported || isLoading}
                  title={speechSupported ? "Toggle voice input" : "Speech recognition not supported"}
                  className="flex gap-1"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isListening ? "Stop" : "Start"} Listening
                </Button>
                {response && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => speakResponse(response)}
                    disabled={!response}
                    className="flex gap-1"
                  >
                    <Volume2 className="h-4 w-4" />
                    Read Response
                  </Button>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="flex gap-1">
                <Send className="h-4 w-4" />
                {isLoading ? 'Getting Response...' : 'Ask Assistant'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>Frame Design Assistant Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {response.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}