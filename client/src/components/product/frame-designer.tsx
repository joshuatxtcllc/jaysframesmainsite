import { useState, useEffect } from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { FrameOption, MatOption, GlassOption } from "@/types";
import { Lightbulb } from "lucide-react";

interface FrameDesignerProps {
  initialWidth?: number;
  initialHeight?: number;
}

const FrameDesigner = ({ initialWidth = 16, initialHeight = 20 }: FrameDesignerProps) => {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [selectedMat, setSelectedMat] = useState<number | null>(null);
  const [selectedGlass, setSelectedGlass] = useState<number | null>(null);
  const [artworkDescription, setArtworkDescription] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState<{
    frames: FrameOption[];
    mats: MatOption[];
    explanation: string;
  } | null>(null);
  
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
      const res = await apiRequest("POST", "/api/frame-recommendations", {
        artworkDescription: description
      });
      return res.json();
    },
    onSuccess: (data) => {
      setAiRecommendations(data);
      // Auto-select the first recommendations
      if (data.frames.length > 0) {
        setSelectedFrame(data.frames[0].id);
      }
      if (data.mats.length > 0) {
        setSelectedMat(data.mats[0].id);
      }
    }
  });

  const getAiRecommendations = () => {
    if (!artworkDescription.trim()) return;
    aiRecommendationMutation.mutate(artworkDescription);
  };

  // Frame border style for preview
  const getFrameStyle = () => {
    const frame = getSelectedFrameOption();
    const mat = getSelectedMatOption();
    
    if (!frame || !mat) return {};
    
    return {
      boxShadow: `0 0 0 20px ${mat.color}, 0 0 0 23px ${frame.color}`
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Frame Preview */}
      <div className="lg:col-span-2 bg-neutral-100 rounded-lg p-6">
        <div className="bg-white p-4 shadow-md rounded-md mb-6">
          <div className="aspect-w-4 aspect-h-3 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Artwork preview"
                className="max-w-full max-h-full"
                style={getFrameStyle()}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-heading font-bold mb-3 text-primary">Frame Specifications</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-neutral-500">Artwork Size:</span>
                <span className="font-medium">{width}" × {height}"</span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-500">Frame Style:</span>
                <span className="font-medium">{getSelectedFrameOption()?.name || "Loading..."}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-500">Mat Color:</span>
                <span className="font-medium">{getSelectedMatOption()?.name || "Loading..."}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-500">Glass Type:</span>
                <span className="font-medium">{getSelectedGlassOption()?.name || "Loading..."}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-500">Mounting:</span>
                <span className="font-medium">Moonmount™</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-bold mb-3 text-primary">Price Breakdown</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-neutral-500">Frame:</span>
                <span className="font-medium">
                  {selectedFrame && getSelectedFrameOption() 
                    ? formatPrice(2 * (width + height) * getSelectedFrameOption()!.pricePerInch) 
                    : "$0.00"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-500">Matting:</span>
                <span className="font-medium">
                  {selectedMat && getSelectedMatOption() 
                    ? formatPrice(getSelectedMatOption()!.price) 
                    : "$0.00"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-500">Glass:</span>
                <span className="font-medium">
                  {selectedGlass && getSelectedGlassOption() 
                    ? formatPrice(getSelectedGlassOption()!.price) 
                    : "$0.00"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-500">Mounting:</span>
                <span className="font-medium">$25.00</span>
              </li>
              <li className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold text-primary">Total:</span>
                <span className="font-bold text-primary">{formatPrice(calculatePrice())}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Frame Options */}
      <div className="bg-neutral-100 rounded-lg p-6">
        <h3 className="text-lg font-heading font-bold mb-4 text-primary">Customize Your Frame</h3>
        
        {/* AI Designer */}
        <div className="mb-6 p-4 bg-accent bg-opacity-10 rounded-lg border border-accent border-opacity-30">
          <div className="flex items-start mb-3">
            <div className="flex-shrink-0 bg-accent rounded-full p-2">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-bold text-accent">AI Frame Designer</h4>
              <p className="text-xs text-neutral-500 mb-3">
                Describe your artwork and our AI will recommend the perfect frame and mat combination.
              </p>
              
              <Textarea 
                placeholder="Describe your artwork (e.g. 'Landscape watercolor painting with blue and green tones')"
                className="text-sm mb-3"
                value={artworkDescription}
                onChange={(e) => setArtworkDescription(e.target.value)}
              />
              
              <Button 
                variant="default" 
                className="w-full bg-accent hover:bg-accent-light text-white text-sm"
                onClick={getAiRecommendations}
                disabled={aiRecommendationMutation.isPending || !artworkDescription.trim()}
              >
                {aiRecommendationMutation.isPending ? "Getting Recommendations..." : "Get AI Suggestions"}
              </Button>
              
              {aiRecommendations && (
                <div className="mt-3 text-xs text-neutral-500">
                  <p className="font-bold text-accent mb-1">AI Recommendation:</p>
                  <p>{aiRecommendations.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Frame Selection */}
        <div className="mb-6">
          <Label className="block text-sm font-bold mb-2">Frame Style</Label>
          <div className="grid grid-cols-3 gap-2">
            {frameOptions.map((frame) => (
              <div 
                key={frame.id}
                className={`frame-option cursor-pointer bg-white rounded p-2 border-2 ${
                  selectedFrame === frame.id ? 'border-accent' : 'border-transparent hover:border-accent'
                }`}
                onClick={() => setSelectedFrame(frame.id)}
              >
                <div 
                  className="h-12 rounded"
                  style={{ backgroundColor: frame.color }}
                ></div>
                <p className="text-xs mt-1 text-center">{frame.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mat Selection */}
        <div className="mb-6">
          <Label className="block text-sm font-bold mb-2">Mat Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {matOptions.map((mat) => (
              <div 
                key={mat.id}
                className={`frame-option cursor-pointer bg-white rounded p-2 border-2 ${
                  selectedMat === mat.id ? 'border-accent' : 'border-transparent hover:border-accent'
                }`}
                onClick={() => setSelectedMat(mat.id)}
              >
                <div 
                  className={`h-12 rounded ${mat.color === '#FFFFFF' || mat.color === '#F5F5F5' ? 'border border-gray-200' : ''}`}
                  style={{ backgroundColor: mat.color }}
                ></div>
                <p className="text-xs mt-1 text-center">{mat.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Glass Selection */}
        <div className="mb-6">
          <Label className="block text-sm font-bold mb-2">Glass Type</Label>
          <Select value={selectedGlass?.toString()} onValueChange={(value) => setSelectedGlass(parseInt(value))}>
            <SelectTrigger className="w-full p-2 border border-gray-300 rounded">
              <SelectValue placeholder="Select glass type" />
            </SelectTrigger>
            <SelectContent>
              {glassOptions.map((glass) => (
                <SelectItem key={glass.id} value={glass.id.toString()}>
                  {glass.name} {glass.price > 0 && `(+${formatPrice(glass.price)})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedGlass && (
            <p className="text-xs mt-1 text-neutral-500">
              {getSelectedGlassOption()?.description}
            </p>
          )}
        </div>
        
        {/* Size Selection */}
        <div className="mb-6">
          <Label className="block text-sm font-bold mb-2">Artwork Dimensions</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs mb-1">Width (inches)</Label>
              <Input 
                type="number" 
                value={width}
                min={1}
                max={60}
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                className="w-full p-2"
              />
            </div>
            <div>
              <Label className="block text-xs mb-1">Height (inches)</Label>
              <Input 
                type="number" 
                value={height}
                min={1}
                max={60}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className="w-full p-2"
              />
            </div>
          </div>
        </div>
        
        {/* Add to Cart */}
        <Button 
          className="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-3 px-4 rounded transition duration-300"
          onClick={handleAddToCart}
          disabled={!selectedFrame || !selectedMat || !selectedGlass}
        >
          Add to Cart - {formatPrice(calculatePrice())}
        </Button>
      </div>
    </div>
  );
};

export default FrameDesigner;
