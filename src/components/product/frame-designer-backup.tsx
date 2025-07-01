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
import { Lightbulb, ShoppingCart, Trophy, Target, Download } from "lucide-react";
import { DynamicFramePreview } from "./dynamic-frame-preview";
import { ProgressTracker, ProgressBar } from "@/components/design-progress";
import { useDesignProgress } from "@/contexts/design-progress-context";

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
  const [useStackedFrame, setUseStackedFrame] = useState<boolean>(false);
  const [selectedStackedFrame, setSelectedStackedFrame] = useState<number | null>(null);
  const [useMiddleMat, setUseMiddleMat] = useState<boolean>(false);
  const [useBottomMat, setUseBottomMat] = useState<boolean>(false);
  const [selectedMiddleMat, setSelectedMiddleMat] = useState<number | null>(null);
  const [selectedBottomMat, setSelectedBottomMat] = useState<number | null>(null);
  const [topMatReveal, setTopMatReveal] = useState<number>(1);
  const [middleMatReveal, setMiddleMatReveal] = useState<number>(1);
  const [useFloatMount, setUseFloatMount] = useState<boolean>(false);
  const [useGlassSpacer, setUseGlassSpacer] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [artworkDescription, setArtworkDescription] = useState("");
  const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);

  const { addItem } = useCart();
  const { markStepCompleted, setFrameSelected, setMatSelected, setGlassSelected } = useDesignProgress();

  // Fetch frame options
  const { data: databaseFrames = [] } = useQuery({
    queryKey: ["/api/frame-options"],
    select: (data) => data as FrameOption[]
  });

  // Fetch mat options
  const { data: databaseMats = [] } = useQuery({
    queryKey: ["/api/mat-options"],
    select: (data) => data as MatOption[]
  });

  // Fetch glass options
  const { data: glassOptions = [] } = useQuery({
    queryKey: ["/api/glass-options"],
    select: (data) => data as GlassOption[]
  });

  // Group frames by collection
  const framesByCollection = useMemo(() => {
    const grouped: {[key: string]: FrameOption[]} = {};
    
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

  // Get available collections
  const availableCollections = useMemo(() => {
    return Object.keys(framesByCollection).sort();
  }, [framesByCollection]);

  // Filter frames by collection
  const filteredFrames = useMemo(() => {
    if (databaseFrames.length === 0) {
      return [];
    }
    
    if (!selectedCollection) {
      return databaseFrames.slice(0, 100);
    }

    return framesByCollection[selectedCollection] || [];
  }, [databaseFrames, framesByCollection, selectedCollection]);

  // Helper functions
  const getSelectedFrameOption = () => {
    return filteredFrames.find(frame => frame.id === selectedFrame);
  };

  const getSelectedMatOption = () => {
    return databaseMats.find(mat => mat.id === selectedMat);
  };

  const getSelectedGlassOption = () => {
    return glassOptions.find(glass => glass.id === selectedGlass);
  };

  const calculatePrice = () => {
    let total = 0;
    
    // Frame cost
    if (selectedFrame && getSelectedFrameOption()) {
      total += 2 * (width + height) * getSelectedFrameOption()!.pricePerInch;
    }
    
    // Mat cost
    if (selectedMat && getSelectedMatOption()) {
      total += getSelectedMatOption()!.price;
    }
    
    // Glass cost
    if (selectedGlass && getSelectedGlassOption()) {
      total += getSelectedGlassOption()!.price;
    }
    
    // Additional options
    if (useFloatMount) total += 5000; // $50.00
    if (useGlassSpacer && useFloatMount) total += 3500; // $35.00
    total += 2500; // $25.00 mounting
    
    return total;
  };

  const handleAddToCart = () => {
    if (!selectedFrame || !selectedMat || !selectedGlass) return;
    
    const frameOption = getSelectedFrameOption();
    const matOption = getSelectedMatOption();
    const glassOption = getSelectedGlassOption();
    
    if (!frameOption || !matOption || !glassOption) return;
    
    addItem({
      id: `custom-frame-${Date.now()}`,
      name: `Custom Frame - ${frameOption.name}`,
      price: calculatePrice(),
      quantity: 1,
      image: frameOption.imageUrl,
      customOptions: {
        frame: frameOption.name,
        mat: matOption.name,
        glass: glassOption.name,
        dimensions: `${width}" × ${height}"`
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column with Frame Preview */}
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-xl p-6 shadow-elegant h-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-serif font-bold text-primary">Custom Frame Designer</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-6">
            <ProgressTracker />
            <ProgressBar />
          </div>

          {/* Frame Preview */}
          <div className="bg-white rounded-lg p-4 mb-6 min-h-[400px] flex items-center justify-center">
            <DynamicFramePreview
              width={width}
              height={height}
              frameOption={getSelectedFrameOption()}
              matOption={getSelectedMatOption()}
              glassOption={getSelectedGlassOption()}
              stackedFrameOption={useStackedFrame ? filteredFrames.find(f => f.id === selectedStackedFrame) : undefined}
              middleMatOption={useMiddleMat ? databaseMats.find(m => m.id === selectedMiddleMat) : undefined}
              bottomMatOption={useBottomMat ? databaseMats.find(m => m.id === selectedBottomMat) : undefined}
              topMatReveal={topMatReveal}
              middleMatReveal={middleMatReveal}
              useFloatMount={useFloatMount}
              useGlassSpacer={useGlassSpacer}
            />
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-primary">AI Frame Assistant</h3>
            </div>
            <Textarea
              placeholder="Describe your artwork (e.g., 'Modern abstract painting with blue and gold colors')"
              value={artworkDescription}
              onChange={(e) => setArtworkDescription(e.target.value)}
              className="mb-3"
              rows={2}
            />
            <Button 
              size="sm" 
              disabled={!artworkDescription.trim() || isGettingRecommendations}
              className="w-full"
            >
              {isGettingRecommendations ? "Getting Recommendations..." : "Get AI Recommendations"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Options */}
      <div className="space-y-6">
        {/* Dimensions */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-serif font-bold mb-3 text-primary">Artwork Size</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width" className="text-sm font-medium text-neutral-700">Width (inches)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                min={1}
                max={60}
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                className="w-full p-2 border-neutral-200"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-sm font-medium text-neutral-700">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                min={1}
                max={60}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className="w-full p-2 border-neutral-200"
              />
            </div>
          </div>
        </div>

        {/* Frame Selection */}
        <div className="bg-white p-6 shadow-sm rounded-lg">
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
          
          <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {filteredFrames.map((frame) => (
              <div
                key={frame.id}
                className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all ${
                  selectedFrame === frame.id
                    ? 'border-primary bg-primary/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
                onClick={() => {
                  setSelectedFrame(frame.id);
                  setFrameSelected(true);
                  markStepCompleted('frame_selection');
                }}
              >
                <div
                  className="w-full h-12 rounded border-2"
                  style={{
                    backgroundColor: frame.color,
                    borderColor: frame.material === 'Wood' ? '#8B4513' : '#C0C0C0'
                  }}
                />
                <p className="text-xs mt-1 text-center font-medium truncate">{frame.name}</p>
                <p className="text-xs text-center text-neutral-500">{formatPrice(frame.pricePerInch)}/inch</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mat Selection */}
        <div className="bg-white p-6 shadow-sm rounded-lg">
          <h3 className="text-lg font-serif font-bold mb-3 text-primary">Mat Options</h3>
          <div className="grid grid-cols-3 gap-3">
            {databaseMats.map((mat) => (
              <div
                key={mat.id}
                className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all ${
                  selectedMat === mat.id
                    ? 'border-primary bg-primary/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
                onClick={() => {
                  setSelectedMat(mat.id);
                  setMatSelected(true);
                  markStepCompleted('mat_selection');
                }}
              >
                <div
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: mat.color }}
                />
                <p className="text-xs mt-1 text-center font-medium truncate">{mat.name}</p>
                <p className="text-xs text-center text-neutral-500">{formatPrice(mat.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Glass Selection */}
        <div className="bg-white p-6 shadow-sm rounded-lg">
          <h3 className="text-lg font-serif font-bold mb-3 text-primary">Glass Type</h3>
          <div className="space-y-3">
            {glassOptions.map((glass) => (
              <div
                key={glass.id}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  selectedGlass === glass.id
                    ? 'border-primary bg-primary/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
                onClick={() => {
                  setSelectedGlass(glass.id);
                  setGlassSelected(true);
                  markStepCompleted('glass_selection');
                }}
              >
                <p className="font-medium text-sm">{glass.name}</p>
                <p className="text-xs text-neutral-500 mb-1">{glass.description}</p>
                <p className="text-xs text-primary font-medium">{formatPrice(glass.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-serif font-bold mb-3 text-primary">Price Breakdown</h3>
          <ul className="space-y-2 text-sm">
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