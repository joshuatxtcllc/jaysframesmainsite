import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PlayCircle, PauseCircle, RefreshCw, Sun, Moon, Sparkles, Image, Camera, ShoppingCart, X, Eye } from "lucide-react";
import { FrameOption, MatOption, GlassOption } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AnimatedFramePreviewProps {
  width: number;
  height: number;
  selectedFrame: FrameOption | null;
  selectedMat: MatOption | null;
  selectedGlass: GlassOption | null;
  onClose?: () => void;
  onAddToCart?: (frameStyle: any, matStyle: any) => void;
  topMatReveal?: number;
  middleMatReveal?: number;
  bottomMatReveal?: number;
  useMiddleMat?: boolean;
  useBottomMat?: boolean;
}

type RoomStyle = "modern" | "classic" | "minimalist" | "eclectic" | "natural";
type LightingCondition = "day" | "evening" | "night" | "spotlight";
type AnimationEffect = "room" | "lighting" | "styles" | "reflections";

export const AnimatedFramePreview = ({
  width,
  height,
  selectedFrame,
  selectedMat,
  selectedGlass,
  onClose,
  onAddToCart,
  topMatReveal,
  middleMatReveal,
  bottomMatReveal,
  useMiddleMat,
  useBottomMat
}: AnimatedFramePreviewProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [currentAnimation, setCurrentAnimation] = useState<AnimationEffect | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [roomStyle, setRoomStyle] = useState<RoomStyle>("modern");
  const [lighting, setLighting] = useState<LightingCondition>("day");
  const [frameOpacity, setFrameOpacity] = useState<number>(100);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [matIndex, setMatIndex] = useState<number>(0);
  const [highContrastMode, setHighContrastMode] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Calculate total price for display in footer
  const calculateTotalPrice = () => {
    const framePrice = frameStyles[frameIndex].price;
    const matPrice = matStyles[matIndex].price;
    const glassPrice = selectedGlass?.price || 0;
    
    return (framePrice + matPrice + glassPrice).toFixed(2);
  };
  
  // Get database frames and mats
  const [databaseFrames, setDatabaseFrames] = useState<FrameOption[]>([]);
  const [databaseMats, setDatabaseMats] = useState<MatOption[]>([]);
  
  // Fetch frame and mat options from database
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch frame options
        const frameResponse = await fetch('/api/frame-options');
        const frameData = await frameResponse.json();
        setDatabaseFrames(frameData);
        
        // Fetch mat options
        const matResponse = await fetch('/api/mat-options');
        const matData = await matResponse.json();
        setDatabaseMats(matData);
      } catch (error) {
        console.error('Error fetching frame/mat options:', error);
      }
    };
    
    fetchOptions();
  }, []);
  
  // Frame styles for selection and animation - use database options if available
  const frameStyles = databaseFrames.length > 0 ? 
    databaseFrames.map(frame => ({ 
      color: frame.color, 
      width: 25, 
      name: frame.name, 
      material: frame.material, 
      price: frame.pricePerInch * (width + height) * 2 / 100
    })) : 
    [
      { color: selectedFrame?.color || "#8B4513", width: 25, name: selectedFrame?.name || "Classic Walnut", material: selectedFrame?.material || "Solid Wood", price: 89.99 },
      { color: "#000000", width: 30, name: "Modern Black", material: "Metal Finish", price: 99.99 },
      { color: "#D4AF37", width: 20, name: "Gold Leaf", material: "Wood with Gold Leaf", price: 129.99 },
      { color: "#FFFFFF", width: 25, name: "Clean White", material: "Painted Wood", price: 79.99 },
      { color: "#4B3621", width: 22, name: "Dark Oak", material: "Solid Hardwood", price: 109.99 }
    ];
  
  // Mat styles for selection and animation - use database options if available
  const matStyles = databaseMats.length > 0 ?
    databaseMats.map(mat => ({
      color: mat.color,
      width: 20,
      name: mat.name,
      texture: "Smooth",
      finish: "Matte",
      price: mat.price / 100
    })) :
    [
      { color: selectedMat?.color || "#F5F5F5", width: 20, name: selectedMat?.name || "Classic White", texture: "Smooth", finish: "Matte", price: 29.99 },
      { color: "#E0E0E0", width: 25, name: "Light Gray", texture: "Textured", finish: "Matte", price: 34.99 },
      { color: "#D3D3D3", width: 15, name: "Silver Gray", texture: "Linen", finish: "Metallic", price: 39.99 },
      { color: "#F0F8FF", width: 20, name: "Ice Blue", texture: "Smooth", finish: "Satin", price: 32.99 },
      { color: "#FFF8DC", width: 18, name: "Cream", texture: "Suede", finish: "Matte", price: 34.99 }
    ];
  
  // Room background colors based on style
  const roomStyleColors: Record<RoomStyle, { wall: string, shadow: string }> = {
    modern: { wall: "#F5F5F5", shadow: "rgba(0, 0, 0, 0.1)" },
    classic: { wall: "#F8F4E9", shadow: "rgba(139, 69, 19, 0.1)" },
    minimalist: { wall: "#FFFFFF", shadow: "rgba(0, 0, 0, 0.05)" },
    eclectic: { wall: "#F0F0F0", shadow: "rgba(70, 130, 180, 0.1)" },
    natural: { wall: "#F5F2E9", shadow: "rgba(139, 69, 19, 0.15)" }
  };
  
  // Lighting conditions
  const lightingConditions: Record<LightingCondition, { 
    ambient: string, 
    shadow: string, 
    intensity: number,
    highlight: string
  }> = {
    day: { 
      ambient: "rgba(255, 255, 255, 0.8)", 
      shadow: "rgba(0, 0, 0, 0.1)",
      intensity: 0.8,
      highlight: "rgba(255, 255, 255, 0.5)"
    },
    evening: { 
      ambient: "rgba(255, 215, 125, 0.6)", 
      shadow: "rgba(0, 0, 0, 0.2)",
      intensity: 0.6,
      highlight: "rgba(255, 200, 100, 0.4)"
    },
    night: { 
      ambient: "rgba(100, 120, 180, 0.4)", 
      shadow: "rgba(0, 0, 0, 0.35)",
      intensity: 0.4,
      highlight: "rgba(150, 170, 220, 0.25)"
    },
    spotlight: { 
      ambient: "rgba(255, 255, 255, 0.3)", 
      shadow: "rgba(0, 0, 0, 0.5)",
      intensity: 1.0,
      highlight: "rgba(255, 255, 255, 0.8)"
    }
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
        setActiveTab("preview");
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset the preview
  const resetPreview = () => {
    setUserImage(null);
    stopAnimation();
    setCurrentAnimation(null);
    setRoomStyle("modern");
    setLighting("day");
    setFrameOpacity(100);
    setFrameIndex(0);
    setMatIndex(0);
    setHighContrastMode(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Start animation loop
  const startAnimation = (type: AnimationEffect) => {
    stopAnimation(); // Stop any existing animation
    setCurrentAnimation(type);
    setIsAnimating(true);
    
    // Cycle based on chosen animation type
    let lastTimestamp = 0;
    const frameDelay = 2000 - (animationSpeed * 15); // Convert 1-100 speed to ms delay between frames
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed > frameDelay) {
        lastTimestamp = timestamp;
        
        // Update based on animation type
        if (type === "room") {
          // Cycle through room styles
          setRoomStyle(prev => {
            const styles: RoomStyle[] = ["modern", "classic", "minimalist", "eclectic", "natural"];
            const currentIndex = styles.indexOf(prev);
            return styles[(currentIndex + 1) % styles.length];
          });
        } 
        else if (type === "lighting") {
          // Cycle through lighting conditions
          setLighting(prev => {
            const conditions: LightingCondition[] = ["day", "evening", "night", "spotlight"];
            const currentIndex = conditions.indexOf(prev);
            return conditions[(currentIndex + 1) % conditions.length];
          });
        }
        else if (type === "styles") {
          // Cycle through frame and mat combinations
          setFrameIndex(prev => (prev + 1) % frameStyles.length);
          setMatIndex(prev => (prev + 1) % matStyles.length);
        }
      }
      
      // Continue animation loop
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Animation Started`,
      description: `Showing how your frame looks with different ${type}.`,
      duration: 3000
    });
  };
  
  // Stop animation loop
  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Toggle animation on/off
  const toggleAnimation = (type: AnimationEffect) => {
    if (isAnimating && currentAnimation === type) {
      stopAnimation();
    } else {
      startAnimation(type);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(frameStyles[frameIndex], matStyles[matIndex]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${frameStyles[frameIndex].name} frame with ${matStyles[matIndex].name} mat added to your cart.`,
      duration: 3000
    });
    
    if (onClose) {
      onClose();
    }
  };
  
  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (onAddToCart) {
      onAddToCart(frameStyles[frameIndex], matStyles[matIndex]);
    }
    
    toast({
      title: "Proceeding to Checkout",
      description: "Your frame selection has been added to cart.",
      duration: 3000
    });
    
    // Redirect to checkout page
    window.location.href = '/checkout';
  };
  
  // Draw the frame to canvas for reflections and effects
  useEffect(() => {
    if (!previewCanvasRef.current) return;
    
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const drawFrame = () => {
      // Set canvas dimensions based on aspect ratio
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Get lighting config reference for reuse
      const lightingConfig = lightingConditions[lighting];
      
      // Calculate frame position and size
      const frameWidth = canvasWidth * 0.8;
      const frameHeight = frameWidth * (height / width);
      const frameX = (canvasWidth - frameWidth) / 2;
      const frameY = (canvasHeight - frameHeight) / 2;
      
      // Draw room background (using high contrast if enabled)
      if (highContrastMode) {
        // High contrast background is always solid black or white
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      } else {
        // Normal mode - use standard room style colors
        ctx.fillStyle = roomStyleColors[roomStyle].wall;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw ambient lighting effect (skip in high contrast mode)
        ctx.fillStyle = lightingConfig.ambient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        if (lighting === "spotlight") {
          // Add spotlight gradient
          const gradient = ctx.createRadialGradient(
            canvasWidth / 2, canvasHeight / 2, 10,
            canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.7
          );
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
      }
      
      // Get current frame and mat style (either selected or from animation cycle)
      let frameStyle = { 
        color: frameStyles[frameIndex].color, 
        width: frameStyles[frameIndex].width 
      };
      
      let matStyle = { 
        color: matStyles[matIndex].color, 
        width: matStyles[matIndex].width 
      };
      
      // If we're in the "styles" animation, cycle through frame styles
      if (currentAnimation === "styles") {
        frameStyle = frameStyles[frameIndex];
        matStyle = matStyles[matIndex];
      }
      
      // Apply high contrast colors if enabled
      if (highContrastMode) {
        // In high contrast mode, use white frame and gray mat on black background
        frameStyle = { 
          ...frameStyle,
          color: "#FFFFFF"  // Use white for frame in high contrast mode
        };
        
        matStyle = {
          ...matStyle,
          color: "#AAAAAA"  // Use gray for mat in high contrast mode
        };
      }
      
      // Draw shadow (only in normal mode)
      if (!highContrastMode) {
        ctx.shadowColor = lightingConditions[lighting].shadow;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
      } else {
        // No shadows in high contrast mode
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      
      // Draw outer frame
      ctx.fillStyle = frameStyle.color;
      ctx.fillRect(
        frameX - frameStyle.width, 
        frameY - frameStyle.width, 
        frameWidth + (frameStyle.width * 2), 
        frameHeight + (frameStyle.width * 2)
      );
      
      // Reset shadow for mat
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw mats (multiple if enabled)
      const calculateRevealPixels = (revealId: number | undefined) => {
        // Default to a small reveal (about 1/8")
        if (!revealId) return Math.max(3, frameWidth * 0.005);
        
        // Calculate pixels based on reveal size (1/8" to 1" = approximately 3px to 24px)
        // Using reveal ID as a scale from 1-8 (assuming 8 reveal size options)
        return Math.max(3, Math.min(24, revealId * 3));
      };
      
      // Bottom mat (if enabled)
      if (useBottomMat) {
        // Use third mat color if available
        ctx.fillStyle = matStyles.length > 2 ? matStyles[2].color : "#F0F0F0";
        ctx.fillRect(
          frameX, 
          frameY, 
          frameWidth, 
          frameHeight
        );
      }
      
      // Middle mat (if enabled) - smaller than bottom mat with reveal
      if (useMiddleMat) {
        // Calculate reveal size for middle mat
        const middleRevealSize = calculateRevealPixels(middleMatReveal);
        
        // Use second mat color if available
        ctx.fillStyle = matStyles.length > 1 ? matStyles[1].color : "#E0E0E0";
        ctx.fillRect(
          frameX + middleRevealSize, 
          frameY + middleRevealSize, 
          frameWidth - (middleRevealSize * 2), 
          frameHeight - (middleRevealSize * 2)
        );
      }
      
      // Top mat - smaller than middle mat with reveal
      const topRevealSize = calculateRevealPixels(topMatReveal);
      const topMatOffsetX = useMiddleMat ? frameX + topRevealSize : frameX;
      const topMatOffsetY = useMiddleMat ? frameY + topRevealSize : frameY;
      const topMatWidth = useMiddleMat ? frameWidth - (topRevealSize * 2) : frameWidth;
      const topMatHeight = useMiddleMat ? frameHeight - (topRevealSize * 2) : frameHeight;
      
      ctx.fillStyle = matStyle.color;
      ctx.fillRect(
        topMatOffsetX,
        topMatOffsetY,
        topMatWidth,
        topMatHeight
      );
      
      // Draw artwork placeholder or actual artwork
      if (userImage) {
        const img = document.createElement('img');
        img.onload = () => {
          // Calculate scaling to fit the artwork within the mat
          const artworkPadding = Math.min(frameWidth, frameHeight) * 0.05;
          const artworkWidth = frameWidth - (artworkPadding * 2);
          const artworkHeight = frameHeight - (artworkPadding * 2);
          
          ctx.drawImage(
            img, 
            frameX + artworkPadding, 
            frameY + artworkPadding, 
            artworkWidth, 
            artworkHeight
          );
          
          // Add glass reflection effect if we have glass selected
          if (selectedGlass) {
            // Skip glass effects in high contrast mode
            if (!highContrastMode) {
              // Create gradient for glass reflection
              const glassGradient = ctx.createLinearGradient(
                frameX, frameY, 
                frameX + frameWidth, frameY + frameHeight
              );
              
              const lightingConfig = lightingConditions[lighting];
              const glassOpacity = 0.15 * lightingConfig.intensity;
              
              glassGradient.addColorStop(0, `rgba(255, 255, 255, ${glassOpacity})`);
              glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
              glassGradient.addColorStop(1, `rgba(255, 255, 255, ${glassOpacity / 2})`);
              
              ctx.fillStyle = glassGradient;
              ctx.fillRect(
                frameX + artworkPadding, 
                frameY + artworkPadding, 
                artworkWidth, 
                artworkHeight
              );
              
              // Add highlight/glare based on lighting
              if (lighting === "spotlight" || lighting === "day") {
                ctx.fillStyle = lightingConfig.highlight;
                ctx.beginPath();
                ctx.ellipse(
                  frameX + frameWidth * 0.3, 
                  frameY + frameHeight * 0.3,
                  artworkWidth * 0.1,
                  artworkHeight * 0.05,
                  Math.PI / 4,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            }
          }
        };
        img.src = userImage;
      } else {
        // Draw placeholder
        ctx.fillStyle = "#EFEFEF";
        ctx.fillRect(
          frameX + 10, 
          frameY + 10, 
          frameWidth - 20, 
          frameHeight - 20
        );
        
        // Add text
        ctx.fillStyle = "#999";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "Your artwork here", 
          frameX + (frameWidth / 2), 
          frameY + (frameHeight / 2)
        );
      }
    };
    
    drawFrame();
  }, [userImage, selectedFrame, selectedMat, selectedGlass, roomStyle, lighting, frameIndex, matIndex, currentAnimation, height, width, highContrastMode, topMatReveal, middleMatReveal, bottomMatReveal, useMiddleMat, useBottomMat]);
  
  // Get the preview canvas size
  const getCanvasSize = useCallback(() => {
    return {
      width: 600,
      height: 400
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto flex flex-col relative">
        <div className="sticky top-0 bg-white z-10 flex flex-row justify-between items-center p-3 sm:p-4 border-b">
          <h3 className="text-base sm:text-lg font-bold">Interactive AI Preview</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full hover:bg-neutral-100"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-2">
            <TabsTrigger value="upload">Upload Artwork</TabsTrigger>
            <TabsTrigger value="preview">Frame Preview</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 p-4 flex flex-col">
            {/* Upload Tab */}
            <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="mb-6">
                  <div className="bg-neutral-100 rounded-full p-3 inline-block mb-4">
                    <Upload className="h-8 w-8 text-neutral-500" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Upload Your Artwork</h4>
                  <p className="text-neutral-500 max-w-md mx-auto mb-6">
                    Upload your artwork to see how it will look in different frames, lighting conditions, and room styles.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mx-auto"
                    variant="default"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Select Image
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("preview")}
                    className="mx-auto"
                    variant="outline"
                  >
                    Skip (Use Placeholder)
                  </Button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*" 
                  className="hidden"
                />
              </div>
            </TabsContent>
            
            {/* Preview Tab */}
            <TabsContent value="preview" className="flex-1 flex flex-col">
              <div className="mb-4 flex justify-between">
                <h4 className="text-base font-medium">Frame Preview Animation</h4>
              </div>
              
              <div className="relative bg-neutral-100 rounded-lg overflow-hidden flex-1 flex items-center justify-center">
                {/* Canvas for rendering frame preview with effects */}
                <canvas
                  ref={previewCanvasRef}
                  width={getCanvasSize().width}
                  height={getCanvasSize().height}
                  className="max-w-full max-h-full"
                />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                  </div>
                )}
                
                {/* Animation Controls */}
                <div className="absolute bottom-3 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm p-1 sm:p-2 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 p-1">
                    <Button 
                      size="sm" 
                      variant={currentAnimation === "room" && isAnimating ? "default" : "outline"}
                      className="flex-1 text-[10px] sm:text-xs h-8 px-1 sm:px-2"
                      onClick={() => toggleAnimation("room")}
                    >
                      {currentAnimation === "room" && isAnimating ? (
                        <PauseCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      ) : (
                        <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      <span className="hidden xs:inline">Room</span> Styles
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant={currentAnimation === "lighting" && isAnimating ? "default" : "outline"}
                      className="flex-1 text-[10px] sm:text-xs h-8 px-1 sm:px-2"
                      onClick={() => toggleAnimation("lighting")}
                    >
                      {currentAnimation === "lighting" && isAnimating ? (
                        <PauseCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      ) : (
                        <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      Lighting
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant={currentAnimation === "styles" && isAnimating ? "default" : "outline"}
                      className="flex-1 text-[10px] sm:text-xs h-8 px-1 sm:px-2"
                      onClick={() => toggleAnimation("styles")}
                    >
                      {currentAnimation === "styles" && isAnimating ? (
                        <PauseCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      ) : (
                        <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      <span className="hidden xs:inline">Frame</span> Styles
                    </Button>
                  </div>
                  
                  {/* Accessibility toggle - moved to animation controls bar for better visibility */}
                  <div className="mt-1 flex items-center justify-between px-1">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
                      <span className="text-[10px] sm:text-xs">High Contrast</span>
                    </div>
                    <Button
                      size="sm"
                      variant={highContrastMode ? "default" : "outline"}
                      className="h-6 text-[10px] min-w-[60px] px-2"
                      onClick={() => {
                        const newMode = !highContrastMode;
                        setHighContrastMode(newMode);
                        toast({
                          title: `High Contrast Mode ${newMode ? 'Enabled' : 'Disabled'}`,
                          description: newMode 
                            ? "Enhanced visibility mode for improved accessibility is now active." 
                            : "Returned to standard display mode.",
                          duration: 3000
                        });
                      }}
                    >
                      {highContrastMode ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Frame Selection */}
              <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">Frame Selection</label>
                    <span className="text-xs text-neutral-500">
                      Choose a custom frame
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
                    {frameStyles.map((style, index) => (
                      <div key={index} className="flex flex-col">
                        <button
                          className={`h-10 rounded-md transition-all ${frameIndex === index ? 'ring-2 ring-primary scale-105 sm:scale-110' : 'hover:scale-105'}`}
                          style={{ 
                            backgroundColor: style.color,
                            boxShadow: `inset 0 0 0 2px white, 0 2px 4px rgba(0,0,0,0.1)`
                          }}
                          onClick={() => setFrameIndex(index)}
                          aria-label={`Frame style: ${style.name}`}
                          title={`${style.name} - ${style.material} - $${style.price.toFixed(2)}`}
                        />
                        {frameIndex === index && (
                          <div className="mt-1 text-xs text-center leading-tight">
                            <div className="font-medium">{style.name}</div>
                            <div className="text-neutral-500 text-[10px] sm:text-xs">{style.material}</div>
                            <div className="text-primary font-medium">${style.price.toFixed(2)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">Mat Selection</label>
                    <span className="text-xs text-neutral-500">
                      Choose a mat color and texture
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {matStyles.map((style, index) => (
                      <div key={index} className="flex flex-col">
                        <button
                          className={`h-8 rounded-md transition-all ${matIndex === index ? 'ring-2 ring-primary scale-105 sm:scale-110' : 'hover:opacity-80'}`}
                          style={{ 
                            backgroundColor: style.color,
                            border: "1px solid rgba(0,0,0,0.1)"
                          }}
                          onClick={() => setMatIndex(index)}
                          aria-label={`Mat style: ${style.name}`}
                          title={`${style.name} - ${style.texture} - ${style.finish} - $${style.price.toFixed(2)}`}
                        />
                        {matIndex === index && (
                          <div className="mt-1 text-xs text-center leading-tight">
                            <div className="font-medium">{style.name}</div>
                            <div className="text-neutral-500 text-[10px] sm:text-xs">{style.texture}, {style.finish}</div>
                            <div className="text-primary font-medium">${style.price.toFixed(2)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-center text-neutral-500">
                    Selected: <span className="font-medium text-primary">{frameStyles[frameIndex].name}</span> frame with <span className="font-medium text-primary">{matStyles[matIndex].name}</span> mat
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium">Animation Speed</label>
                      <span className="text-xs text-neutral-500">{animationSpeed}%</span>
                    </div>
                    <Slider
                      value={[animationSpeed]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(values) => setAnimationSpeed(values[0])}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium">Manual Controls</label>
                      <span className="text-xs text-neutral-500">
                        {roomStyle} / {lighting}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="flex-1 text-xs"
                          onClick={() => setRoomStyle("modern")}
                        >
                          Modern
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="flex-1 text-xs"
                          onClick={() => setRoomStyle("classic")}
                        >
                          Classic
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="flex-1 text-xs p-0"
                          onClick={() => setLighting("day")}
                        >
                          <Sun className="h-3 w-3 mr-1" />
                          Day
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="flex-1 text-xs p-0"
                          onClick={() => setLighting("night")}
                        >
                          <Moon className="h-3 w-3 mr-1" />
                          Night
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
{/* Accessibility Controls section moved to animation controls bar for better mobile visibility */}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="sticky bottom-0 p-3 sm:p-4 border-t bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={resetPreview} className="text-xs sm:text-sm">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Reset
            </Button>
            
            <div className="sm:hidden bg-neutral-100 px-2 py-1 rounded-md">
              <span className="text-xs font-medium">Total: </span>
              <span className="text-primary font-bold">${calculateTotalPrice()}</span>
            </div>
          </div>
          
          <div className="hidden sm:block text-right">
            <div className="mb-2 text-sm">
              <div className="flex justify-end items-center gap-2 mb-1">
                <span className="text-neutral-600">Selected Frame:</span> 
                <span className="font-medium text-primary">{frameStyles[frameIndex].name}</span>
                <span className="text-xs text-neutral-500">(${frameStyles[frameIndex].price.toFixed(2)})</span>
              </div>
              <div className="flex justify-end items-center gap-2 mb-1">
                <span className="text-neutral-600">Selected Mat:</span> 
                <span className="font-medium text-primary">{matStyles[matIndex].name}</span>
                <span className="text-xs text-neutral-500">(${matStyles[matIndex].price.toFixed(2)})</span>
              </div>
              <div className="flex justify-end items-center gap-2">
                <span className="text-neutral-600 font-medium">Total:</span> 
                <span className="font-bold text-lg text-primary">${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={handleAddToCart}
              className="text-xs sm:text-sm text-white"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add to Cart
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={handleProceedToCheckout}
              className="text-xs sm:text-sm text-white bg-green-600 hover:bg-green-700"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};