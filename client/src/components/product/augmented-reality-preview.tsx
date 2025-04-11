import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, RefreshCw, X, Maximize2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { FrameOption, MatOption, GlassOption } from "@/types";

interface AugmentedRealityPreviewProps {
  width: number;
  height: number;
  selectedFrame: FrameOption | null;
  selectedMat: MatOption | null;
  selectedGlass: GlassOption | null;
  onClose?: () => void;
}

export const AugmentedRealityPreview = ({
  width,
  height,
  selectedFrame,
  selectedMat,
  selectedGlass,
  onClose
}: AugmentedRealityPreviewProps) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isCapturingVideo, setIsCapturingVideo] = useState<boolean>(false);
  const [frameOpacity, setFrameOpacity] = useState<number>(100);
  const [frameScale, setFrameScale] = useState<number>(100);
  const [framePosition, setFramePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Set up the video stream when in camera mode
  useEffect(() => {
    let videoStream: MediaStream | null = null;
    
    if (isCapturingVideo && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoStream = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          setIsCapturingVideo(false);
        });
    }
    
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCapturingVideo]);
  
  // Handle file upload for the image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Start camera capture
  const startCamera = () => {
    setIsCapturingVideo(true);
    setActiveTab("camera");
  };
  
  // Stop camera capture
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturingVideo(false);
  };
  
  // Take a snapshot from the camera feed
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setUserImage(imageDataUrl);
        stopCamera();
        setActiveTab("preview");
      }
    }
  };
  
  // Reset and clear the current image
  const resetImage = () => {
    setUserImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFramePosition({ x: 0, y: 0 });
    setFrameScale(100);
    setFrameOpacity(100);
  };
  
  // Mouse/touch event handlers for frame dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    setDragStart({
      x: clientX - framePosition.x,
      y: clientY - framePosition.y
    });
  };
  
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
      e.preventDefault(); // Prevent text selection during drag
    }
    
    setFramePosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Frame styling based on selected options
  const getFrameStyle = () => {
    if (!selectedFrame || !selectedMat) return {};
    
    const borderWidth = Math.max(Math.min(width, height) * 0.06, 15); // Proportional border width
    const matWidth = Math.max(Math.min(width, height) * 0.04, 10); // Proportional mat width
    
    return {
      border: `${borderWidth}px solid ${selectedFrame.color}`,
      boxShadow: `0 0 0 ${matWidth}px ${selectedMat.color}`,
      opacity: frameOpacity / 100,
      transform: `scale(${frameScale / 100})`,
      left: `${framePosition.x}px`,
      top: `${framePosition.y}px`,
      position: 'absolute' as const,
      transition: isDragging ? 'none' : 'transform 0.2s ease',
      cursor: 'move',
      maxWidth: '80%',
      maxHeight: '80%',
      aspectRatio: `${width} / ${height}`,
      zIndex: 10
    };
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Augmented Reality Frame Preview</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-3">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="camera" onClick={() => !isCapturingVideo && startCamera()}>
              Use Camera
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!userImage}>Preview</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 p-4 flex flex-col">
            <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="mb-6">
                  <div className="bg-neutral-100 rounded-full p-3 inline-block mb-4">
                    <Upload className="h-8 w-8 text-neutral-500" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Upload a Photo of Your Wall</h4>
                  <p className="text-neutral-500 max-w-md mx-auto mb-6">
                    Upload a photo of the wall where you'd like to hang your frame to see how it will look.
                  </p>
                </div>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mx-auto"
                >
                  Select Image
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*" 
                  className="hidden"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="camera" className="flex-1 flex flex-col">
              <div className="relative flex-1 bg-black rounded-md overflow-hidden">
                {isCapturingVideo && (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                      <Button 
                        className="rounded-full w-16 h-16 shadow-lg bg-white text-primary"
                        onClick={takeSnapshot}
                      >
                        <Camera className="h-6 w-6" />
                      </Button>
                    </div>
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 flex flex-col">
              {userImage ? (
                <div 
                  className="relative flex-1 bg-black rounded-md overflow-hidden"
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                >
                  <img 
                    src={userImage} 
                    alt="Wall" 
                    className="w-full h-full object-contain"
                  />
                  {selectedFrame && selectedMat && (
                    <div 
                      style={getFrameStyle()}
                    >
                      <div 
                        className="w-full h-full bg-transparent"
                      >
                        <div className="w-full h-full p-2 flex items-center justify-center">
                          <p className="text-center text-sm opacity-70">Your artwork here</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/80 backdrop-blur-sm"
                      onClick={resetImage}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" /> Reset
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-neutral-500">Please upload an image or take a photo first.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Controls Panel */}
        {userImage && activeTab === "preview" && (
          <div className="p-4 border-t bg-neutral-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Frame Opacity</label>
                <div className="flex items-center">
                  <span className="text-xs text-neutral-500 w-8">{frameOpacity}%</span>
                  <Slider
                    value={[frameOpacity]}
                    min={20}
                    max={100}
                    step={5}
                    onValueChange={(values) => setFrameOpacity(values[0])}
                    className="mx-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">Frame Size</label>
                <div className="flex items-center">
                  <span className="text-xs text-neutral-500 w-8">{frameScale}%</span>
                  <Slider
                    value={[frameScale]}
                    min={50}
                    max={150}
                    step={5}
                    onValueChange={(values) => setFrameScale(values[0])}
                    className="mx-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-neutral-500 mb-2">Tip: Drag the frame to position it on your wall</p>
            </div>
          </div>
        )}
        
        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" className="mr-2" onClick={onClose}>
            Close
          </Button>
          {userImage && activeTab === "preview" && (
            <Button>
              Add to Cart with This View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};