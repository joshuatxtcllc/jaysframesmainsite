import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { FrameOption, MatOption, GlassOption } from "@/types";
import { Lightbulb, ShoppingCart, Trophy, Target, Download, Upload, Camera, Loader2, AlertCircle, Sparkles } from "lucide-react";
import DynamicFramePreview from "./dynamic-frame-preview";
import { ProgressTracker, ProgressBar } from "@/components/design-progress";
import { useDesignProgress } from "@/contexts/design-progress-context";
import { useToast } from "@/hooks/use-toast";

interface FrameDesignerProps {
  initialWidth?: number;
  initialHeight?: number;
}

const FrameDesigner = ({ initialWidth = 16, initialHeight = 20 }: FrameDesignerProps) => {
  // Frame Specifications
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [selectedStackedFrame, setSelectedStackedFrame] = useState<number | null>(null);
  const [useStackedFrame, setUseStackedFrame] = useState<boolean>(false);

  const [selectedMat, setSelectedMat] = useState<number | null>(null);
  const [selectedMiddleMat, setSelectedMiddleMat] = useState<number | null>(null);
  const [selectedBottomMat, setSelectedBottomMat] = useState<number | null>(null);
  const [useMiddleMat, setUseMiddleMat] = useState<boolean>(false);
  const [useBottomMat, setUseBottomMat] = useState<boolean>(false);
  const [topMatReveal, setTopMatReveal] = useState<number>(1); // Default 1/8"
  const [middleMatReveal, setMiddleMatReveal] = useState<number>(1); // Default 1/8"
  const [bottomMatReveal, setBottomMatReveal] = useState<number>(1); // Default 1/8"

  // Special mounting options
  const [useFloatMount, setUseFloatMount] = useState<boolean>(false);
  const [useGlassSpacer, setUseGlassSpacer] = useState<boolean>(false);

  const [selectedGlass, setSelectedGlass] = useState<number | null>(null);
  const [artworkDescription, setArtworkDescription] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState<{
    frames: FrameOption[];
    mats: MatOption[];
    explanation: string;
  } | null>(null);

  // Image upload and AI analysis states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  // Unique design ID for this framing session
  const [designId] = useState(`design-${Date.now()}`);

  // Progress tracking
  const { 
    markStepCompleted, 
    updateCurrentStep, 
    setFrameSelected, 
    setMatSelected, 
    setGlassSelected,
    setHasCustomSize,
    progress
  } = useDesignProgress();

  const { addToCart } = useCart();

  // Get database frames and mats
  const [databaseFrames, setDatabaseFrames] = useState<FrameOption[]>([]);
  const [databaseMats, setDatabaseMats] = useState<MatOption[]>([]);
  const [larsonJuhlFrames, setLarsonJuhlFrames] = useState<FrameOption[]>([]);
  const [larsonJuhlCollections, setLarsonJuhlCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Fetch frame and mat options from database
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch frame options
        const frameResponse = await fetch('/api/frame-options');
        const frameData = await frameResponse.json();
        setDatabaseFrames(frameData);
        console.log("Fetched frame options:", frameData);

        // Fetch mat options
        const matResponse = await fetch('/api/mat-options');
        const matData = await matResponse.json() as MatOption[];
        // Remove any duplicates using a map with ID as key
        const uniqueMats = Array.from(
          new Map(matData.map((mat: MatOption) => [mat.id, mat])).values()
        ) as MatOption[];
        setDatabaseMats(uniqueMats);
        console.log("Fetched mat options:", uniqueMats);

        // Fetch Larson Juhl catalog
        const larsonJuhlResponse = await fetch('/api/catalog/larson-juhl');
        const larsonJuhlData = await larsonJuhlResponse.json();
        setLarsonJuhlFrames(larsonJuhlData);

        // Fetch Larson Juhl collections
        const collectionsResponse = await fetch('/api/catalog/larson-juhl/collections');
        const collectionsData = await collectionsResponse.json();
        setLarsonJuhlCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching frame/mat options:', error);
      }
    };

    fetchOptions();
  }, []);

  // Fallback sample data if API fails to load
  useEffect(() => {
    if (databaseFrames.length === 0) {
      console.log("Using fallback frame options");
      setDatabaseFrames([
        {
          id: 1,
          name: "Matte Black",
          color: "#000000",
          material: "Wood",
          pricePerInch: 125,
          imageUrl: "/images/frames/black.png",
          width: 25
        },
        {
          id: 2,
          name: "White Gallery",
          color: "#FFFFFF",
          material: "Wood",
          pricePerInch: 175,
          imageUrl: "/images/frames/white.png",
          width: 25
        },
        {
          id: 3,
          name: "Natural Maple",
          color: "#E5DCC5",
          material: "Wood",
          pricePerInch: 150,
          imageUrl: "/images/frames/maple.png",
          width: 25
        },
        {
          id: 4,
          name: "Cherry Wood",
          color: "#6E2C00",
          material: "Wood",
          pricePerInch: 165,
          imageUrl: "/images/frames/cherry.png",
          width: 25
        },
        {
          id: 5,
          name: "Silver Metal",
          color: "#C0C0C0",
          material: "Metal",
          pricePerInch: 140,
          imageUrl: "/images/frames/silver.png",
          width: 25
        },
        {
          id: 6,
          name: "Gold Metal",
          color: "#FFD700",
          material: "Metal",
          pricePerInch: 180,
          imageUrl: "/images/frames/gold.png",
          width: 25
        },
        {
          id: 7,
          name: "Dark Walnut",
          color: "#5D4E37",
          material: "Wood",
          pricePerInch: 155,
          imageUrl: "/images/frames/walnut.png",
          width: 25
        },
        {
          id: 8,
          name: "Espresso",
          color: "#3C2415",
          material: "Wood",
          pricePerInch: 145,
          imageUrl: "/images/frames/espresso.png",
          width: 25
        },
        {
          id: 9,
          name: "Champagne",
          color: "#F7E7CE",
          material: "Metal",
          pricePerInch: 160,
          imageUrl: "/images/frames/champagne.png",
          width: 25
        },
        {
          id: 10,
          name: "Bronze",
          color: "#CD7F32",
          material: "Metal",
          pricePerInch: 170,
          imageUrl: "/images/frames/bronze.png",
          width: 25
        },
        {
          id: 11,
          name: "Mahogany",
          color: "#C04000",
          material: "Wood",
          pricePerInch: 165,
          imageUrl: "/images/frames/mahogany.png",
          width: 25
        },
        {
          id: 12,
          name: "Navy Blue",
          color: "#000080",
          material: "Wood",
          pricePerInch: 155,
          imageUrl: "/images/frames/navy.png",
          width: 25
        }
      ]);
    }

    if (databaseMats.length === 0) {
      console.log("Using fallback mat options");
      setDatabaseMats([
        {
          id: 0,
          name: "No Mat",
          color: "transparent",
          price: 0,
          imageUrl: "/images/mats/no-mat.png"
        },
        {
          id: 1,
          name: "Bright White",
          color: "#FFFFFF",
          price: 3500,
          imageUrl: "/images/mats/white.png"
        },
        {
          id: 2,
          name: "Antique White",
          color: "#F5F5F5",
          price: 3500,
          imageUrl: "/images/mats/antique-white.png"
        },
        {
          id: 3,
          name: "Midnight Black",
          color: "#000000",
          price: 4000,
          imageUrl: "/images/mats/black.png"
        },
        {
          id: 4,
          name: "Navy Blue",
          color: "#001F3F",
          price: 4000,
          imageUrl: "/images/mats/navy.png"
        },
        {
          id: 5,
          name: "Forest Green",
          color: "#228B22",
          price: 4000,
          imageUrl: "/images/mats/green.png"
        },
        {
          id: 6,
          name: "Burgundy",
          color: "#800020",
          price: 4000,
          imageUrl: "/images/mats/burgundy.png"
        }
      ]);
    }
  }, [databaseFrames, databaseMats]);

  // Group frames by collection for better organization
  const framesByCollection = useMemo(() => {
    const grouped: {[key: string]: FrameOption[]} = {};

    // Process all database frames
    databaseFrames.forEach(frame => {
      const details = frame.details as any;
      const collection = details?.collection || 'Standard';

      if (!grouped[collection]) {
        grouped[collection] = [];
      }
      grouped[collection].push(frame);
    });

    return grouped;
  }, [databaseFrames]);

  // Get available collections for filtering
  const availableCollections = useMemo(() => {
    return Object.keys(framesByCollection).sort();
  }, [framesByCollection]);

  // Filter frames by selected collection
  const filteredFrames = useMemo(() => {
    // Ensure we have frames even if the API fails
    if (databaseFrames.length === 0) {
      return [];
    }

    // If no collection selected, return all frames or limit to a reasonable amount
    if (!selectedCollection) {
      return databaseFrames.slice(0, 100); // Limit to prevent performance issues
    }

    // Return frames from the selected collection
    return framesByCollection[selectedCollection] || [];
  }, [databaseFrames, framesByCollection, selectedCollection]);


  // Fetch glass options
  const { data: glassOptions = [] } = useQuery({
    queryKey: ["/api/glass-options"],
    select: (data) => data as GlassOption[]
  });

  // Define RevealSize type
  interface RevealSize {
    id: number;
    size: string;
    sizeInches: number;
    displayName: string;
  }

  // Fetch reveal size options
  const { data: revealSizes = [] } = useQuery({
    queryKey: ["/api/reveal-sizes"],
    select: (data) => data as RevealSize[]
  });

  // Select default options when data is loaded
  useEffect(() => {
    if (filteredFrames.length > 0 && !selectedFrame) {
      setSelectedFrame(filteredFrames[0].id);
    }
    if (databaseMats.length > 0 && !selectedMat) {
      setSelectedMat(databaseMats[0].id);
    }
    if (glassOptions.length > 0 && !selectedGlass) {
      setSelectedGlass(glassOptions[1].id); // Default to UV protection glass
    }
    if (revealSizes.length > 0 && !topMatReveal) {
      setTopMatReveal(revealSizes[0].id); // Default to smallest reveal (1/8")
      setMiddleMatReveal(revealSizes[0].id);
      setBottomMatReveal(revealSizes[0].id);
    }
  }, [filteredFrames, databaseMats, glassOptions, revealSizes]);

  // Initialize the design progress tracker with this design ID
  useEffect(() => {
    // Initialize with the custom sizing step
    updateCurrentStep('sizing');
    // Mark the artwork upload as completed
    markStepCompleted('artwork_upload');
    // Update custom size setting
    setHasCustomSize(true);
  }, [designId]);

  // Track frame selection for progress
  useEffect(() => {
    if (selectedFrame) {
      setFrameSelected(true);
      // Set current step to frame selection if not already past it
      if (progress?.currentStep === 'sizing') {
        updateCurrentStep('frame_selection');
      }
    }
  }, [selectedFrame]);

  // Track mat selection for progress
  useEffect(() => {
    if (selectedMat) {
      setMatSelected(true);
      // Set current step to mat selection if at frame selection
      if (progress?.currentStep === 'frame_selection') {
        markStepCompleted('frame_selection');
        updateCurrentStep('mat_selection');
      }
    }
  }, [selectedMat]);

  // Track glass selection for progress
  useEffect(() => {
    if (selectedGlass) {
      setGlassSelected(true);
      // Set current step to glass selection if at mat selection
      if (progress?.currentStep === 'mat_selection') {
        markStepCompleted('mat_selection');
        updateCurrentStep('glass_selection');
      }
    }
  }, [selectedGlass]);

  // Calculate price
  const calculatePrice = () => {
    let price = 0;

    // Frame price (based on perimeter)
    if (selectedFrame) {
      const frame = filteredFrames.find(f => f.id === selectedFrame);
      if (frame) {
        const perimeter = 2 * (width + height);
        price += perimeter * frame.pricePerInch / 100;
      }
    }

    // Stacked frame price (if enabled)
    if (useStackedFrame && selectedStackedFrame) {
      const stackedFrame = filteredFrames.find(f => f.id === selectedStackedFrame);
      if (stackedFrame) {
        const perimeter = 2 * (width + height);
        // Add 20% premium for stacked frame application
        price += (perimeter * stackedFrame.pricePerInch / 100) * 1.2;
      }
    }

    // Mat price (top mat) - only add price if mat is selected and not "No Mat"
    if (selectedMat && selectedMat !== 0) {
      const mat = databaseMats.find(m => m.id === selectedMat);
      if (mat && mat.price > 0) {
        price += mat.price / 100;
      }
    }

    // Middle mat price (if enabled)
    if (useMiddleMat && selectedMiddleMat) {
      const mat = databaseMats.find(m => m.id === selectedMiddleMat);
      if (mat) {
        // Add 10% surcharge for middle mat cutting and alignment
        price += (mat.price / 100) * 1.1;
      }
    }

    // Bottom mat price (if enabled)
    if (useBottomMat && selectedBottomMat) {
      const mat = databaseMats.find(m => m.id === selectedBottomMat);
      if (mat) {
        // Add 10% surcharge for bottom mat cutting and alignment
        price += (mat.price / 100) * 1.1;
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

    // Add additional charge for advanced matting with reveals
    if (useMiddleMat || useBottomMat) {
      price += 15; // $15 additional for advanced matting
    }

    // Add float mount charge
    if (useFloatMount) {
      price += 50; // $50 additional for float mounting
    }

    // Add glass spacer charge
    if (useGlassSpacer) {
      price += 35; // $35 additional for glass spacers
    }

    return Math.round(price * 100);
  };

  // Get selected options
  const getSelectedFrameOption = () => filteredFrames.find(f => f.id === selectedFrame);
  const getSelectedStackedFrameOption = () => filteredFrames.find(f => f.id === selectedStackedFrame);
  const getSelectedMatOption = () => databaseMats.find(m => m.id === selectedMat);
  const getSelectedMiddleMatOption = () => databaseMats.find(m => m.id === selectedMiddleMat);
  const getSelectedBottomMatOption = () => databaseMats.find(m => m.id === selectedBottomMat);
  const getSelectedGlassOption = () => glassOptions.find(g => g.id === selectedGlass);

  // Get selected reveal size display name
  const getRevealSizeDisplay = (sizeId: number) => {
    const size = revealSizes.find(s => s.id === sizeId);
    return size ? size.displayName : '1/8"';
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const frame = getSelectedFrameOption();
    const stackedFrame = useStackedFrame ? getSelectedStackedFrameOption() : null;
    const topMat = getSelectedMatOption();
    const middleMat = useMiddleMat ? getSelectedMiddleMatOption() : null;
    const bottomMat = useBottomMat ? getSelectedBottomMatOption() : null;
    const glass = getSelectedGlassOption();

    if (!frame || !topMat || !glass) return;

    // Mark all steps as completed when adding to cart
    if (progress?.currentStep === 'glass_selection') {
      markStepCompleted('glass_selection');
    }

    // Update design progress to indicate completion
    markStepCompleted('design_complete');
    updateCurrentStep('checkout');

    const price = calculatePrice();
    let itemName = `Custom Frame - ${frame.name}`;

    if (useStackedFrame && stackedFrame) {
      itemName += ` & ${stackedFrame.name} Stack`;
    }

    itemName += ` w/ ${topMat.name} Mat`;

    if (useMiddleMat || useBottomMat) {
      itemName += " (multi-mat)";
    }

    if (useFloatMount) {
      itemName += " (float mount)";
    }

    if (useGlassSpacer) {
      itemName += " (glass spacers)";
    }

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
        matId: topMat.id,
        glassId: glass.id,
        frameColor: frame.color,
        matColor: topMat.color,
        glassType: glass.name,
        // Add stacked frame options
        useStackedFrame,
        stackedFrameId: stackedFrame?.id,
        stackedFrameColor: stackedFrame?.color,
        // Add multiple mat options
        useMiddleMat,
        middleMatId: middleMat?.id,
        middleMatColor: middleMat?.color,
        topMatRevealSize: topMatReveal,
        useBottomMat,
        bottomMatId: bottomMat?.id,
        bottomMatColor: bottomMat?.color,
        middleMatRevealSize: middleMatReveal,
        bottomMatRevealSize: bottomMatReveal,
        // Add design tracking information
        designId: designId,
        // Add special mounting options
        useFloatMount,
        useGlassSpacer
      }
    });
  };

    // Function to fetch frame recommendations from the API
    const getFrameRecommendations = async (description: string) => {
        try {
            const res = await apiRequest("POST", "/api/frame-recommendations", {
                artworkDescription: description
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error getting frame recommendations:", error);
            throw error;
        }
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

  // Handle image file selection
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setImageAnalysisResult(null);
  };

    const handleImageAnalysis = async (file: File) => {
    setIsAnalyzingImage(true);
    setImageAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/frame-fitting-assistant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      setImageAnalysisResult(result);

      // Auto-apply the recommendations
      if (result.recommendations?.frames?.length > 0) {
        const recommendedFrame = result.recommendations.frames[0];
        setSelectedFrame(recommendedFrame.id);
      }

      if (result.recommendations?.mats?.length > 0) {
        const recommendedMat = result.recommendations.mats[0];
        setSelectedMat(recommendedMat.id);
      }

      toast({
        title: "Image analysis complete",
        description: "AI recommendations have been applied to your design",
        variant: "default"
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing your image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column with Frame Preview */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-xl p-6 shadow-elegant h-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-serif font-bold text-primary">Custom Frame Designer</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  // Save design functionality
                  toast({
                    title: "Design Saved",
                    description: "Your custom frame design has been saved for later.",
                  });
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button 
                size="sm" 
                className="text-xs"
                onClick={handleAddToCart}
                disabled={!selectedFrame || !selectedMat || !selectedGlass}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Grid Layout for Top Elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Frame Preview in First Column */}
            <div className="md:col-span-2">
              <DynamicFramePreview
                width={width}
                height={height}
                selectedFrame={getSelectedFrameOption() || null}
                selectedMat={getSelectedMatOption() || null}
                selectedGlass={getSelectedGlassOption() || null}
                topMatReveal={topMatReveal}
                middleMatReveal={middleMatReveal}
                bottomMatReveal={bottomMatReveal}
                useMiddleMat={useMiddleMat}
                useBottomMat={useBottomMat}
                useStackedFrame={useStackedFrame}
                selectedStackedFrame={getSelectedStackedFrameOption() || null}
                selectedMiddleMat={getSelectedMiddleMatOption() || null}
                selectedBottomMat={getSelectedBottomMatOption() || null}
              />
            </div>

            {/* Dimensions and Price in Second Column */}
            <div className="md:col-span-1">
              {/* Dimensions */}
              <div className="bg-white p-4 shadow-sm rounded-lg mb-4">
                <h3 className="text-md font-serif font-bold mb-2 text-primary">Artwork Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="block text-xs mb-1 text-neutral-500">Width (in)</Label>
                    <Input 
                      type="number" 
                      value={width}
                      min={1}
                      max={60}
                      onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs mb-1 text-neutral-500">Height (in)</Label>
                    <Input 
                      type="number" 
                      value={height}
                      min={1}
                      max={60}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Frame Specifications Summary */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-md font-serif font-bold mb-2 text-primary">Frame Summary</h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex justify-between items-center">
                    <span className="text-neutral-500">Size:</span>
                    <span className="font-medium text-primary">{width}" × {height}"</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-neutral-500">Frame:</span>
                    <span className="font-medium text-primary truncate max-w-[120px]">{getSelectedFrameOption()?.name || "None"}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-neutral-500">Mat:</span>
                    <span className="font-medium text-primary truncate max-w-[120px]">{getSelectedMatOption()?.name || "None"}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-neutral-500">Glass:</span>
                    <span className="font-medium text-primary truncate max-w-[120px]">{getSelectedGlassOption()?.name || "None"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Frame Selection - Below preview */}
          <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-serif font-bold text-primary">Frame Style</h3>
              {selectedFrame && (
                <span className="text-sm text-secondary font-medium">
                  Selected: {getSelectedFrameOption()?.name}
                </span>
              )}
            </div>

            {/* Collection Filter */}
            {availableCollections.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-2 text-neutral-700">Filter by Collection</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCollection === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCollection(null)}
                    className="text-xs"
                  >
                    All Frames
                  </Button>
                  {availableCollections.map(collection => (
                    <Button
                      key={collection}
                      variant={selectedCollection === collection ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCollection(collection)}
                      className="text-xs"
                    >
                      {collection}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2">
              {filteredFrames.map((frame) => (
                <div 
                  key={frame.id}
                  className={`frame-option cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                    selectedFrame === frame.id 
                      ? 'ring-2 ring-accent scale-105 shadow-md' 
                      : 'hover:shadow-md hover:scale-105 border border-neutral-200'
                  }`}
                  onClick={() => setSelectedFrame(frame.id)}
                >
                  <div className="relative">
                    <div 
                      className="h-16 border-b"
                      style={{ backgroundColor: frame.color }}
                    ></div>
                    {/* Add wooden texture overlay for wood frames */}
                    {frame.material === 'Wood' && (
                      <div 
                        className="absolute inset-0 opacity-30 mix-blend-overlay"
                        style={{ 
                          backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', 
                          backgroundSize: 'cover' 
                        }}
                      ></div>
                    )}
                    {/* Add metal texture overlay for metal frames */}
                    {frame.material === 'Metal' && (
                      <div 
                        className="absolute inset-0 opacity-30 mix-blend-overlay"
                        style={{ 
                          backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum.png")', 
                          backgroundSize: 'cover' 
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-center line-clamp-1">{frame.name}</p>
                    <p className="text-xs text-center text-neutral-500">{frame.material}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stacked Frame Option */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Switch 
                    checked={useStackedFrame}
                    onCheckedChange={setUseStackedFrame}
                    className="mr-2"
                  />
                  <Label className="font-serif text-sm font-medium text-primary cursor-pointer" onClick={() => setUseStackedFrame(!useStackedFrame)}>
                    Add Stacked Frame
                  </Label>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Premium Feature</span>
                </div>
              </div>

              {useStackedFrame && (
                <div className="pl-8 border-l-2 border-accent">
                  <h4 className="text-sm font-medium mb-3 text-primary">Select Secondary Frame</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-2">
                    {filteredFrames.map((frame) => (
                      <div 
                        key={`stacked-${frame.id}`}
                        className={`cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
                          selectedStackedFrame === frame.id 
                            ? 'ring-2 ring-accent scale-105 shadow-md' 
                            : 'hover:shadow-md hover:scale-105 border border-neutral-200'
                        }`}
                        onClick={() => setSelectedStackedFrame(frame.id)}
                      >
                        <div className="relative">
                          <div 
                            className="h-12 border-b"
                            style={{ backgroundColor: frame.color }}
                          ></div>
                          {/* Add wooden texture overlay for wood frames */}
                          {frame.material === 'Wood' && (
                            <div 
                              className="absolute inset-0 opacity-30 mix-blend-overlay"
                              style={{ 
                                backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', 
                                backgroundSize: 'cover' 
                              }}
                            ></div>
                          )}
                          {/* Add metal texture overlay for metal frames */}
                          {frame.material === 'Metal' && (
                            <div 
                              className="absolute inset-0 opacity-30 mix-blend-overlay"
                              style={{ 
                                backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum.png")', 
                                backgroundSize: 'cover' 
                              }}
                            ></div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-center line-clamp-1">{frame.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mat Selection - Below frame options */}
          <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-serif font-bold text-primary">Mat Options</h3>
              {selectedMat && (
                <span className="text-sm text-secondary font-medium">
                  Top Mat: {getSelectedMatOption()?.name}
                </span>
              )}
            </div>

            {/* Top Mat Selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-neutral-700">Top Mat Color</h4>
              <div className="grid grid-cols-6 gap-3">
                {databaseMats.map((mat) => (
                  <div 
                    key={mat.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedMat === mat.id 
                        ? 'ring-2 ring-accent scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setSelectedMat(mat.id)}
                  >
                    {mat.id === 0 ? (
                      <div className="h-12 w-12 mx-auto rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-white">
                        <span className="text-[10px] text-gray-500 font-medium">No Mat</span>
                      </div>
                    ) : (
                      <div 
                        className={`h-12 w-12 mx-auto rounded-full ${mat.color === '#FFFFFF' || mat.color === '#F5F5F5' ? 'border border-gray-200' : ''}`}
                        style={{ backgroundColor: mat.color }}
                      ></div>
                    )}
                    <p className="text-xs mt-2 text-center line-clamp-1">{mat.name}</p>
                  </div>
                ))}
              </div>

              {!useMiddleMat && !useBottomMat && (
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <h4 className="text-sm font-medium mb-2 text-neutral-700">Single Mat Reveal (Optional)</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {/* For Single Mat, show only 1", 2", 3", 4" options */}
                    {[
                      { id: 5, displayName: "1\"" },
                      { id: 6, displayName: "2\"" },
                      { id: 7, displayName: "3\"" },
                      { id: 8, displayName: "4\"" }
                    ].map((size) => (
                      <div 
                        key={`reveal-single-${size.id}`}
                        className={`cursor-pointer bg-white border p-2 rounded-md text-center text-xs font-medium transition-all duration-200 ${
                          topMatReveal === size.id 
                            ? 'border-accent bg-accent/5 text-accent' 
                            : 'border-neutral-200 hover:border-accent/50'
                        }`}
                        onClick={() => setTopMatReveal(size.id)}
                      >
                        {size.displayName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Multiple Mat Options */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Switch 
                      checked={useMiddleMat}
                      onCheckedChange={setUseMiddleMat}
                      className="mr-2"
                    />
                    <Label className="font-serif text-sm font-medium text-primary cursor-pointer" onClick={() => setUseMiddleMat(!useMiddleMat)}>
                      Add Middle Mat
                    </Label>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Decorative Accent</span>
                  </div>
                </div>

                {useMiddleMat && (
                  <div className="pl-8 border-l-2 border-accent mt-3">
                    <div className="mb-3">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium text-primary">Middle Mat Color</h4>
                        {selectedMiddleMat && (
                          <span className="text-xs text-secondary">
                            {getSelectedMiddleMatOption()?.name}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {databaseMats.map((mat) => (
                          <div 
                            key={`middle-${mat.id}`}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedMiddleMat === mat.id 
                                ? 'ring-2 ring-accent scale-105' 
                                : 'hover:scale-105'
                            }`}
                            onClick={() => setSelectedMiddleMat(mat.id)}
                          >
                            <div 
                              className={`h-8 w-8 mx-auto rounded-full ${mat.color === '#FFFFFF' || mat.color === '#F5F5F5' ? 'border border-gray-200' : ''}`}
                              style={{ backgroundColor: mat.color }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2 text-primary">Top Mat Reveal</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {/* For middle/bottom mats, show only 1/8", 1/4", 3/8", 1/2" options */}
                        {[
                          { id: 1, displayName: "1/8\"" },
                          { id: 2, displayName: "1/4\"" },
                          { id: 3, displayName: "3/8\"" },
                          { id: 4, displayName: "1/2\"" }
                        ].map((size) => (
                          <div 
                            key={`reveal-top-${size.id}`}
                            className={`cursor-pointer bg-white border p-2 rounded-md text-center text-xs font-medium transition-all duration-200 ${
                              topMatReveal === size.id 
                                ? 'border-accent bg-accent/5 text-accent' 
                                : 'border-neutral-200 hover:border-accent/50'
                            }`}
                            onClick={() => setTopMatReveal(size.id)}
                          >
                            {size.displayName}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Switch 
                      checked={useBottomMat}
                      onCheckedChange={setUseBottomMat}
                      className="mr-2"
                    />
                    <Label className="font-serif text-sm font-medium text-primary cursor-pointer" onClick={() => setUseBottomMat(!useBottomMat)}>
                      Add Bottom Mat
                    </Label>
                  </div>
                </div>

                {useBottomMat && (
                  <div className="pl-8 border-l-2 border-accent mt-3">
                    <div className="mb-3">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium text-primary">Bottom Mat Color</h4>
                        {selectedBottomMat && (
                          <span className="text-xs text-secondary">
                            {getSelectedBottomMatOption()?.name}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {databaseMats.map((mat) => (
                          <div 
                            key={`bottom-${mat.id}`}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedBottomMat === mat.id 
                                ? 'ring-2 ring-accent scale-105' 
                                : 'hover:scale-105'
                            }`}
                            onClick={() => setSelectedBottomMat(mat.id)}
                          >
                            <div 
                              className={`h-8 w-8 mx-auto rounded-full ${mat.color === '#FFFFFF' || mat.color === '#F5F5F5' ? 'border border-gray-200' : ''}`}
                              style={{ backgroundColor: mat.color }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {useMiddleMat && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2 text-primary">Middle Mat Reveal</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {/* For middle/bottom mats, show only 1/8", 1/4", 3/8", 1/2" options */}
                          {[
                            { id: 1, displayName: "1/8\"" },
                            { id: 2, displayName: "1/4\"" },
                            { id: 3, displayName: "3/8\"" },
                            { id: 4, displayName: "1/2\"" }
                          ].map((size) => (
                            <div 
                              key={`reveal-middle-${size.id}`}
                              className={`cursor-pointer bg-white border p-2 rounded-md text-center text-xs font-medium transition-all duration-200 ${
                                middleMatReveal === size.id 
                                  ? 'border-accent bg-accent/5 text-accent' 
                                  : 'border-neutral-200 hover:border-accent/50'
                              }`}
                              onClick={() => setMiddleMatReveal(size.id)}
                            >
                              {size.displayName}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

             {/* Mounting Options */}
             <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
                <h3 className="text-lg font-serif font-bold text-primary">Mounting Options</h3>
                <p className="text-sm text-neutral-600 mb-4">
                    Choose how your artwork is mounted within the frame.
                </p>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <Switch
                            checked={useFloatMount}
                            onCheckedChange={setUseFloatMount}
                            className="mr-2"
                        />
                        <Label className="font-serif text-sm font-medium text-primary cursor-pointer" onClick={() => setUseFloatMount(!useFloatMount)}>
                            Float Art
                        </Label>
                    </div>
                    <div>
                        <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Special Order</span>
                    </div>
                </div>

                {useFloatMount && (
                    <div className="pl-8 border-l-2 border-accent mt-3">
                        <p className="text-sm text-neutral-600 mb-2">
                            Artwork is mounted on top of the mat for a modern, elevated look.
                        </p>

                        <div className="flex items-center mb-3">
                            <Switch
                                checked={useGlassSpacer}
                                onCheckedChange={setUseGlassSpacer}
                                className="mr-2"
                            />
                            <Label className="text-sm font-medium text-primary cursor-pointer" onClick={() => setUseGlassSpacer(!useGlassSpacer)}>
                                Use Glass Spacers
                            </Label>
                        </div>

                        {useGlassSpacer && (
                            <p className="text-xs text-neutral-500 pl-8">
                                Glass spacers create extra space between the art and glass, providing additional protection.
                            </p>
                        )}
                    </div>
                )}
            </div>

          {/* Mat Selection - End of mat options section */}
          </div>

          {/* Glass Selection - Enhanced with more details */}
          <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-serif font-bold text-primary">Glass Type</h3>
              {selectedGlass && (
                <span className="text-sm text-secondary font-medium">
                  Selected: {getSelectedGlassOption()?.name}
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-600 mb-4">
              Choose the right glass to protect your artwork and enhance its appearance. Different glass options offer varying levels of clarity, UV protection, and glare reduction.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {glassOptions.map((glass) => (
                <div 
                  key={glass.id}
                  className={`cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedGlass === glass.id 
                      ? 'ring-2 ring-accent shadow-md border border-accent/30' 
                      : 'border border-neutral-200 hover:border-accent hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedGlass(glass.id)}
                >
                  <div className="flex items-start p-4">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-1 ${
                      selectedGlass === glass.id ? 'bg-accent text-white' : 'bg-neutral-100'
                    }`}>
                      {selectedGlass === glass.id && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.33332 2.5L3.74999 7.08333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">{glass.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">{glass.description}</p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {glass.name.includes("UV") && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">UV Protection</span>
                        )}
                        {(glass.name.includes("Anti-Glare") || glass.name.includes("Non-Glare")) && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">Reduced Glare</span>
                        )}
                        {glass.name.includes("Museum") && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium">Museum Quality</span>
                        )}
                        {glass.name.includes("Standard") && (
                          <span className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded text-xs font-medium">Basic Protection</span>
                        )}
                      </div>
                    </div>

                    <div className="ml-auto text-sm font-medium text-primary flex-shrink-0">
                      {formatPrice(glass.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
              <p className="font-medium mb-1">Glass Protection Guide</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Standard Glass: Good for basic framing needs in low-light environments</li>
                <li>UV Protection: Recommended for valuable artwork or photographs</li>
                <li>Anti-Glare/Non-Glare: Ideal for areas with direct lighting</li>
                <li>Museum Glass: Best choice for heirlooms and professional displays</li>
              </ul>
            </div>
          </div>

          {/* Frame Specifications */}
          <div className="bg-white rounded-lg p-5 shadow-sm mb-8">
            <h3 className="text-lg font-serif font-bold mb-4 text-primary flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white inline-flex items-center justify-center text-xs mr-2">1</span>
              Frame Specifications
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="text-neutral-500 text-sm">Artwork Size:</span>
                <span className="font-medium text-primary">{width}" × {height}"</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="text-neutral-500 text-sm">Frame Style:</span>
                <div className="flex items-center">
                  {selectedFrame && (
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedFrameOption()?.color }}></span>
                  )}
                  <span className="font-medium text-primary">{getSelectedFrameOption()?.name || "Loading..."}</span>
                </div>
              </li>

              {useStackedFrame && selectedStackedFrame && (
                <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500 text-sm">Stacked Frame:</span>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedStackedFrameOption()?.color }}></span>
                    <span className="font-medium text-primary">{getSelectedStackedFrameOption()?.name || "Loading..."}</span>
                  </div>
                </li>
              )}

              <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="text-neutral-500 text-sm">Top Mat:</span>
                <div className="flex items-center">
                  {selectedMat && (
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedMatOption()?.color }}></span>
                  )}
                  <span className="font-medium text-primary">{getSelectedMatOption()?.name || "Loading..."}</span>
                </div>
              </li>

              {useMiddleMat && selectedMiddleMat && (
                <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500 text-sm">Middle Mat:</span>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedMiddleMatOption()?.color }}></span>
                    <span className="font-medium text-primary">
                      {getSelectedMiddleMatOption()?.name || "Loading..."} 
                      <span className="ml-2 text-xs text-neutral-500">({getRevealSizeDisplay(topMatReveal)} reveal)</span>
                    </span>
                  </div>
                </li>
              )}

              {useBottomMat && selectedBottomMat && (
                <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500 text-sm">Bottom Mat:</span>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedBottomMatOption()?.color }}></span>
                    <span className="font-medium text-primary">
                      {getSelectedBottomMatOption()?.name || "Loading..."}
                      {useMiddleMat && (
                        <span className="ml-2 text-xs text-neutral-500">({getRevealSizeDisplay(middleMatReveal)} reveal)</span>
                      )}
                    </span>
                  </div>
                </li>
              )}

               {useFloatMount && (
                    <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                        <span className="text-neutral-500 text-sm">Mounting:</span>
                        <span className="font-medium text-primary">
                            Float Mount {useGlassSpacer ? "(with glass spacers)" : ""}
                        </span>
                    </li>
                )}

              <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="text-neutral-500 text-sm">Glass Type:</span>
                <span className="font-medium text-primary">{getSelectedGlassOption()?.name || "Loading..."}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-neutral-500 text-sm">Mounting:</span>
                <span className="font-medium text-primary">Premium Mounting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Sidebar Options */}
      <div className="bg-gradient-to-tr from-neutral-50 to-neutral-100 rounded-xl p-6 shadow-elegant">
        {/* Design Progress Tracker */}
        <div className="bg-white rounded-lg p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-primary flex items-center">
              <Target className="h-5 w-5 mr-2 text-accent" />
              Your Design Journey
            </h3>
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-secondary">
                {progress?.totalPoints || 0} pts
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <ProgressBar />
          </div>

          {/* Progress Tracker */}
          <div className="space-y-2">
            <ProgressTracker />
          </div>

          {/* Design Tips based on current step */}
          {progress?.currentStep && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <h4 className="font-medium text-primary mb-2 text-sm">Design Tips</h4>
              {progress.currentStep === 'sizing' && (
                <p className="text-xs text-neutral-500">
                  Make sure to measure your artwork precisely. For best results, measure the visible area you want to display, not including any existing borders or mats.
                </p>
              )}
              {progress.currentStep === 'frame_selection' && (
                <p className="text-xs text-neutral-500">
                  Choose a frame color that complements your artwork. For bold pieces, consider neutral frames. For subtle artwork, try a more colorful frame.
                </p>
              )}
              {progress.currentStep === 'mat_selection' && (
                <p className="text-xs text-neutral-500">
                  Mats create visual space between your art and frame. For a classic look, choose a lighter mat color. For drama, try deeper colors that complement your artwork.
                </p>
              )}
              {progress.currentStep === 'glass_selection' && (
                <p className="text-xs text-neutral-500">
                  UV protection glass helps prevent your artwork from fading. Consider museum glass for valuable artwork or pieces exposed to direct sunlight.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm mb-6 text-center">
          <h3 className="text-xl font-serif font-bold text-primary mb-1">Design Assistance</h3>
          <p className="text-sm text-neutral-500">Get expert help for your perfect frame</p>
        </div>

        {/* AI Image Analysis */}
        <div className="mb-8 relative overflow-hidden rounded-xl shadow-highlight">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/30 z-0"></div>
          <div className="absolute top-0 right-0 h-24 w-24 bg-accent/10 rounded-full -mr-8 -mt-8 z-0"></div>
          <div className="absolute bottom-0 left-0 h-16 w-16 bg-accent/10 rounded-full -ml-6 -mb-6 z-0"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-accent rounded-full p-2.5 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h4 className="text-base font-serif font-bold text-primary">AI Image Analysis</h4>
                <p className="text-sm text-neutral-600">
                  Upload your artwork for instant AI recommendations
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              {!previewUrl ? (
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 mb-3">Upload your artwork</p>
                  <Button asChild variant="outline" size="sm">
                    <label className="cursor-pointer">
                      <Input 
                        type="file"
                        className="hidden"
                        onChange={handleImageFileChange}
                        accept="image/*"
                      />
                      <Camera className="mr-2 h-4 w-4" />
                      Choose Image
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-neutral-200">
                    <img 
                      src={previewUrl} 
                      alt="Artwork preview" 
                      className="w-full h-32 object-cover"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setImageAnalysisResult(null);
                      }}
                      className="flex-1"
                    >
                      Change
                    </Button>
                    <Button 
                      onClick={analyzeImageForFraming}
                      disabled={isAnalyzingImage}
                      size="sm"
                      className="flex-1 bg-accent hover:bg-accent/90 text-white"
                    >
                      {isAnalyzingImage ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-3 w-3" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {imageAnalysisResult && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-accent/30 mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                  </div>
                  <h5 className="text-sm font-bold text-primary">AI Recommendations</h5>
                </div>

                {/* Visual Design Preview */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-4 mb-4">
                  <p className="text-xs text-neutral-600 mb-3 text-center">
                    {imageAnalysisResult.reasoning}
                  </p>

                  {imageAnalysisResult.recommendations && (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Top Frame Recommendations */}
                      <div>
                        <h6 className="text-xs font-medium text-neutral-500 mb-2">Top Frame Picks</h6>
                        <div className="space-y-2">
                          {imageAnalysisResult.recommendations.frames.slice(0, 2).map((frameRec: any, index: number) => {
                            const frame = databaseFrames.find((f: any) => f.id === frameRec.id);
                            return frame ? (
                              <div key={index} className="flex items-center space-x-2 bg-white rounded-md p-2 cursor-pointer hover:bg-accent/5 transition-colors"
                                   onClick={() => setSelectedFrame(frame.id)}>
                                <div 
                                  className="w-6 h-6 rounded border border-neutral-300 flex-shrink-0"
                                  style={{ backgroundColor: frame.color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-primary truncate">{frame.name}</p>
                                  <div className="flex items-center space-x-1">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-1 h-1 rounded-full ${i < Math.floor(frameRec.score / 2) ? 'bg-accent' : 'bg-neutral-200'}`} />
                                      ))}
                                    </div>
                                    <span className="text-xs text-neutral-500">{frameRec.score}/10</span>
                                  </div>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>

                      {/* Top Mat Recommendations */}
                      <div>
                        <h6 className="text-xs font-medium text-neutral-500 mb-2">Top Mat Picks</h6>
                        <div className="space-y-2">
                          {imageAnalysisResult.recommendations.mats.slice(0, 2).map((matRec: any, index: number) => {
                            const mat = databaseMats.find((m: any) => m.id === matRec.id);
                            return mat ? (
                              <div key={index} className="flex items-center space-x-2 bg-white rounded-md p-2 cursor-pointer hover:bg-accent/5 transition-colors"
                                   onClick={() => setSelectedMat(mat.id)}>
                                <div 
                                  className="w-6 h-6 rounded-full border border-neutral-300 flex-shrink-0"
                                  style={{ backgroundColor: mat.color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-primary truncate">{mat.name}</p>
                                  <div className="flex items-center space-x-1">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-1 h-1 rounded-full ${i < Math.floor(matRec.score / 2) ? 'bg-accent' : 'bg-neutral-200'}`} />
                                      ))}
                                    </div>
                                    <span className="text-xs text-neutral-500">{matRec.score}/10</span>
                                  </div>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analysis Details */}
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Style:</span>
                        <span className="font-medium">{imageAnalysisResult.style}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Mood:</span>
                        <span className="font-medium">{imageAnalysisResult.mood}</span>
                      </div>
                    </div>
                    {imageAnalysisResult.dominantColors && (
                      <div className="mt-2">
                        <span className="text-neutral-500 text-xs">Dominant Colors:</span>
                        <div className="flex space-x-1 mt-1">
                          {imageAnalysisResult.dominantColors.slice(0, 4).map((color: string, index: number) => (
                            <div 
                              key={index}
                              className="w-4 h-4 rounded-full border border-neutral-200" 
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Text-based AI recommendations fallback */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="block text-xs font-medium text-neutral-500 mb-2">
                Or describe your artwork
              </label>
              <Textarea 
                placeholder="E.g. 'A vibrant sunset watercolor painting with orange and purple hues'"
                className="text-sm mb-3 min-h-[60px] border-neutral-200 focus:border-accent focus:ring-1 focus:ring-accent"
                value={artworkDescription}
                onChange={(e) => setArtworkDescription(e.target.value)}
              />

              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={getAiRecommendations}
                disabled={aiRecommendationMutation.isPending || !artworkDescription.trim()}
              >
                {aiRecommendationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Getting recommendations...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-3 w-3" />
                    Get Text Recommendations
                  </>
                )}
              </Button>
            </div>

            {aiRecommendations && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-accent/30 mt-4">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                  </div>
                  <h5 className="text-sm font-bold text-primary">Text-Based Recommendation</h5>
                </div>
                <p className="text-sm text-neutral-700 mb-3">{aiRecommendations.explanation}</p>

                {aiRecommendations.frames.length > 0 && aiRecommendations.mats.length > 0 && (
                  <div className="flex items-center justify-center gap-6 bg-neutral-50 rounded-md p-3">
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 mx-auto rounded-md mb-1 border border-neutral-300"
                        style={{ 
                          backgroundColor: aiRecommendations.frames[0]?.color,
                          opacity: 0.8 
                        }}
                      ></div>
                      <span className="text-xs text-neutral-500">{aiRecommendations.frames[0]?.name}</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 mx-auto rounded-full mb-1 border border-neutral-300"
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

            <p className="text-center text-xs text-neutral-500 italic mt-4">
              AI-powered analysis for perfect frame selection
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
                {selectedMat && selectedMat !== 0 && getSelectedMatOption() && getSelectedMatOption()!.price > 0
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
             {useFloatMount && (
                    <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                        <span className="text-neutral-500 text-sm">Float Mounting:</span>
                        <span className="font-medium text-primary">$50.00</span>
                    </li>
                )}

                {useGlassSpacer && useFloatMount && (
                    <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                        <span className="text-neutral-500 text-sm">Glass Spacers:</span>
                        <span className="font-medium text-primary">$35.00</span>
                    </li>
                )}
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