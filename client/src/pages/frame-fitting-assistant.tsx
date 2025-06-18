import { useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  UploadCloud, 
  Camera, 
  Image as ImageIcon, 
  Loader2,
  Check,
  AlertCircle,
  Eye,
  Sparkles,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { enrichFrameData, enrichMatData } from "@/lib/ai-helper";
import { FrameOption, MatOption, GlassOption } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SeoHead } from "@/components/seo";
import { AnimatedFramePreview } from "@/components/product/animated-frame-preview";

interface AnalysisResult {
  artworkType: string;
  dominantColors: string[];
  style: string;
  mood: string;
  recommendations: {
    frames: RecommendedFrame[];
    mats: RecommendedMat[];
    glass: RecommendedGlass[];
  };
  reasoning: string;
}

interface RecommendedFrame {
  id: number;
  name: string;
  score: number;
  reason: string;
}

interface RecommendedMat {
  id: number;
  name: string;
  score: number;
  reason: string;
}

interface RecommendedGlass {
  id: number;
  name: string;
  score: number;
  reason: string;
}

const FrameFittingAssistant = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedFrameOption, setSelectedFrameOption] = useState<FrameOption | null>(null);
  const [selectedMatOption, setSelectedMatOption] = useState<MatOption | null>(null);
  const [selectedGlassOption, setSelectedGlassOption] = useState<GlassOption | null>(null);
  const { toast } = useToast();

  // Get framing options from the API
  const { data: frameOptions } = useQuery({
    queryKey: ['/api/frame-options'],
    enabled: true
  });

  const { data: matOptions } = useQuery({
    queryKey: ['/api/mat-options'],
    enabled: true
  });

  const { data: glassOptions } = useQuery({
    queryKey: ['/api/glass-options'],
    enabled: true
  });

  // File selection handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file format",
        description: "Please upload an image file (JPEG, PNG, WebP, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Submit the image for analysis
  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/frame-fitting-assistant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete",
        description: "We've analyzed your artwork and created personalized recommendations",
        variant: "default"
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalysisError("We couldn't analyze this image. Please try a different image or try again later.");
      
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing your artwork",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset the form
  const handleReset = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setAnalysisError(null);
  }, [previewUrl]);
  
  // Enrich the frame options with catalog data
  const enrichedFrameOptions = frameOptions ? enrichFrameData(frameOptions as FrameOption[]) : [];
  const enrichedMatOptions = matOptions ? enrichMatData(matOptions as MatOption[]) : [];

  // Find frame and mat details for recommendations
  const getFrameDetails = (frameId: number): FrameOption | null => {
    return enrichedFrameOptions.find((f: any) => f.id === frameId) || null;
  };

  const getMatDetails = (matId: number): MatOption | null => {
    return enrichedMatOptions.find((m: any) => m.id === matId) || null;
  };

  const getGlassDetails = (glassId: number): GlassOption | null => {
    if (!glassOptions || !Array.isArray(glassOptions)) return null;
    return glassOptions.find((g: any) => g.id === glassId) || null;
  };

  return (
    <>
      <SeoHead
        title="AI Frame Fitting Assistant | Jay's Frames"
        description="Upload a photo of your artwork and get personalized framing recommendations based on AI analysis of your image's colors, style, and composition."
        canonicalUrl="/frame-fitting-assistant"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            AI Frame Fitting Assistant
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Upload a photo of your artwork and our AI will analyze it to suggest the perfect framing options that complement its style, colors, and composition.
          </p>

          <Card className="mb-8 bg-gradient-to-br from-accent/5 to-accent/15 border-accent/20">
            <CardContent className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    AI-Powered Frame Designer
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Upload your artwork and let our AI analyze the perfect frame and mat combination for your piece. Get instant, personalized recommendations based on your art's colors, style, and composition.
                  </p>
                </div>
                
                <Button 
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <a href="/custom-framing">
                    <Camera className="mr-3 h-5 w-5" />
                    Start AI Frame Design
                  </a>
                </Button>
                
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-neutral-500">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Instant Analysis
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Smart Recommendations
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Professional Results
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {analysisResult && (
            <div className="space-y-8 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Artwork Analysis</CardTitle>
                  <CardDescription>
                    Here's what our AI detected about your artwork
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2">Artwork Type</h3>
                      <p className="text-lg font-medium">{analysisResult.artworkType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2">Style</h3>
                      <p className="text-lg font-medium">{analysisResult.style}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2">Mood</h3>
                      <p className="text-lg font-medium">{analysisResult.mood}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2">Dominant Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.dominantColors.map((color, index) => (
                          <div 
                            key={index} 
                            className="flex items-center"
                          >
                            <div 
                              className="h-5 w-5 rounded-full mr-1.5 border border-neutral-200" 
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">AI Reasoning</h3>
                    <p className="text-neutral-700">{analysisResult.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>
                    Based on your artwork, we recommend these framing options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="frames" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="frames">Frames</TabsTrigger>
                      <TabsTrigger value="mats">Mats</TabsTrigger>
                      <TabsTrigger value="glass">Glass</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="frames" className="space-y-6">
                      {analysisResult.recommendations.frames.map((frame, index) => {
                        const frameDetails = getFrameDetails(frame.id);
                        return (
                          <div 
                            key={index} 
                            className="border rounded-lg p-4 hover:border-primary transition-colors"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-lg">{frameDetails?.name || frame.name}</h3>
                                {frameDetails?.collection && (
                                  <p className="text-sm text-neutral-500">
                                    {frameDetails.collection} Collection
                                  </p>
                                )}
                              </div>
                              <Badge variant={index === 0 ? "default" : "outline"}>
                                {index === 0 ? "Best Match" : "Good Match"}
                              </Badge>
                            </div>
                            
                            {frameDetails?.collectionInfo && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="secondary" className="font-normal">
                                    {frameDetails.collectionInfo.style}
                                  </Badge>
                                  {frameDetails.collectionInfo.features.split(',').map((feature, i) => (
                                    <Badge key={i} variant="outline" className="font-normal">
                                      {feature.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <p className="text-neutral-600 mt-2">{frame.reason}</p>
                            
                            <div className="mt-4 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  const frameDetail = getFrameDetails(frame.id);
                                  const bestMatId = analysisResult?.recommendations.mats[0]?.id;
                                  const bestGlassId = analysisResult?.recommendations.glass[0]?.id;

                                  setSelectedFrameOption(frameDetail || null);
                                  
                                  const matDetail = bestMatId ? getMatDetails(bestMatId) || null : null;
                                  setSelectedMatOption(matDetail);
                                  
                                  const glassDetail = bestGlassId ? getGlassDetails(bestGlassId) || null : null;
                                  setSelectedGlassOption(glassDetail);
                                  
                                  setShowPreview(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                className="flex-1 text-white"
                                onClick={() => {
                                  const frameDetail = getFrameDetails(frame.id);
                                  const bestMatId = analysisResult?.recommendations.mats[0]?.id;
                                  const bestGlassId = analysisResult?.recommendations.glass[0]?.id;

                                  setSelectedFrameOption(frameDetail);
                                  
                                  const matDetail = bestMatId ? getMatDetails(bestMatId) : null;
                                  setSelectedMatOption(matDetail);
                                  
                                  const glassDetail = bestGlassId ? getGlassDetails(bestGlassId) : null;
                                  setSelectedGlassOption(glassDetail);
                                  
                                  toast({
                                    title: "Frame style selected",
                                    description: `${frameDetail?.name || frame.name} has been selected as your frame style`,
                                    duration: 3000
                                  });
                                }}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Select
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </TabsContent>
                    
                    <TabsContent value="mats" className="space-y-6">
                      {analysisResult.recommendations.mats.map((mat, index) => {
                        const matDetails = getMatDetails(mat.id);
                        return (
                          <div 
                            key={index} 
                            className="border rounded-lg p-4 hover:border-primary transition-colors"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-lg">{matDetails?.name || mat.name}</h3>
                                {matDetails?.matType && (
                                  <p className="text-sm text-neutral-500">
                                    {matDetails.matType} Texture
                                  </p>
                                )}
                              </div>
                              <Badge variant={index === 0 ? "default" : "outline"}>
                                {index === 0 ? "Best Match" : "Good Match"}
                              </Badge>
                            </div>
                            
                            {matDetails?.matInfo && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="secondary" className="font-normal">
                                    {matDetails.matInfo.texture}
                                  </Badge>
                                  <Badge variant="outline" className="font-normal">
                                    {matDetails.matInfo.finish} finish
                                  </Badge>
                                  {matDetails.matInfo.conservation && (
                                    <Badge variant="outline" className="font-normal text-green-600 bg-green-50 border-green-200">
                                      conservation grade
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <p className="text-neutral-600 mt-2">{mat.reason}</p>
                            
                            <div className="mt-4 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  const matDetail = getMatDetails(mat.id);
                                  const bestFrameId = analysisResult?.recommendations.frames[0]?.id;
                                  const bestGlassId = analysisResult?.recommendations.glass[0]?.id;

                                  const frameDetail = bestFrameId ? getFrameDetails(bestFrameId) : null;
                                  setSelectedFrameOption(frameDetail);
                                  setSelectedMatOption(matDetail);
                                  
                                  const glassDetail = bestGlassId ? getGlassDetails(bestGlassId) : null;
                                  setSelectedGlassOption(glassDetail);
                                  
                                  setShowPreview(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                className="flex-1 text-white"
                                onClick={() => {
                                  const matDetail = getMatDetails(mat.id);
                                  const bestFrameId = analysisResult?.recommendations.frames[0]?.id;
                                  const bestGlassId = analysisResult?.recommendations.glass[0]?.id;

                                  const frameDetail = bestFrameId ? getFrameDetails(bestFrameId) : null;
                                  setSelectedFrameOption(frameDetail);
                                  setSelectedMatOption(matDetail);
                                  
                                  const glassDetail = bestGlassId ? getGlassDetails(bestGlassId) : null;
                                  setSelectedGlassOption(glassDetail);
                                  
                                  toast({
                                    title: "Mat style selected",
                                    description: `${matDetail?.name || mat.name} has been selected as your mat style`,
                                    duration: 3000
                                  });
                                }}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Select
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </TabsContent>
                    
                    <TabsContent value="glass" className="space-y-6">
                      {analysisResult.recommendations.glass.map((glass, index) => {
                        const glassDetails = getGlassDetails(glass.id);
                        return (
                          <div 
                            key={index} 
                            className="border rounded-lg p-4 hover:border-primary transition-colors"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-lg">{glassDetails?.name || glass.name}</h3>
                                {glassDetails?.description && (
                                  <p className="text-sm text-neutral-500">
                                    {glassDetails.description}
                                  </p>
                                )}
                              </div>
                              <Badge variant={index === 0 ? "default" : "outline"}>
                                {index === 0 ? "Best Match" : "Good Match"}
                              </Badge>
                            </div>
                            
                            <p className="text-neutral-600 mt-2">{glass.reason}</p>
                            
                            <div className="mt-4 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  const glassDetail = getGlassDetails(glass.id);
                                  const bestFrameId = analysisResult?.recommendations.frames[0]?.id;
                                  const bestMatId = analysisResult?.recommendations.mats[0]?.id;

                                  const frameDetail = bestFrameId ? getFrameDetails(bestFrameId) : null;
                                  setSelectedFrameOption(frameDetail);
                                  
                                  const matDetail = bestMatId ? getMatDetails(bestMatId) : null;
                                  setSelectedMatOption(matDetail);
                                  
                                  setSelectedGlassOption(glassDetail);
                                  setShowPreview(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                className="flex-1 text-white"
                                onClick={() => {
                                  const glassDetail = getGlassDetails(glass.id);
                                  const bestFrameId = analysisResult?.recommendations.frames[0]?.id;
                                  const bestMatId = analysisResult?.recommendations.mats[0]?.id;

                                  const frameDetail = bestFrameId ? getFrameDetails(bestFrameId) : null;
                                  setSelectedFrameOption(frameDetail);
                                  
                                  const matDetail = bestMatId ? getMatDetails(bestMatId) : null;
                                  setSelectedMatOption(matDetail);
                                  
                                  setSelectedGlassOption(glassDetail);
                                  
                                  toast({
                                    title: "Glass option selected",
                                    description: `${glassDetail?.name || glass.name} has been selected as your glass option`,
                                    duration: 3000
                                  });
                                }}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Select
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="px-8 text-white"
                  onClick={() => window.location.href = '/custom-framing'}
                >
                  Start Custom Framing Project
                </Button>
                <p className="text-sm text-neutral-500 mt-3">
                  Take these recommendations to our custom framing tool to complete your project
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Professional-Quality Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">Our AI analyzes your artwork using techniques developed by professional framers with decades of experience.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Color Harmony Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">We detect dominant colors in your artwork and suggest framing materials that create perfect color harmony.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Style-Matched Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">Get frame and mat suggestions that complement the unique style and period of your artwork.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Frame Preview Modal */}
      {showPreview && selectedFrameOption && (
        <AnimatedFramePreview
          width={400}
          height={400}
          selectedFrame={selectedFrameOption}
          selectedMat={selectedMatOption}
          selectedGlass={selectedGlassOption}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default FrameFittingAssistant;