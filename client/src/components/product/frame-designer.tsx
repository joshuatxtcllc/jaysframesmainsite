import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { FrameOption, MatOption, GlassOption } from "@/types";
import { 
  Lightbulb, 
  ShoppingCart, 
  Camera, 
  Upload, 
  FileText, 
  Wand2, 
  RefreshCw, 
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";
import { DynamicFramePreview } from "./dynamic-frame-preview";
import { useToast } from "@/hooks/use-toast";

interface FrameDesignerProps {
  initialWidth?: number;
  initialHeight?: number;
}

// Define the design flow steps
type DesignStep = 
  | "upload" 
  | "describe" 
  | "recommendations" 
  | "customize" 
  | "review";

const FrameDesigner = ({ initialWidth = 16, initialHeight = 20 }: FrameDesignerProps) => {
  // Basic state
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [selectedMat, setSelectedMat] = useState<number | null>(null);
  const [selectedGlass, setSelectedGlass] = useState<number | null>(null);
  const [artworkDescription, setArtworkDescription] = useState("");
  const [currentStep, setCurrentStep] = useState<DesignStep>("upload");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<{
    frames: FrameOption[];
    mats: MatOption[];
    explanation: string;
  } | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch frame options
  const { data: frameOptions = [] } = useQuery({
    queryKey: ["/api/frame-options"],
    select: (data) => data as FrameOption[]
  });

  // Fetch mat options
  const { data: matOptions = [] } = useQuery({
    queryKey: ["/api/mat-options"],
    select: (data) => data as MatOption[]
  });

  // Fetch glass options
  const { data: glassOptions = [] } = useQuery({
    queryKey: ["/api/glass-options"],
    select: (data) => data as GlassOption[]
  });

  // Select default options when data is loaded
  useEffect(() => {
    if (frameOptions.length > 0 && !selectedFrame) {
      setSelectedFrame(frameOptions[0].id);
    }
    if (matOptions.length > 0 && !selectedMat) {
      setSelectedMat(matOptions[0].id);
    }
    if (glassOptions.length > 0 && !selectedGlass) {
      setSelectedGlass(glassOptions[1].id); // Default to UV protection glass
    }
  }, [frameOptions, matOptions, glassOptions]);

  // Calculate price
  const calculatePrice = () => {
    let price = 0;
    
    // Frame price (based on perimeter)
    if (selectedFrame) {
      const frame = frameOptions.find(f => f.id === selectedFrame);
      if (frame) {
        const perimeter = 2 * (width + height);
        price += perimeter * frame.pricePerInch / 100;
      }
    }
    
    // Mat price
    if (selectedMat) {
      const mat = matOptions.find(m => m.id === selectedMat);
      if (mat) {
        price += mat.price / 100;
      }
    }
    
    // Glass price
    if (selectedGlass) {
      const glass = glassOptions.find(g => g.id === selectedGlass);
      if (glass) {
        price += glass.price / 100;
      }
    }
    
    // Mount price - fixed $25
    price += 25;
    
    return Math.round(price * 100);
  };

  // Get selected options
  const getSelectedFrameOption = () => frameOptions.find(f => f.id === selectedFrame);
  const getSelectedMatOption = () => matOptions.find(m => m.id === selectedMat);
  const getSelectedGlassOption = () => glassOptions.find(g => g.id === selectedGlass);

  // Handle add to cart
  const handleAddToCart = () => {
    const frame = getSelectedFrameOption();
    const mat = getSelectedMatOption();
    const glass = getSelectedGlassOption();
    
    if (!frame || !mat || !glass) return;
    
    const price = calculatePrice();
    const itemName = `Custom Frame - ${frame.name} w/ ${mat.name} Mat`;
    
    addToCart({
      id: `custom-frame-${Date.now()}`,
      productId: 1, // Assuming custom frame has ID 1
      name: itemName,
      price,
      quantity: 1,
      imageUrl: frame.imageUrl,
      details: {
        width,
        height,
        frameId: frame.id,
        matId: mat.id,
        glassId: glass.id,
        frameColor: frame.color,
        matColor: mat.color,
        glassType: glass.name
      }
    });
  };

  // AI Recommendation mutation
  const aiRecommendationMutation = useMutation({
    mutationFn: async (description: string) => {
      console.log("Sending API request to /api/frame-recommendations");
      try {
        const res = await apiRequest("POST", "/api/frame-recommendations", {
          artworkDescription: description
        });
        const data = await res.json();
        console.log("API response:", data);
        return data;
      } catch (error) {
        console.error("Error getting frame recommendations:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Setting recommendations:", data);
      setAiRecommendations(data);
      // Auto-select the first recommendations
      if (data.frames.length > 0) {
        setSelectedFrame(data.frames[0].id);
      }
      if (data.mats.length > 0) {
        setSelectedMat(data.mats[0].id);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    }
  });

  const getAiRecommendations = () => {
    if (!artworkDescription.trim()) return;
    console.log("Getting AI recommendations for:", artworkDescription);
    aiRecommendationMutation.mutate(artworkDescription);
  };

  // Frame border style for preview
  const getFrameStyle = () => {
    const frame = getSelectedFrameOption();
    const mat = getSelectedMatOption();
    
    if (!frame || !mat) return {};
    
    return {
      border: '5px solid transparent',
      boxShadow: `0 0 0 30px ${mat.color}, 0 0 0 40px ${frame.color}`,
      borderRadius: '0', // Sharp square corners
      transition: 'all 0.3s ease-in-out',
      backgroundColor: 'transparent' // Ensure transparency
    };
  };

  // Handle file upload for the image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
        setIsLoading(false);
        setCurrentStep("customize"); // Move to customize after upload
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Go to the recommendations step with description
  const handleDescribeArtwork = () => {
    if (artworkDescription.trim().length < 10) {
      toast({
        title: "Description too short",
        description: "Please provide more details about your artwork for better recommendations.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    aiRecommendationMutation.mutate(artworkDescription, {
      onSuccess: () => {
        setIsLoading(false);
        setCurrentStep("recommendations");
      },
      onError: () => {
        setIsLoading(false);
        toast({
          title: "Error getting recommendations",
          description: "We couldn't analyze your artwork description. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Reset the uploaded image
  const resetImage = () => {
    setUserImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Get new AI recommendations
  const getNewRecommendations = () => {
    if (artworkDescription.trim().length < 5 && !userImage) {
      toast({
        title: "More information needed",
        description: "Please upload an image or provide a description first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    aiRecommendationMutation.mutate(artworkDescription, {
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "New recommendations ready",
          description: "We've generated new frame and mat suggestions based on your artwork.",
        });
      },
      onError: () => {
        setIsLoading(false);
        toast({
          title: "Error getting recommendations",
          description: "We couldn't generate new recommendations. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Apply a specific recommendation
  const applyRecommendation = (frameId: number, matId: number) => {
    setSelectedFrame(frameId);
    setSelectedMat(matId);
    setCurrentStep("customize");
    
    toast({
      title: "Recommendation applied",
      description: "We've updated your frame design with the recommended options.",
    });
  };
  
  // Proceed to next step in the flow
  const goToNextStep = () => {
    switch (currentStep) {
      case "upload":
        if (userImage) {
          setCurrentStep("customize");
        } else if (artworkDescription.trim().length > 10) {
          handleDescribeArtwork();
        } else {
          toast({
            title: "Information needed",
            description: "Please upload an image or describe your artwork.",
            variant: "destructive"
          });
        }
        break;
      case "describe":
        handleDescribeArtwork();
        break;
      case "recommendations":
        setCurrentStep("customize");
        break;
      case "customize":
        setCurrentStep("review");
        break;
      case "review":
        handleAddToCart();
        toast({
          title: "Added to cart!",
          description: "Your custom frame has been added to your cart.",
        });
        break;
    }
  };
  
  // Go back to previous step
  const goToPreviousStep = () => {
    switch (currentStep) {
      case "recommendations":
        if (userImage) {
          setCurrentStep("upload");
        } else {
          setCurrentStep("describe");
        }
        break;
      case "customize":
        if (aiRecommendations) {
          setCurrentStep("recommendations");
        } else if (userImage) {
          setCurrentStep("upload");
        } else {
          setCurrentStep("describe");
        }
        break;
      case "review":
        setCurrentStep("customize");
        break;
      default:
        // For upload and describe steps, there's no previous step
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column: Artwork Preview */}
      <div className="lg:col-span-2">
        <Card className="shadow-elegant h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-serif font-bold text-primary">
              {currentStep === "upload" || currentStep === "describe" 
                ? "Start Your Frame Design" 
                : "Frame Preview"}
            </CardTitle>
            <CardDescription>
              {currentStep === "upload" || currentStep === "describe" 
                ? "Upload an image or describe your artwork" 
                : "See how your artwork will look framed"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Dimensions Input */}
            <div className="bg-neutral-50 p-4 rounded-lg mb-6">
              <h3 className="text-base font-medium mb-3 text-primary">Artwork Dimensions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-xs mb-1 text-neutral-500">Width (inches)</Label>
                  <Input 
                    type="number" 
                    value={width}
                    min={1}
                    max={60}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label className="block text-xs mb-1 text-neutral-500">Height (inches)</Label>
                  <Input 
                    type="number" 
                    value={height}
                    min={1}
                    max={60}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            {/* Preview Area */}
            <div className="mb-4">
              {(currentStep === "upload" || currentStep === "describe") && !userImage ? (
                <div className="bg-neutral-100 rounded-lg p-6 flex flex-col items-center justify-center h-80">
                  <Upload className="h-12 w-12 text-neutral-400 mb-4" />
                  <p className="text-neutral-600 text-center mb-4">
                    Upload an image of your artwork or describe it for AI recommendations
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*" 
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="mb-8">
                  <DynamicFramePreview
                    width={width}
                    height={height}
                    selectedFrame={getSelectedFrameOption() || null}
                    selectedMat={getSelectedMatOption() || null}
                    selectedGlass={getSelectedGlassOption() || null}
                  />
                </div>
              )}
            </div>
            
            {/* Frame Specifications - shown in customize & review steps */}
            {(currentStep === "customize" || currentStep === "review") && (
              <div className="bg-white rounded-lg p-4 border border-neutral-200 shadow-sm mb-4">
                <h3 className="text-base font-medium mb-3 text-primary">Selected Options</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center pb-1 border-b border-neutral-100">
                    <span className="text-neutral-500 text-sm">Size:</span>
                    <span className="font-medium text-primary">{width}" × {height}"</span>
                  </li>
                  <li className="flex justify-between items-center pb-1 border-b border-neutral-100">
                    <span className="text-neutral-500 text-sm">Frame:</span>
                    <div className="flex items-center">
                      {selectedFrame && (
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedFrameOption()?.color }}></span>
                      )}
                      <span className="font-medium text-primary">{getSelectedFrameOption()?.name || "Loading..."}</span>
                    </div>
                  </li>
                  <li className="flex justify-between items-center pb-1 border-b border-neutral-100">
                    <span className="text-neutral-500 text-sm">Mat:</span>
                    <div className="flex items-center">
                      {selectedMat && (
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedMatOption()?.color }}></span>
                      )}
                      <span className="font-medium text-primary">{getSelectedMatOption()?.name || "Loading..."}</span>
                    </div>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-neutral-500 text-sm">Glass:</span>
                    <span className="font-medium text-primary">{getSelectedGlassOption()?.name || "Loading..."}</span>
                  </li>
                </ul>
              </div>
            )}
            
            {/* Price shown in review step */}
            {currentStep === "review" && (
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(calculatePrice())}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Price includes frame, mat, glass, and premium mounting
                </p>
              </div>
            )}
          </CardContent>
          
          {/* Controls for left side */}
          <CardFooter className="border-t p-4 flex justify-between">
            {currentStep !== "upload" && currentStep !== "describe" ? (
              <>
                <Button variant="outline" size="sm" onClick={goToPreviousStep}>
                  Back
                </Button>
                {currentStep === "customize" && (
                  <Button variant="ghost" size="sm" onClick={getNewRecommendations}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    New Recommendations
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep("describe")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Describe Artwork
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Column: Options & Selection */}
      <div className="lg:col-span-3">
        <Card className="shadow-elegant h-full">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                {currentStep === "upload" ? "1" : currentStep === "describe" ? "1" : currentStep === "recommendations" ? "2" : currentStep === "customize" ? "3" : "4"}
              </div>
              <CardTitle className="text-xl font-serif text-primary">
                {currentStep === "upload" && "Upload Your Artwork"}
                {currentStep === "describe" && "Describe Your Artwork"}
                {currentStep === "recommendations" && "AI Recommendations"}
                {currentStep === "customize" && "Customize Your Frame"}
                {currentStep === "review" && "Review Your Design"}
              </CardTitle>
            </div>
            <CardDescription>
              {currentStep === "upload" && "Upload a photo of your artwork to get started"}
              {currentStep === "describe" && "Tell us about your artwork for personalized recommendations"}
              {currentStep === "recommendations" && "Based on your artwork, our AI suggests these frame styles"}
              {currentStep === "customize" && "Fine-tune your frame design to match your preferences"}
              {currentStep === "review" && "Review your custom frame before adding to cart"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Upload step */}
            {currentStep === "upload" && (
              <div className="space-y-6">
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-primary">Upload Your Artwork</h3>
                  <p className="text-neutral-600 mb-6">
                    Upload an image of your artwork to see how it will look in different frames.
                    This helps our AI suggest the perfect frame and mat combinations.
                  </p>
                  
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-300 bg-white rounded-lg">
                    <Upload className="h-10 w-10 text-neutral-400 mb-4" />
                    <p className="text-sm text-neutral-500 mb-4 text-center">
                      Drag and drop your image here, or click to browse
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-neutral-500 text-sm">
                    <p>Supported formats: JPEG, PNG, WebP</p>
                    <p>Maximum file size: 10MB</p>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="text-lg font-medium text-primary">Don't have an image?</h3>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    You can also describe your artwork and our AI will suggest frame options.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep("describe")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Describe Artwork Instead
                  </Button>
                </div>
              </div>
            )}
            
            {/* Describe step */}
            {currentStep === "describe" && (
              <div className="space-y-6">
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-primary">Describe Your Artwork</h3>
                  <p className="text-neutral-600 mb-6">
                    Tell us about your artwork in detail. The more information you provide,
                    the better our AI can recommend frame and mat options.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="artwork-description">Artwork Description</Label>
                      <Textarea 
                        id="artwork-description"
                        placeholder="Describe your artwork's style, colors, subject matter, mood, etc. (e.g., 'A vibrant watercolor landscape with blues and greens, depicting mountains and a lake at sunset')"
                        className="h-32"
                        value={artworkDescription}
                        onChange={(e) => setArtworkDescription(e.target.value)}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Minimum 10 characters required for analysis
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleDescribeArtwork}
                      disabled={artworkDescription.trim().length < 10 || isLoading}
                      className="w-full"
                    >
                      {isLoading ? 
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                          Analyzing Artwork...
                        </> : 
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Get AI Recommendations
                        </>
                      }
                    </Button>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="text-lg font-medium text-primary">Have an image instead?</h3>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    You can also upload an image of your artwork for more accurate recommendations.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep("upload")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Artwork Instead
                  </Button>
                </div>
              </div>
            )}
            
            {/* Recommendations step */}
            {currentStep === "recommendations" && aiRecommendations && (
              <div className="space-y-6">
                <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
                  <div className="flex items-start gap-3">
                    <div className="min-w-[1.5rem] h-6 mt-1">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-primary">AI Analysis Results</h3>
                      <p className="text-neutral-700">
                        {aiRecommendations.explanation || "Based on your artwork description, our AI has analyzed the style, colors, and mood to generate personalized frame and mat recommendations."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b">
                    <h3 className="font-medium text-primary">Recommended Frame & Mat Combinations</h3>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {aiRecommendations.frames.slice(0, 3).map((frame, index) => {
                      const matchingMat = aiRecommendations.mats[index] || aiRecommendations.mats[0];
                      
                      return (
                        <div 
                          key={frame.id} 
                          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center p-4 gap-4">
                            <div className="flex flex-col items-center">
                              <div 
                                className="h-16 w-16 border-4 flex-shrink-0"
                                style={{ 
                                  borderColor: frame.color,
                                  backgroundColor: matchingMat.color
                                }}
                              ></div>
                              <p className="text-xs text-center text-neutral-500 mt-1">
                                Combination {index + 1}
                              </p>
                            </div>
                            
                            <div className="flex-grow">
                              <h4 className="font-medium">{frame.name} frame with {matchingMat.name} mat</h4>
                              <p className="text-sm text-neutral-600 mt-1">
                                {frame.material} frame with a complementary {matchingMat.name} mat
                              </p>
                            </div>
                            
                            <Button
                              size="sm"
                              onClick={() => applyRecommendation(frame.id, matchingMat.id)}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-neutral-500 mb-4">
                    Don't see what you like? You can customize your frame design in the next step.
                  </p>
                  <Button onClick={() => setCurrentStep("customize")}>
                    Continue to Customize
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Customize step */}
            {currentStep === "customize" && (
              <div className="space-y-6">
                {/* Frame Selection */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b">
                    <h3 className="font-medium text-primary">Select Frame Style</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {frameOptions.map((frame) => (
                        <div 
                          key={frame.id}
                          className={`frame-option cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-300 ${
                            selectedFrame === frame.id 
                              ? 'ring-2 ring-primary scale-105 shadow-md' 
                              : 'border hover:shadow-sm'
                          }`}
                          onClick={() => setSelectedFrame(frame.id)}
                        >
                          <div 
                            className="h-12 border-b"
                            style={{ backgroundColor: frame.color }}
                          ></div>
                          <div className="p-2">
                            <p className="text-xs font-medium text-center line-clamp-1">{frame.name}</p>
                            <p className="text-xs text-center text-neutral-500">{frame.material}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Mat Selection */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b">
                    <h3 className="font-medium text-primary">Select Mat Color</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {matOptions.map((mat) => (
                        <div 
                          key={mat.id}
                          className={`cursor-pointer transition-all duration-300 ${
                            selectedMat === mat.id 
                              ? 'ring-2 ring-primary scale-105' 
                              : 'hover:scale-105'
                          }`}
                          onClick={() => setSelectedMat(mat.id)}
                        >
                          <div 
                            className={`h-10 w-10 mx-auto rounded-full ${mat.color === '#FFFFFF' || mat.color === '#F5F5F5' ? 'border' : ''}`}
                            style={{ backgroundColor: mat.color }}
                          ></div>
                          <p className="text-xs mt-1 text-center line-clamp-1">{mat.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Glass Selection */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b">
                    <h3 className="font-medium text-primary">Select Glass Type</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-2">
                      {glassOptions.map((glass) => (
                        <div 
                          key={glass.id}
                          className={`cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-300 ${
                            selectedGlass === glass.id 
                              ? 'ring-2 ring-primary' 
                              : 'border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedGlass(glass.id)}
                        >
                          <div className="flex items-center p-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                              selectedGlass === glass.id ? 'bg-primary text-white' : 'bg-neutral-100'
                            }`}>
                              {selectedGlass === glass.id && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.33332 2.5L3.74999 7.08333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium">{glass.name}</h4>
                              <p className="text-xs text-neutral-500">{glass.description}</p>
                            </div>
                            
                            <div className="ml-auto text-sm font-medium text-primary">
                              {formatPrice(glass.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button onClick={() => setCurrentStep("review")} className="px-8">
                    Continue to Review
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Review step */}
            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="min-w-[1.5rem] h-6 mt-1">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-green-700">Your Custom Frame is Ready!</h3>
                      <p className="text-neutral-700 mb-2">
                        We've carefully designed your custom frame based on your specifications. Review your selections below.
                      </p>
                      <p className="text-sm text-neutral-600">
                        Each custom frame is handcrafted by our expert framers using the highest quality materials.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-neutral-50 p-4 border-b">
                    <h3 className="font-medium text-primary">Order Summary</h3>
                  </div>
                  
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex justify-between py-2 border-b">
                        <span className="text-neutral-700">Artwork Size:</span>
                        <span className="font-medium">{width}" × {height}"</span>
                      </li>
                      <li className="flex justify-between py-2 border-b">
                        <span className="text-neutral-700">Frame Style:</span>
                        <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedFrameOption()?.color }}></span>
                          <span className="font-medium">{getSelectedFrameOption()?.name}</span>
                        </div>
                      </li>
                      <li className="flex justify-between py-2 border-b">
                        <span className="text-neutral-700">Mat Color:</span>
                        <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedMatOption()?.color }}></span>
                          <span className="font-medium">{getSelectedMatOption()?.name}</span>
                        </div>
                      </li>
                      <li className="flex justify-between py-2 border-b">
                        <span className="text-neutral-700">Glass Type:</span>
                        <span className="font-medium">{getSelectedGlassOption()?.name}</span>
                      </li>
                      <li className="flex justify-between py-2 border-b">
                        <span className="text-neutral-700">Mounting:</span>
                        <span className="font-medium">Premium Mounting</span>
                      </li>
                      <li className="flex justify-between py-3 border-b border-primary-200">
                        <span className="font-medium text-lg">Total Price:</span>
                        <span className="font-bold text-lg text-primary">{formatPrice(calculatePrice())}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-neutral-500 mb-4">
                    Production time is 3-5 business days. All frames include hanging hardware.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep("customize")}
                    >
                      Edit Design
                    </Button>
                    <Button
                      className="px-8"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="bg-gradient-to-tr from-neutral-50 to-neutral-100 rounded-xl p-6 shadow-elegant">
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6 text-center">
          <h3 className="text-xl font-serif font-bold text-primary mb-1">Design Assistance</h3>
          <p className="text-sm text-neutral-500">Get expert help for your perfect frame</p>
        </div>
        
        {/* AI Designer */}
        <div className="mb-8 relative overflow-hidden rounded-xl shadow-highlight">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/30 z-0"></div>
          <div className="absolute top-0 right-0 h-24 w-24 bg-accent/10 rounded-full -mr-8 -mt-8 z-0"></div>
          <div className="absolute bottom-0 left-0 h-16 w-16 bg-accent/10 rounded-full -ml-6 -mb-6 z-0"></div>
          
          <div className="relative z-10 p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-accent rounded-full p-2.5 shadow-md">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h4 className="text-base font-serif font-bold text-primary">AI Frame Designer</h4>
                <p className="text-sm text-neutral-600">
                  Get smart frame recommendations for your artwork
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <label className="block text-xs font-medium text-neutral-500 mb-2">
                Describe your artwork in detail
              </label>
              <Textarea 
                placeholder="E.g. 'A vibrant sunset watercolor painting with orange and purple hues' or 'Black and white portrait photograph with strong contrast'"
                className="text-sm mb-3 min-h-[80px] border-neutral-200 focus:border-accent focus:ring-1 focus:ring-accent"
                value={artworkDescription}
                onChange={(e) => setArtworkDescription(e.target.value)}
              />
              
              <Button 
                variant="default" 
                className="w-full bg-accent hover:bg-accent/90 text-white py-2.5 group"
                onClick={getAiRecommendations}
                disabled={aiRecommendationMutation.isPending || !artworkDescription.trim()}
              >
                {aiRecommendationMutation.isPending ? (
                  <div className="flex items-center text-white">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing artwork...</span>
                  </div>
                ) : (
                  <div className="flex items-center text-white">
                    <span>Get AI Recommendations</span>
                    <Lightbulb className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
            
            {aiRecommendations && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-accent/30 mb-1">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                  </div>
                  <h5 className="text-sm font-bold text-primary">AI Recommendation</h5>
                </div>
                <p className="text-sm text-neutral-700 mb-3">{aiRecommendations.explanation}</p>
                
                {aiRecommendations.frames.length > 0 && aiRecommendations.mats.length > 0 && (
                  <div className="flex items-center justify-center gap-6 bg-neutral-50 rounded-md p-3">
                    <div className="text-center">
                      <div 
                        className="w-10 h-10 mx-auto rounded-md mb-1 border border-neutral-300"
                        style={{ 
                          backgroundColor: aiRecommendations.frames[0]?.color,
                          opacity: 0.8 
                        }}
                      ></div>
                      <span className="text-xs text-neutral-500">{aiRecommendations.frames[0]?.name}</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-10 h-10 mx-auto rounded-full mb-1 border border-neutral-300"
                        style={{ 
                          backgroundColor: aiRecommendations.mats[0]?.color,
                          opacity: 0.8 
                        }}
                      ></div>
                      <span className="text-xs text-neutral-500">{aiRecommendations.mats[0]?.name}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-center text-xs text-neutral-500 italic">
              Powered by AI to analyze color, composition, and style
            </p>
          </div>
        </div>
        
        {/* Price Breakdown - Moved to bottom of right sidebar */}
        <div className="bg-white rounded-lg p-5 shadow-sm mb-6">
          <h3 className="text-lg font-serif font-bold mb-4 text-primary flex items-center">
            <span className="w-6 h-6 rounded-full bg-secondary text-white inline-flex items-center justify-center text-xs mr-2">2</span>
            Price Breakdown
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-neutral-500 text-sm">Frame:</span>
              <span className="font-medium text-primary">
                {selectedFrame && getSelectedFrameOption() 
                  ? formatPrice(2 * (width + height) * getSelectedFrameOption()!.pricePerInch) 
                  : "$0.00"}
              </span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-neutral-500 text-sm">Matting:</span>
              <span className="font-medium text-primary">
                {selectedMat && getSelectedMatOption() 
                  ? formatPrice(getSelectedMatOption()!.price) 
                  : "$0.00"}
              </span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-neutral-500 text-sm">Glass:</span>
              <span className="font-medium text-primary">
                {selectedGlass && getSelectedGlassOption() 
                  ? formatPrice(getSelectedGlassOption()!.price) 
                  : "$0.00"}
              </span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-neutral-500 text-sm">Mounting:</span>
              <span className="font-medium text-primary">$25.00</span>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="font-bold text-lg text-primary">Total:</span>
              <span className="font-bold text-lg text-secondary">{formatPrice(calculatePrice())}</span>
            </li>
          </ul>
        </div>
        
        {/* Add to Cart */}
        <div className="sticky top-4">
          <Button 
            variant="default" 
            className="w-full py-6 text-base font-medium bg-primary hover:bg-primary/90 text-white group"
            onClick={handleAddToCart}
            disabled={!selectedFrame || !selectedMat || !selectedGlass}
          >
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Add to Cart - {formatPrice(calculatePrice())}</span>
            </div>
          </Button>
          <p className="text-xs text-center mt-2 text-neutral-500">
            Not ready to buy? Design now, order later - we'll save your design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FrameDesigner;
