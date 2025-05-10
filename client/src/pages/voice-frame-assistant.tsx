import { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Mic, MicOff, Send, Volume2, AlertCircle, 
  UploadCloud, Camera, Image as ImageIcon, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { SeoHead } from '@/components/seo';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

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
    
    // Clean up previous analysis results
    setAnalysisResult(null);
    
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
      
      // Send the image to the API
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await fetch('/api/frame-fitting-assistant', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const result = await response.json();
      
      // Set the analysis result
      setAnalysisResult(result);
      
      // Generate response text about the image analysis
      const analysisDescription = `Based on your image, I've analyzed it as a ${result.artworkType} with ${result.dominantColors.join(', ')} colors in a ${result.style} style. The mood appears to be ${result.mood}. I've selected frames and mats that would complement this artwork.`;
      
      // Update response with analysis info
      setResponse(analysisDescription + '\n\n' + result.reasoning);
      
      // Speak the response
      if (synthesisRef.current) {
        speakResponse(analysisDescription);
      }
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter or speak a message');
      return;
    }
    
    // Check if message is requesting image analysis
    if (/analyze (this|the|my) (image|artwork|picture|photo)/i.test(message.toLowerCase())) {
      // Check if an image is uploaded
      if (selectedFile) {
        analyzeImage();
        return;
      } else {
        setError('Please upload an image first before asking me to analyze it.');
        return;
      }
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
      <SeoHead
        title="Voice-Activated Frame Assistant | Jay's Frames"
        description="Use our voice-activated AI assistant to help with custom framing, design recommendations, and artwork analysis."
        canonicalUrl="/voice-frame-assistant"
      />
      
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
        {/* Image Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Artwork for Analysis</CardTitle>
            <CardDescription>
              Upload a photo of your artwork to receive AI-powered framing recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* File Upload Area */}
              <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center relative transition-all ${
                previewUrl ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-primary hover:bg-gray-50"
              }`}>
                {previewUrl ? (
                  // Image Preview
                  <div className="relative w-full max-h-[300px] flex justify-center overflow-hidden rounded-md">
                    <img
                      src={previewUrl}
                      alt="Artwork preview"
                      className="object-contain max-w-full max-h-[300px]"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setAnalysisResult(null);
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                ) : (
                  // Upload Prompt
                  <>
                    <div className="flex flex-col items-center justify-center space-y-2 text-center p-6">
                      <UploadCloud className="h-12 w-12 text-gray-400" />
                      <div className="flex text-xl font-semibold mt-2">
                        Drag & drop or click to upload
                      </div>
                      <p className="text-sm text-gray-500">
                        JPEG, PNG or GIF images up to 10MB
                      </p>
                    </div>
                    <Input
                      id="artwork-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
              
              {/* Analysis Button */}
              {selectedFile && !isAnalyzingImage && !analysisResult && (
                <Button
                  type="button"
                  onClick={analyzeImage}
                  className="flex items-center justify-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Analyze Artwork for Frame Recommendations
                </Button>
              )}
              
              {/* Loading State */}
              {isAnalyzingImage && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Analyzing your artwork...</span>
                  </div>
                  <Progress value={45} className="w-full h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Voice/Text Question Card */}
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
                  variant="outline"
                  onClick={toggleListening}
                  disabled={!speechSupported || isLoading}
                  title={speechSupported ? "Toggle voice input" : "Speech recognition not supported"}
                  className={`flex gap-1 ${isListening ? "bg-red-100 text-red-700 border-red-400 hover:bg-red-200" : "text-primary border-primary hover:bg-primary/10"}`}
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
                    className="flex gap-1 text-secondary border-secondary hover:bg-secondary/10"
                  >
                    <Volume2 className="h-4 w-4" />
                    Read Response
                  </Button>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="flex gap-1 bg-secondary hover:bg-secondary/80 text-white">
                <Send className="h-4 w-4" />
                {isLoading ? 'Getting Response...' : 'Ask Assistant'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Results Card */}
        {(response || analysisResult) && (
          <Card>
            <CardHeader>
              <CardTitle>Frame Design Assistant Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {response.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                
                {/* Display frame recommendations if available */}
                {analysisResult && analysisResult.recommendations && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Recommended Frames</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {analysisResult.recommendations.frames.map((frame: any, i: number) => (
                        <div key={`frame-${i}`} className="border rounded-md p-3 flex items-center">
                          <div className="bg-primary/10 rounded-md p-2 mr-3">
                            <div 
                              className="w-8 h-8 rounded-sm" 
                              style={{ 
                                backgroundColor: frame.color || '#f0f0f0',
                                backgroundImage: frame.texture ? `url(${frame.texture})` : 'none'
                              }}
                            ></div>
                          </div>
                          <div>
                            <div className="font-medium">{frame.name}</div>
                            <div className="text-sm text-gray-500">Match score: {Math.round(frame.score * 100)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">Recommended Mats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {analysisResult.recommendations.mats.map((mat: any, i: number) => (
                        <div key={`mat-${i}`} className="border rounded-md p-3 flex items-center">
                          <div 
                            className="w-6 h-6 rounded-sm mr-2" 
                            style={{ backgroundColor: mat.color || '#ffffff' }}
                          ></div>
                          <div>
                            <div className="font-medium">{mat.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}