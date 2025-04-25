import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SeoHead } from '@/components/seo';
import { Loader2, Image, Camera, Upload, Info, Wand2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FrameOption, MatOption } from '@/types';
import { DynamicFramePreview } from '@/components/product/dynamic-frame-preview';

export default function FrameFittingAssistant() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(20);
  const [analysisResult, setAnalysisResult] = useState<{
    frames: FrameOption[];
    mats: MatOption[];
    explanation: string;
    imageAnalysis: string;
  } | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<number | null>(null);
  const [selectedMatId, setSelectedMatId] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Fetch frame options
  const { data: frameOptions = [] } = useQuery({
    queryKey: ['/api/frame-options'],
  });
  
  // Fetch mat options
  const { data: matOptions = [] } = useQuery({
    queryKey: ['/api/mat-options'],
  });
  
  // Fetch glass options
  const { data: glassOptions = [] } = useQuery({
    queryKey: ['/api/glass-options'],
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('image')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCameraCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageBase64(dataUrl);
        
        // Stop camera stream
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }
      }
    }
  };
  
  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: false 
        });
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access your camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const resetImage = () => {
    setImageBase64(null);
    setAnalysisResult(null);
    
    if (activeTab === 'camera' && videoRef.current) {
      // Restart camera
      startCamera();
    }
  };
  
  const analyzeImage = async () => {
    if (!imageBase64) {
      toast({
        title: 'No image selected',
        description: 'Please upload or capture an image first',
        variant: 'destructive',
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await apiRequest('POST', '/api/frame-fitting-assistant', {
        imageBase64
      });
      
      const result = await response.json();
      setAnalysisResult(result);
      
      if (result.frames?.length > 0) {
        setSelectedFrameId(result.frames[0].id);
      }
      if (result.mats?.length > 0) {
        setSelectedMatId(result.mats[0].id);
      }
      
      toast({
        title: 'Analysis Complete',
        description: 'Your artwork has been analyzed and framing recommendations are ready.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'camera') {
      // Start camera when switching to camera tab
      startCamera();
    } else if (videoRef.current?.srcObject) {
      // Stop camera when switching away from camera tab
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  const getSelectedFrame = () => {
    return frameOptions.find(f => f.id === selectedFrameId) || null;
  };
  
  const getSelectedMat = () => {
    return matOptions.find(m => m.id === selectedMatId) || null;
  };
  
  const getSelectedGlass = () => {
    return glassOptions.length > 0 ? glassOptions[0] : null;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SeoHead
        title="Frame Fitting Assistant | Jay's Frames"
        description="Use our AI-powered Frame Fitting Assistant to analyze your artwork and get professional framing recommendations"
        keywords="frame fitting, artwork analysis, custom framing, AI frame recommendations"
        canonicalUrl="/frame-fitting-assistant"
        ogType="website"
        ogTitle="Frame Fitting Assistant | Jay's Frames"
        ogDescription="Upload your artwork and let our AI analyze it to recommend the perfect frame"
        ogImage="/images/frame-fitting-assistant.jpg"
      />
      
      <h1 className="text-3xl font-bold mb-4">AI-Powered Frame Fitting Assistant</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Upload a photo of your artwork and our AI will analyze it to recommend the perfect frame and mat combinations.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Image Upload/Camera */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Artwork Image</CardTitle>
              <CardDescription>
                Upload or take a photo of the artwork you want to frame
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </TabsTrigger>
                  <TabsTrigger value="camera">
                    <Camera className="h-4 w-4 mr-2" />
                    Use Camera
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload">
                  <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
                    {imageBase64 ? (
                      <img 
                        src={imageBase64} 
                        alt="Uploaded artwork" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8">
                        <Image className="h-12 w-12 mb-4 text-muted-foreground" />
                        <p className="text-center text-muted-foreground mb-4">
                          Upload a photo of your artwork to get framing recommendations
                        </p>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          className="mb-2"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="camera">
                  <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
                    {imageBase64 ? (
                      <img 
                        src={imageBase64} 
                        alt="Captured artwork" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Hidden canvas for capturing frames */}
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {!imageBase64 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <Button 
                          onClick={handleCameraCapture}
                          size="lg"
                          className="rounded-full"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Capture Photo
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {imageBase64 && (
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={resetImage}>
                    Reset
                  </Button>
                  
                  <Button 
                    onClick={analyzeImage} 
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Analyze Artwork
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {analysisResult && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Artwork Analysis</CardTitle>
                <CardDescription>
                  Our AI has analyzed your artwork and provided the following insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm">
                  <h3 className="text-lg font-medium mb-2">Analysis Results</h3>
                  <p className="whitespace-pre-line">{analysisResult.imageAnalysis}</p>
                  
                  <h3 className="text-lg font-medium mt-4 mb-2">Framing Recommendations</h3>
                  <p className="whitespace-pre-line">{analysisResult.explanation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Frame Recommendations & Preview */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Frame Preview</CardTitle>
              <CardDescription>
                {analysisResult 
                  ? 'Recommended frames and preview based on AI analysis' 
                  : 'Upload an image to see AI recommendations'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-8 text-center">
                  <Info className="h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload and analyze your artwork to see personalized framing recommendations and preview
                  </p>
                </div>
              ) : (
                <>
                  {/* Artwork Dimensions */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Artwork Dimensions (inches)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width</Label>
                        <Input 
                          id="width"
                          type="number"
                          value={width}
                          onChange={e => setWidth(Number(e.target.value))}
                          min={1}
                          max={60}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height</Label>
                        <Input 
                          id="height"
                          type="number"
                          value={height}
                          onChange={e => setHeight(Number(e.target.value))}
                          min={1}
                          max={60}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Dynamic Frame Preview */}
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <DynamicFramePreview
                      width={width}
                      height={height}
                      selectedFrame={getSelectedFrame()}
                      selectedMat={getSelectedMat()}
                      selectedGlass={getSelectedGlass()}
                    />
                  </div>
                  
                  {/* Recommended Frames */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Recommended Frames</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {analysisResult.frames.map(frame => (
                        <div 
                          key={frame.id}
                          className={`cursor-pointer p-2 rounded-lg border transition-all ${
                            selectedFrameId === frame.id 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-muted-foreground/20 hover:border-muted-foreground/50'
                          }`}
                          onClick={() => setSelectedFrameId(frame.id)}
                        >
                          <div 
                            className="h-12 w-full rounded-sm mb-2"
                            style={{ backgroundColor: frame.color }}
                          />
                          <p className="text-xs truncate text-center">
                            {frame.name}
                            {selectedFrameId === frame.id && (
                              <CheckCircle2 className="h-3 w-3 inline-block ml-1 text-primary" />
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recommended Mats */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recommended Mats</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {analysisResult.mats.map(mat => (
                        <div 
                          key={mat.id}
                          className={`cursor-pointer p-2 rounded-lg border transition-all ${
                            selectedMatId === mat.id 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-muted-foreground/20 hover:border-muted-foreground/50'
                          }`}
                          onClick={() => setSelectedMatId(mat.id)}
                        >
                          <div 
                            className="h-12 w-full rounded-sm mb-2"
                            style={{ backgroundColor: mat.color }}
                          />
                          <p className="text-xs truncate text-center">
                            {mat.name}
                            {selectedMatId === mat.id && (
                              <CheckCircle2 className="h-3 w-3 inline-block ml-1 text-primary" />
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                disabled={!analysisResult}
                onClick={() => {
                  toast({
                    title: "Continue to Custom Framing",
                    description: "This would take you to the full framing page with these options pre-selected",
                  });
                }}
              >
                Continue to Custom Framing
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}