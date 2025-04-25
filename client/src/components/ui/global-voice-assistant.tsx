import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mic, MicOff, Volume2, Loader2, X, 
  Maximize2, Minimize2, ImageIcon, FileQuestion
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

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

interface GlobalVoiceAssistantProps {
  triggerPhrase?: string;
}

export default function GlobalVoiceAssistant({ triggerPhrase = 'hey echo' }: GlobalVoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [listeningMode, setListeningMode] = useState<'continuous' | 'command'>('command');
  const [isPermanentlyListening, setIsPermanentlyListening] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  
  // Setup WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const setupWebSocket = () => {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different response types
          if (data.type === 'voice_response') {
            setResponse(data.response);
            speakResponse(data.response);
            setIsProcessingCommand(false);
          }
          else if (data.type === 'image_analysis_result') {
            const analysisResult = data.analysis;
            const analysisDescription = `Based on your image, I've analyzed it as a ${analysisResult.artworkType} with ${analysisResult.dominantColors.join(', ')} colors in a ${analysisResult.style} style. The mood appears to be ${analysisResult.mood}. I've selected frames and mats that would complement this artwork.`;
            
            setResponse(analysisDescription + '\n\n' + analysisResult.reasoning);
            speakResponse(analysisDescription);
            setIsAnalyzingImage(false);
          }
          else if (data.type === 'order_status_result') {
            const order = data.order;
            const statusMessage = `Order #${order.id} for ${order.customerName} is currently ${order.status}. Stage: ${order.currentStage || 'Processing'}. ${order.estimatedCompletion ? `Estimated completion on ${new Date(order.estimatedCompletion).toLocaleDateString()}.` : ''}`;
            
            setResponse(statusMessage);
            speakResponse(statusMessage);
            setIsProcessingCommand(false);
          }
          else if (data.type === 'error') {
            setResponse(`Error: ${data.message}`);
            speakResponse(`I'm sorry, there was an error: ${data.message}`);
            setIsProcessingCommand(false);
            setIsAnalyzingImage(false);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to establish voice assistant connection",
          variant: "destructive"
        });
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        // Try to reconnect after 2 seconds
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            setupWebSocket();
          }
        }, 2000);
      };
    };
    
    setupWebSocket();
    
    // Clean up WebSocket connection when component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
  
  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const { resultIndex, results } = event;
          let newTranscript = '';
          
          for (let i = resultIndex; i < results.length; i++) {
            const transcript = results[i][0].transcript.trim().toLowerCase();
            
            if (results[i].isFinal) {
              newTranscript += transcript;
              
              // Check for trigger phrase in continuous mode
              if (listeningMode === 'continuous' && !isOpen) {
                const hasTriggerPhrase = transcript.includes(triggerPhrase.toLowerCase());
                
                if (hasTriggerPhrase) {
                  // Open the assistant when trigger phrase is detected
                  setIsOpen(true);
                  speakResponse("Hello, I'm your frame assistant. How can I help you?");
                  continue;
                }
              }
            }
          }
          
          if (newTranscript.trim()) {
            setTranscript(prevTranscript => {
              const combinedTranscript = prevTranscript + ' ' + newTranscript;
              return combinedTranscript.trim();
            });
          }
        };
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
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
          setIsListening(false);
          
          // Restart recognition if in permanent listening mode
          if (isPermanentlyListening && !isProcessingCommand) {
            startListening();
          }
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
  }, [isPermanentlyListening, isProcessingCommand, listeningMode, triggerPhrase]);
  
  // Function to start listening
  const startListening = useCallback(() => {
    if (!speechSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition. Please use the text input.",
        variant: "destructive"
      });
      return;
    }
    
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
  }, [speechSupported]);
  
  // Function to stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);
  
  // Process voice command
  const processVoiceCommand = useCallback(() => {
    if (!transcript.trim()) return;
    
    setIsProcessingCommand(true);
    
    // Check if the transcript contains order status request
    if (/order (status|update) .*(order|number) ([\d]+)/i.test(transcript)) {
      const orderNumberMatch = transcript.match(/order (status|update) .*(order|number) ([\d]+)/i);
      if (orderNumberMatch && orderNumberMatch[3]) {
        const orderNumber = orderNumberMatch[3];
        
        // Send order status request via WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'order_status',
            orderNumber
          }));
        } else {
          setResponse("I'm sorry, I couldn't connect to the order system. Please try again later.");
        }
      }
    }
    // Check if the transcript contains pricing inquiry
    else if (/how much would .* cost/i.test(transcript)) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'voice_command',
          message: transcript
        }));
      } else {
        setResponse("I'm sorry, I couldn't connect to the pricing system. Please try again later.");
      }
    }
    // For all other commands, send to the AI assistant
    else {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'voice_command',
          message: transcript
        }));
      } else {
        setResponse("I'm sorry, I couldn't connect to the assistant. Please try again later.");
      }
    }
    
    // Clear transcript after processing
    setTranscript('');
  }, [transcript]);
  
  // Speak response using speech synthesis
  const speakResponse = useCallback((text: string) => {
    if (!synthesisRef.current) return;
    
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    synthesisRef.current.speak(utterance);
  }, []);
  
  // Handle file selection for image upload
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Set the selected file and create a preview URL
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, []);
  
  // Convert a file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Analyze the uploaded artwork image
  const analyzeImage = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image of your artwork to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzingImage(true);
    
    try {
      // Convert the file to base64
      const base64Image = await fileToBase64(selectedFile);
      
      // Send the image to the WebSocket server
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'analyze_image',
          imageData: base64Image
        }));
      } else {
        setIsAnalyzingImage(false);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the image analysis service",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setIsAnalyzingImage(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Toggle permanent listening mode
  const togglePermanentListening = () => {
    setIsPermanentlyListening(prev => {
      const newValue = !prev;
      
      if (newValue) {
        startListening();
      } else {
        stopListening();
      }
      
      return newValue;
    });
  };
  
  // Command handling button click
  const handleCommandClick = () => {
    processVoiceCommand();
  };
  
  // If not open, only render the floating button
  if (!isOpen) {
    return (
      <>
        {/* Listening indicator when closed but still listening */}
        {isListening && isPermanentlyListening && (
          <div className="fixed top-4 right-4 z-40">
            <Badge variant="outline" className="bg-red-100 text-red-800 animate-pulse px-3 py-1">
              <Mic className="h-4 w-4 mr-2" />
              Listening...
            </Badge>
          </div>
        )}
        
        {/* Floating assistant button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={() => setIsOpen(true)} 
            className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
            variant="default"
          >
            <Mic className="h-6 w-6" />
          </Button>
        </div>
      </>
    );
  }
  
  return (
    <div className={`fixed ${isExpanded ? 'inset-0' : 'bottom-4 right-4 max-w-md'} z-50 transition-all duration-300 ease-in-out`}>
      <Card className={`shadow-xl ${isExpanded ? 'h-full rounded-none' : 'rounded-xl'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-md font-medium">
            Voice Frame Assistant
            {isListening && (
              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 animate-pulse">
                Listening...
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="h-7 w-7"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className={`space-y-4 ${isExpanded ? 'overflow-y-auto pb-20' : 'max-h-[70vh] overflow-y-auto'}`}>
          {/* Listening mode controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="permanent-listening" className="text-sm">Always listen for "{triggerPhrase}"</Label>
              <Switch 
                id="permanent-listening"
                checked={isPermanentlyListening} 
                onCheckedChange={togglePermanentListening} 
              />
            </div>
          </div>
          
          {/* Voice command input box */}
          {transcript && (
            <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/20">
              <p className="text-sm font-medium">I heard:</p>
              <p className="text-md">{transcript}</p>
              {!isProcessingCommand && (
                <Button 
                  className="mt-2 w-full" 
                  size="sm" 
                  onClick={handleCommandClick}
                >
                  Process Command
                </Button>
              )}
            </div>
          )}
          
          {/* Response display */}
          {response && (
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
              <p className="text-sm font-medium mb-1">Assistant:</p>
              <div className="space-y-1 text-md">
                {response.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              {/* Read response button */}
              {response && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => speakResponse(response)}
                  className="mt-2"
                >
                  <Volume2 className="h-4 w-4 mr-1" />
                  Read Response
                </Button>
              )}
            </div>
          )}
          
          {/* Image upload section */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Upload artwork for analysis:</p>
            
            {previewUrl ? (
              // Image Preview
              <div className="relative rounded-md overflow-hidden border">
                <img
                  src={previewUrl}
                  alt="Artwork preview"
                  className="object-contain w-full max-h-[200px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  &times;
                </Button>
                
                {!isAnalyzingImage && (
                  <Button
                    type="button"
                    onClick={analyzeImage}
                    className="absolute bottom-2 right-2 flex items-center justify-center gap-1"
                    size="sm"
                  >
                    <ImageIcon className="h-3 w-3" />
                    Analyze
                  </Button>
                )}
              </div>
            ) : (
              // Upload control
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="artwork-upload-global"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label 
                  htmlFor="artwork-upload-global"
                  className="cursor-pointer block"
                >
                  <div className="flex flex-col items-center">
                    <FileQuestion className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm">Click to upload an image</span>
                  </div>
                </label>
              </div>
            )}
            
            {/* Loading state for image analysis */}
            {isAnalyzingImage && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Analyzing your artwork...</span>
                </div>
                <Progress value={65} className="w-full h-2" />
              </div>
            )}
          </div>
          
          {/* Voice controls */}
          <div className="sticky bottom-0 pt-2 bg-card flex justify-between items-center">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button 
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopListening : startListening}
                className="w-full"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              
              {isProcessingCommand ? (
                <Button variant="outline" disabled className="w-full">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)} 
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}