import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, RotateCw } from "lucide-react";
import { FrameOption, MatOption, GlassOption } from "@/types";
import { AugmentedRealityPreview } from "./augmented-reality-preview";

interface DynamicFramePreviewProps {
  width: number;
  height: number;
  selectedFrame: FrameOption | null;
  selectedMat: MatOption | null;
  selectedGlass: GlassOption | null;
}

export const DynamicFramePreview = ({
  width,
  height,
  selectedFrame,
  selectedMat,
  selectedGlass
}: DynamicFramePreviewProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [showARPreview, setShowARPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file upload for the image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset and clear the current image
  const resetImage = () => {
    setUserImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Calculate the frame style based on selected options
  const getFrameStyle = useCallback(() => {
    if (!selectedFrame || !selectedMat) return {};
    
    return {
      border: userImage ? '5px solid transparent' : '15px solid transparent',
      boxShadow: userImage 
        ? `0 0 0 20px ${selectedMat.color}, 0 0 0 30px ${selectedFrame.color}`
        : `0 0 0 30px ${selectedMat.color}, 0 0 0 40px ${selectedFrame.color}`,
      borderRadius: '0', // Sharp square corners
      transition: 'all 0.3s ease-in-out',
      backgroundColor: 'transparent' // Make sure the background is transparent
    };
  }, [selectedFrame, selectedMat, userImage]);
  
  // Open the AR preview modal
  const openARPreview = () => {
    setShowARPreview(true);
  };
  
  // Close the AR preview modal
  const closeARPreview = () => {
    setShowARPreview(false);
  };
  
  return (
    <div className="relative">
      {/* Image Preview */}
      <div className="bg-white p-6 shadow-highlight rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/50 to-transparent z-0"></div>
        <div className="relative z-10">
          <div className="h-[400px] flex items-center justify-center py-10">
            {userImage ? (
              <img
                src={userImage}
                alt="Your artwork"
                className="max-h-full shadow-xl object-contain"
                style={getFrameStyle()}
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Sample artwork"
                className="max-h-full shadow-xl object-contain"
                style={getFrameStyle()}
              />
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
        
        {selectedFrame && selectedMat && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-md py-1 px-3 text-xs font-medium shadow-sm border border-neutral-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedFrame.color }}></div>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedMat.color }}></div>
              <span>{selectedFrame.name} frame, {selectedMat.name} mat</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Image Upload and Preview Controls */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Your Artwork
        </Button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*" 
          className="hidden"
        />
        
        {userImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetImage}
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={openARPreview}
          className="flex-1"
        >
          <Camera className="h-4 w-4 mr-2" />
          Try on Your Wall
        </Button>
      </div>
      
      {/* AR Preview Modal */}
      {showARPreview && (
        <AugmentedRealityPreview
          width={width}
          height={height}
          selectedFrame={selectedFrame}
          selectedMat={selectedMat}
          selectedGlass={selectedGlass}
          onClose={closeARPreview}
        />
      )}
    </div>
  );
};