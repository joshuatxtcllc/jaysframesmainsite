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
import { Lightbulb, ShoppingCart } from "lucide-react";

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
      border: '5px solid white',
      boxShadow: `0 0 0 30px ${mat.color}, 0 0 0 40px ${frame.color}`,
      borderRadius: '2px',
      transition: 'all 0.3s ease-in-out'
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Frame Preview */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-xl p-8 shadow-elegant h-full">
          <h2 className="text-2xl font-serif font-bold mb-6 text-primary">Frame Preview</h2>
          
          <div className="bg-white p-6 shadow-highlight rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/50 to-transparent z-0"></div>
            <div className="relative z-10">
              <div className="aspect-w-4 aspect-h-3 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Artwork preview"
                    className="max-w-full max-h-full shadow-xl"
                    style={getFrameStyle()}
                  />
                </div>
              </div>
            </div>
            
            {selectedFrame && selectedMat && (
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-md py-1 px-3 text-xs font-medium shadow-sm border border-neutral-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSelectedFrameOption()?.color }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSelectedMatOption()?.color }}></div>
                  <span>{getSelectedFrameOption()?.name} frame, {getSelectedMatOption()?.name} mat</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-5 shadow-sm">
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
                <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                  <span className="text-neutral-500 text-sm">Mat Color:</span>
                  <div className="flex items-center">
                    {selectedMat && (
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSelectedMatOption()?.color }}></span>
                    )}
                    <span className="font-medium text-primary">{getSelectedMatOption()?.name || "Loading..."}</span>
                  </div>
                </li>
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
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
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
          </div>
        </div>
      </div>
      
      {/* Frame Options */}
      <div className="bg-gradient-to-tr from-neutral-50 to-neutral-100 rounded-xl p-6 shadow-elegant">
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6 text-center">
          <h3 className="text-xl font-serif font-bold text-primary mb-1">Customize Your Frame</h3>
          <p className="text-sm text-neutral-500">Choose options to create your perfect custom frame</p>
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
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing artwork...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
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
                        className="w-10 h-10 mx-auto rounded-md mb-1"
                        style={{ backgroundColor: aiRecommendations.frames[0]?.color }}
                      ></div>
                      <span className="text-xs text-neutral-500">{aiRecommendations.frames[0]?.name}</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-10 h-10 mx-auto rounded-full mb-1"
                        style={{ backgroundColor: aiRecommendations.mats[0]?.color }}
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
        
        {/* Frame Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <Label className="text-sm font-bold text-primary">Frame Style</Label>
            {selectedFrame && (
              <span className="text-xs text-secondary font-medium">
                {getSelectedFrameOption()?.name}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {frameOptions.map((frame) => (
              <div 
                key={frame.id}
                className={`frame-option cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                  selectedFrame === frame.id 
                    ? 'ring-2 ring-accent scale-105 shadow-md' 
                    : 'hover:shadow-md hover:scale-105'
                }`}
                onClick={() => setSelectedFrame(frame.id)}
              >
                <div 
                  className="h-14 border-b"
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
        
        {/* Mat Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <Label className="text-sm font-bold text-primary">Mat Color</Label>
            {selectedMat && (
              <span className="text-xs text-secondary font-medium">
                {getSelectedMatOption()?.name}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {matOptions.map((mat) => (
              <div 
                key={mat.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMat === mat.id 
                    ? 'ring-2 ring-accent scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => setSelectedMat(mat.id)}
              >
                <div 
                  className={`h-12 w-12 mx-auto rounded-full ${mat.color === '#FFFFFF' || mat.color === '#F5F5F5' ? 'border border-gray-200' : ''}`}
                  style={{ backgroundColor: mat.color }}
                ></div>
                <p className="text-xs mt-2 text-center line-clamp-1">{mat.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Glass Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <Label className="text-sm font-bold text-primary">Glass Type</Label>
            {selectedGlass && (
              <span className="text-xs text-secondary font-medium">
                {getSelectedGlassOption()?.name}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {glassOptions.map((glass) => (
              <div 
                key={glass.id}
                className={`cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedGlass === glass.id 
                    ? 'ring-2 ring-accent shadow-md' 
                    : 'border border-neutral-200 hover:border-accent hover:shadow-sm'
                }`}
                onClick={() => setSelectedGlass(glass.id)}
              >
                <div className="flex items-center p-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                    selectedGlass === glass.id ? 'bg-accent text-white' : 'bg-neutral-100'
                  }`}>
                    {selectedGlass === glass.id && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.33332 2.5L3.74999 7.08333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-primary">{glass.name}</span>
                      <span className="text-xs font-bold text-secondary">
                        {glass.price > 0 ? `+${formatPrice(glass.price)}` : "Included"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {glass.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Size Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <Label className="text-sm font-bold text-primary">Artwork Dimensions</Label>
            <span className="text-xs text-secondary font-medium">{width}" × {height}"</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <span className="text-3xl font-medium text-primary">{width}"</span>
                <p className="text-xs text-neutral-500">Width</p>
              </div>
              <div className="text-neutral-300">×</div>
              <div className="text-center">
                <span className="text-3xl font-medium text-primary">{height}"</span>
                <p className="text-xs text-neutral-500">Height</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-xs mb-1 text-neutral-500">Width (inches)</Label>
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
                <Label className="block text-xs mb-1 text-neutral-500">Height (inches)</Label>
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
        </div>
        
        {/* Add to Cart */}
        <div className="sticky bottom-0 left-0 right-0 pt-4">
          <div className="bg-white rounded-lg p-4 shadow-elegant">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs text-neutral-500">Total Price</p>
                <p className="text-xl font-bold text-secondary">{formatPrice(calculatePrice())}</p>
              </div>
              <Button 
                className="btn-secondary py-3 px-6 flex items-center gap-2"
                onClick={handleAddToCart}
                disabled={!selectedFrame || !selectedMat || !selectedGlass}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
            
            <p className="text-xs text-neutral-500 text-center">
              Free shipping & 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameDesigner;
