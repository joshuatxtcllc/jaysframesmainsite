import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PlayCircle, PauseCircle, RefreshCw, Sun, Moon, Sparkles, Image, Camera, ShoppingCart } from "lucide-react";
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
  onAddToCart
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Get total price of current selection
  const getTotalPrice = () => {
    const framePrice = frameStyles[frameIndex].price;
    const matPrice = matStyles[matIndex].price;
    const glassPrice = selectedGlass?.price || 0;
    
    return (framePrice + matPrice + glassPrice).toFixed(2);
  };
  
  // Frame styles for selection and animation
  const frameStyles = [
    { color: selectedFrame?.color || "#8B4513", width: 25, name: selectedFrame?.name || "Classic Walnut", material: selectedFrame?.material || "Solid Wood", price: 89.99 },
    { color: "#000000", width: 30, name: "Modern Black", material: "Metal Finish", price: 99.99 },
    { color: "#D4AF37", width: 20, name: "Gold Leaf", material: "Wood with Gold Leaf", price: 129.99 },
    { color: "#FFFFFF", width: 25, name: "Clean White", material: "Painted Wood", price: 79.99 },
    { color: "#4B3621", width: 22, name: "Dark Oak", material: "Solid Hardwood", price: 109.99 },
    { color: "#3A271A", width: 28, name: "Espresso", material: "Premium Hardwood", price: 119.99 },
    { color: "#AB9364", width: 24, name: "Champagne", material: "Metal with Satin Finish", price: 139.99 },
    { color: "#555555", width: 18, name: "Sleek Silver", material: "Brushed Aluminum", price: 99.99 },
    { color: "#D35400", width: 26, name: "Amber Wood", material: "Cherry Wood", price: 109.99 },
    { color: "#34495E", width: 22, name: "Navy Blue", material: "Painted Hardwood", price: 89.99 }
  ];
  
  // Mat styles for selection and animation
  const matStyles = [
    { color: selectedMat?.color || "#F5F5F5", width: 20, name: selectedMat?.name || "Classic White", texture: "Smooth", finish: "Matte", price: 29.99 },
    { color: "#E0E0E0", width: 25, name: "Light Gray", texture: "Textured", finish: "Matte", price: 34.99 },
    { color: "#D3D3D3", width: 15, name: "Silver Gray", texture: "Linen", finish: "Metallic", price: 39.99 },
    { color: "#F0F8FF", width: 20, name: "Ice Blue", texture: "Smooth", finish: "Satin", price: 32.99 },
    { color: "#FFF8DC", width: 18, name: "Cream", texture: "Suede", finish: "Matte", price: 34.99 },
    { color: "#FAF0E6", width: 22, name: "Linen", texture: "Linen", finish: "Textured", price: 37.99 },
    { color: "#FAEBD7", width: 20, name: "Antique White", texture: "Cotton", finish: "Conservation", price: 44.99 },
    { color: "#F5F5DC", width: 16, name: "Beige", texture: "Textured", finish: "Acid-Free", price: 42.99 },
    { color: "#FFF0F5", width: 18, name: "Lavender Blush", texture: "Smooth", finish: "Conservation", price: 39.99 },
    { color: "#F0FFF0", width: 20, name: "Honeydew", texture: "Cotton", finish: "Matte", price: 32.99 }
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
      
      // Calculate frame position and size
      const frameWidth = canvasWidth * 0.8;
      const frameHeight = frameWidth * (height / width);
      const frameX = (canvasWidth - frameWidth) / 2;
      const frameY = (canvasHeight - frameHeight) / 2;
      
      // Draw room background
      ctx.fillStyle = roomStyleColors[roomStyle].wall;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw ambient lighting effect
      const lightingConfig = lightingConditions[lighting];
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
      
      // Draw shadow
      ctx.shadowColor = lightingConfig.shadow;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      
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
      
      // Draw mat
      ctx.fillStyle = matStyle.color;
      ctx.fillRect(
        frameX, 
        frameY, 
        frameWidth, 
        frameHeight
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
            // Create gradient for glass reflection
            const glassGradient = ctx.createLinearGradient(
              frameX, frameY, 
              frameX + frameWidth, frameY + frameHeight
            );
            
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
  }, [userImage, selectedFrame, selectedMat, selectedGlass, roomStyle, lighting, frameIndex, matIndex, currentAnimation, height, width]);
  
  // Get the preview canvas size
  const getCanvasSize = useCallback(() => {
    return {
      width: 600,
      height: 400
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Interactive AI Frame Preview Animator</h3>
          <div className="text-xl font-bold text-primary">${getTotalPrice()}</div>
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
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center gap-2 p-1">
                    <Button 
                      size="sm" 
                      variant={currentAnimation === "room" && isAnimating ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => toggleAnimation("room")}
                    >
                      {currentAnimation === "room" && isAnimating ? (
                        <PauseCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <PlayCircle className="h-4 w-4 mr-1" />
                      )}
                      Room Styles
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant={currentAnimation === "lighting" && isAnimating ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => toggleAnimation("lighting")}
                    >
                      {currentAnimation === "lighting" && isAnimating ? (
                        <PauseCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <PlayCircle className="h-4 w-4 mr-1" />
                      )}
                      Lighting
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant={currentAnimation === "styles" && isAnimating ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => toggleAnimation("styles")}
                    >
                      {currentAnimation === "styles" && isAnimating ? (
                        <PauseCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <PlayCircle className="h-4 w-4 mr-1" />
                      )}
                      Frame Styles
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
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {frameStyles.map((style, index) => (
                      <div key={index} className="flex flex-col">
                        <button
                          className={`h-10 rounded-md transition-all ${frameIndex === index ? 'ring-2 ring-primary scale-110' : 'hover:scale-105'}`}
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
                            <div className="text-neutral-500">{style.material}</div>
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
                  <div className="grid grid-cols-5 gap-2">
                    {matStyles.map((style, index) => (
                      <div key={index} className="flex flex-col">
                        <button
                          className={`h-8 rounded-md transition-all ${matIndex === index ? 'ring-2 ring-primary' : 'hover:opacity-80'}`}
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
                            <div className="text-neutral-500">{style.texture}, {style.finish}</div>
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
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="p-4 border-t flex justify-between items-center">
          <Button variant="outline" onClick={resetPreview}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <div className="text-right">
            <div className="mb-2 text-sm">
              <div className="flex justify-end items-center gap-2 mb-1">
                <span className="text-neutral-600">Selected Frame:</span> 
                <span className="font-medium text-primary">{frameStyles[frameIndex].name}</span>
                <span className="text-xs text-neutral-500">(${frameStyles[frameIndex].price})</span>
              </div>
              <div className="flex justify-end items-center gap-2 mb-1">
                <span className="text-neutral-600">Selected Mat:</span> 
                <span className="font-medium text-primary">{matStyles[matIndex].name} ({matStyles[matIndex].finish})</span>
                <span className="text-xs text-neutral-500">(${matStyles[matIndex].price})</span>
              </div>
              <div className="flex justify-end items-center gap-2">
                <span className="text-neutral-600 font-medium">Total:</span> 
                <span className="font-bold text-lg text-primary">${(frameStyles[frameIndex].price + matStyles[matIndex].price).toFixed(2)}</span>
              </div>
            </div>
            <div>
              <Button variant="outline" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={handleAddToCart}
                className="text-white mr-2"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="default"
                onClick={handleProceedToCheckout}
                className="text-white bg-green-600 hover:bg-green-700"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};