import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera, RotateCw, Sparkles, Image } from "lucide-react";
import { FrameOption, MatOption, GlassOption } from "@/types";
import { AugmentedRealityPreview } from "./augmented-reality-preview";
import { AnimatedFramePreview } from "./animated-frame-preview";

interface DynamicFramePreviewProps {
  width: number;
  height: number;
  selectedFrame: FrameOption | null;
  selectedMat: MatOption | null;
  selectedGlass: GlassOption | null;
  topMatReveal: number;
  middleMatReveal: number;
  bottomMatReveal: number;
  useMiddleMat: boolean;
  useBottomMat: boolean;
  useStackedFrame?: boolean;
  selectedStackedFrame?: FrameOption | null;
  selectedMiddleMat?: MatOption | null;
  selectedBottomMat?: MatOption | null;
  uploadedImage?: string | null;
  onImageUpload?: (file: File) => void;
}

const DynamicFramePreview = ({ 
  width, 
  height, 
  selectedFrame, 
  selectedMat, 
  selectedGlass,
  topMatReveal,
  middleMatReveal,
  bottomMatReveal,
  useMiddleMat,
  useBottomMat,
  useStackedFrame = false,
  selectedStackedFrame = null,
  selectedMiddleMat = null,
  selectedBottomMat = null,
  uploadedImage = null,
  onImageUpload
}: DynamicFramePreviewProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [showARPreview, setShowARPreview] = useState<boolean>(false);
  const [showAnimatedPreview, setShowAnimatedPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload for the image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      // Use the callback if provided, otherwise handle locally
      if (onImageUpload) {
        onImageUpload(file);
        setIsLoading(false);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUserImage(event.target?.result as string);
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Reset and clear the current image
  const resetImage = () => {
    setUserImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

    // Calculate the display width and height based on aspect ratio
    const aspectRatio = width / height;
    const displayWidth = 280;
    const displayHeight = displayWidth / aspectRatio;

    // Default frame and mat widths (adjust as needed)
    const frameWidth = 10;
    const matWidth = 5;


  // Open the AR preview modal
  const openARPreview = () => {
    setShowARPreview(true);
  };

  // Close the AR preview modal
  const closeARPreview = () => {
    setShowARPreview(false);
  };

  // Open the Animated preview modal
  const openAnimatedPreview = () => {
    setShowAnimatedPreview(true);
  };

  // Close the Animated preview modal
  const closeAnimatedPreview = () => {
    setShowAnimatedPreview(false);
  };

  // Calculate mat layers from outside to inside
  const getMatLayers = () => {
    const layers = [];
    let currentOffset = frameWidth;

    // Add stacked frame layer if enabled
    if (useStackedFrame && selectedStackedFrame) {
      layers.push({
        type: 'stackedFrame',
        color: selectedStackedFrame.color,
        offset: currentOffset,
        width: 8 // Thinner than main frame
      });
      currentOffset += 8;
    }

    // Bottom mat (outermost mat layer)
    if (useBottomMat && selectedBottomMat && selectedBottomMat.id !== 0) {
      layers.push({
        type: 'bottomMat',
        color: selectedBottomMat.color,
        offset: currentOffset,
        width: matWidth
      });
      currentOffset += matWidth;
    }

    // Middle mat
    if (useMiddleMat && selectedMiddleMat && selectedMiddleMat.id !== 0) {
      layers.push({
        type: 'middleMat',
        color: selectedMiddleMat.color,
        offset: currentOffset,
        width: matWidth
      });
      currentOffset += matWidth;
    }

    // Top mat (innermost mat layer) - only add if mat is selected and not "No Mat"
    if (selectedMat && selectedMat.id !== 0) {
      layers.push({
        type: 'topMat',
        color: selectedMat.color,
        offset: currentOffset,
        width: matWidth
      });
      currentOffset += matWidth;
    }

    return { layers, artworkOffset: currentOffset };
  };

  const { layers, artworkOffset } = getMatLayers();

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Card className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-lg">
        <CardContent className="p-8">
          <div className="relative mx-auto bg-white shadow-inner" style={{
            width: `${Math.min(displayWidth, 280)}px`,
            height: `${Math.min(displayHeight, 280)}px`,
            aspectRatio: aspectRatio
          }}>
            {/* Main Frame Border */}
            <div 
              className="absolute inset-0 shadow-lg border border-gray-300"
              style={{
                borderWidth: `${frameWidth}px`,
                borderColor: selectedFrame?.color || '#8B4513',
                borderStyle: 'solid',
                borderRadius: '2px',
                boxSizing: 'border-box'
              }}
            />

            {/* Render all layers from outside to inside */}
            {layers.map((layer, index) => (
              <div 
                key={`${layer.type}-${index}`}
                className={`absolute border ${layer.type === 'stackedFrame' ? 'shadow-md' : 'shadow-inner'}`}
                style={{
                  top: `${layer.offset}px`,
                  left: `${layer.offset}px`,
                  right: `${layer.offset}px`,
                  bottom: `${layer.offset}px`,
                  backgroundColor: layer.color,
                  borderRadius: '1px',
                  borderWidth: layer.type === 'stackedFrame' ? `${layer.width}px` : '1px',
                  borderColor: layer.type === 'stackedFrame' ? layer.color : '#e5e7eb',
                  borderStyle: 'solid',
                  boxSizing: 'border-box'
                }}
              />
            ))}

            {/* Artwork Area */}
            <div 
              className="absolute border border-gray-200 flex items-center justify-center overflow-hidden"
              style={{
                top: `${artworkOffset}px`,
                left: `${artworkOffset}px`,
                right: `${artworkOffset}px`,
                bottom: `${artworkOffset}px`,
                borderRadius: '1px'
              }}
            >
              {(uploadedImage || userImage) ? (
                <img 
                  src={(uploadedImage || userImage) as string} 
                  alt="Your artwork" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-xs text-gray-400 relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-8 h-8 mx-auto mb-1 bg-cyan-400 rounded flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-medium text-gray-600">Upload Image</p>
                  <p className="text-[10px]">{width}" × {height}"</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Glass overlay indicator */}
        {selectedGlass && (
          <div className="absolute top-4 left-4 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
            {selectedGlass.name}
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-md py-1 px-3 text-xs font-medium shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedFrame?.color || '#8B4513' }}></div>
            {selectedMat && selectedMat.id !== 0 && (
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedMat.color }}></div>
            )}
            <span>
              {selectedFrame?.name || 'Default'} frame
              {selectedMat && selectedMat.id !== 0 && `, ${selectedMat.name} mat`}
            </span>
          </div>
        </div>
      </Card>

      {/* Feature badges - moved to top of card, outside of frame display area */}
      <div className="absolute -top-3 right-0">
        <span className="bg-primary text-white text-xs font-bold py-1 px-3 rounded-full flex items-center shadow-md">
          <Sparkles className="h-3 w-3 mr-1" />
          New: Interactive Preview!
        </span>
      </div>
    </div>
  );
};

export default DynamicFramePreview;