import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  RotateCw,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Move,
  Camera,
  Upload,
  Trash2,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FrameOption, MatOption, GlassOption } from "@/types";

interface AugmentedRealityFrameFitterProps {
  width: number;
  height: number;
  selectedFrame: FrameOption;
  selectedMat: MatOption;
  selectedGlass: GlassOption;
  activeTab: string;
  isFullscreen?: boolean;
  showAdvancedControls?: boolean;
}

export const AugmentedRealityFrameFitter = ({
  width,
  height,
  selectedFrame,
  selectedMat,
  selectedGlass,
  activeTab,
  isFullscreen = false,
  showAdvancedControls = false
}: AugmentedRealityFrameFitterProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [frameOpacity, setFrameOpacity] = useState<number>(100);
  const [frameScale, setFrameScale] = useState<number>(100);
  const [frameRotation, setFrameRotation] = useState<number>(0);
  const [framePosition, setFramePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [videoConstraints, setVideoConstraints] = useState<MediaTrackConstraints>({ 
    facingMode: "environment", 
    width: { ideal: 1920 }, 
    height: { ideal: 1080 } 
  });
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [hasPlacedFrame, setHasPlacedFrame] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  // Handle camera initialization
  useEffect(() => {
    let videoStream: MediaStream | null = null;
    
    const initCamera = async () => {
      if (activeTab === "camera" && videoRef.current && !capturedPhoto) {
        try {
          setIsLoadingCamera(true);
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: videoConstraints,
            audio: false
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoStream = stream;
            setIsCapturing(true);
          }
          setIsLoadingCamera(false);
        } catch (err) {
          console.error("Error accessing camera:", err);
          setIsCapturing(false);
          setIsLoadingCamera(false);
          toast({
            title: "Camera Error",
            description: "Could not access your camera. Please check permissions.",
            variant: "destructive",
          });
        }
      }
    };
    
    initCamera();
    
    // Cleanup function
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab, videoConstraints, capturedPhoto, toast]);
  
  // Handle file selection for upload tab
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
        setCapturedPhoto(null); // Clear any captured photo
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset the frame position and scale
  const resetFramePosition = () => {
    setFramePosition({ x: 0, y: 0 });
    setFrameScale(100);
    setFrameRotation(0);
    setFrameOpacity(100);
  };
  
  // Switch camera (front/back)
  const switchCamera = () => {
    setVideoConstraints(prev => ({
      ...prev,
      facingMode: prev.facingMode === "environment" ? "user" : "environment"
    }));
    
    // Stop current video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  // Handle frame placement via click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCapturing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);
    
    setFramePosition({ x, y });
    setHasPlacedFrame(true);
  };
  
  // Start dragging the frame
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasPlacedFrame) return;
    
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - framePosition.x, 
      y: e.clientY - framePosition.y 
    });
  };
  
  // Handle mouse movement while dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    setFramePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  // End dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!hasPlacedFrame || e.touches.length !== 1) return;
    
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ 
      x: touch.clientX - framePosition.x, 
      y: touch.clientY - framePosition.y 
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    setFramePosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Capture a still photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current || !photoCanvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = photoCanvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL and set as captured photo
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(dataUrl);
      
      // Stop the video stream
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        setIsCapturing(false);
      }
      
      toast({
        title: "Photo Captured",
        description: "You can now place your frame on the image",
      });
    }
  };
  
  // Resume live camera after capturing a photo
  const resumeCamera = () => {
    setCapturedPhoto(null);
  };
  
  // Calculate frame styles based on selected options
  const getFrameStyle = useCallback(() => {
    const borderWidth = Math.max(Math.min(width, height) * 0.06, 15); // Proportional border width
    const matWidth = Math.max(Math.min(width, height) * 0.04, 10); // Proportional mat width
    
    const aspectRatio = width / height;
    
    return {
      border: `${borderWidth}px solid ${selectedFrame.color}`,
      boxShadow: `0 0 0 ${matWidth}px ${selectedMat.color}`,
      opacity: frameOpacity / 100,
      transform: `translate(-50%, -50%) translate(${framePosition.x}px, ${framePosition.y}px) scale(${frameScale / 100}) rotate(${frameRotation}deg)`,
      transition: isDragging ? 'none' : 'transform 0.2s ease',
      cursor: isDragging ? 'grabbing' : 'grab',
      left: '50%',
      top: '50%',
      position: 'absolute' as const,
      backgroundColor: 'white',
      maxWidth: '60%',
      maxHeight: '60%',
      width: aspectRatio > 1 ? '300px' : 'auto',
      height: aspectRatio > 1 ? 'auto' : '300px',
      aspectRatio: `${width} / ${height}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    };
  }, [width, height, selectedFrame, selectedMat, frameOpacity, framePosition, frameScale, frameRotation, isDragging]);
  
  return (
    <div className="relative">
      {/* Photo Canvas (hidden, used for photo capture) */}
      <canvas ref={photoCanvasRef} className="hidden" />
      
      {/* AR container */}
      <div 
        ref={containerRef}
        className="relative w-full bg-black cursor-pointer"
        style={{ height: isFullscreen ? 'calc(100vh - 60px)' : '500px' }}
        onClick={!hasPlacedFrame ? handleCanvasClick : undefined}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Camera View */}
        {activeTab === "camera" && !capturedPhoto && (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {isLoadingCamera && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            )}
          </>
        )}
        
        {/* Captured Photo View */}
        {activeTab === "camera" && capturedPhoto && (
          <img 
            src={capturedPhoto}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Uploaded Image View */}
        {activeTab === "upload" && userImage && (
          <img 
            src={userImage}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Upload Placeholder */}
        {activeTab === "upload" && !userImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="outline" 
              className="mb-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Upload a photo of your wall or artwork to see how it looks with different frames
            </p>
          </div>
        )}
        
        {/* Frame Overlay */}
        {(hasPlacedFrame || userImage || capturedPhoto) && (
          <div 
            style={getFrameStyle()}
            className="empty-frame"
          ></div>
        )}
        
        {/* Camera Controls Overlay */}
        {activeTab === "camera" && !capturedPhoto && (
          <div className="absolute bottom-4 right-4 left-4 flex justify-center">
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full bg-white text-black hover:bg-white/90 shadow-lg"
              onClick={capturePhoto}
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        )}
        
        {/* Photo Controls */}
        {activeTab === "camera" && capturedPhoto && (
          <div className="absolute bottom-4 right-4 left-4 flex justify-center space-x-4">
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              onClick={resumeCamera}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Retake
            </Button>
            
            <Button
              variant="default"
              size="sm"
              className="rounded-full" 
              onClick={() => {
                toast({
                  title: "Frame Saved",
                  description: "Your frame preview has been saved",
                });
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Use This Frame
            </Button>
          </div>
        )}
      </div>
      
      {/* Advanced Controls Panel */}
      {showAdvancedControls && (
        <div className="p-4 bg-card border rounded-b-lg shadow-md">
          <div className="space-y-4">
            {/* Scale Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Frame Size</label>
                <span className="text-xs text-muted-foreground">{frameScale}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  min={50}
                  max={150}
                  step={1}
                  value={[frameScale]}
                  onValueChange={([value]) => setFrameScale(value)}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            {/* Opacity Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Frame Opacity</label>
                <span className="text-xs text-muted-foreground">{frameOpacity}%</span>
              </div>
              <Slider
                min={20}
                max={100}
                step={1}
                value={[frameOpacity]}
                onValueChange={([value]) => setFrameOpacity(value)}
              />
            </div>
            
            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Frame Rotation</label>
                <span className="text-xs text-muted-foreground">{frameRotation}°</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCw className="h-4 w-4 text-muted-foreground" />
                <Slider
                  min={-180}
                  max={180}
                  step={1}
                  value={[frameRotation]}
                  onValueChange={([value]) => setFrameRotation(value)}
                  className="flex-1"
                />
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={resetFramePosition}
              >
                <Move className="h-4 w-4 mr-2" />
                Reset Position
              </Button>
              
              {activeTab === "camera" && !capturedPhoto && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={switchCamera}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Switch Camera
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};