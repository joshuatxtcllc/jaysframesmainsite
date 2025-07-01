
import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, Image, Move, Maximize2, ZoomIn, RotateCw, PanelLeft, Save } from "lucide-react";
import { RecommendationCarousel } from "@/components/product/recommendation-carousel";
import { Link } from "wouter";

const VirtualRoomVisualizer = () => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [framePosition, setFramePosition] = useState({ x: 50, y: 50 });
  const [frameSize, setFrameSize] = useState(30);
  const [frameRotation, setFrameRotation] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeMode, setActiveMode] = useState<"move" | "resize" | "rotate">("move");
  const [savedDesigns, setSavedDesigns] = useState<Array<{id: string, name: string, thumbnail: string}>>([]);
  
  // Sample frame images - in production, these would come from your frame database
  const frameOptions = [
    { id: "1", name: "Classic Black", imageUrl: "https://images.unsplash.com/photo-1579541591970-e5dea16942e5" },
    { id: "2", name: "Ornate Gold", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38" },
    { id: "3", name: "Minimalist White", imageUrl: "https://images.unsplash.com/photo-1560421741-6551b1f1f4b3" },
    { id: "4", name: "Rustic Wood", imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRoomImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || !selectedFrame) return;
    
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (activeMode === "move") {
      setFramePosition({
        x: framePosition.x + (x - dragStart.x),
        y: framePosition.y + (y - dragStart.y)
      });
    } else if (activeMode === "resize") {
      // Calculate distance from drag start to current position
      const distanceChange = Math.sqrt(
        Math.pow(x - dragStart.x, 2) + Math.pow(y - dragStart.y, 2)
      );
      // Use direction to determine increase or decrease
      const direction = ((x - dragStart.x) + (y - dragStart.y)) > 0 ? 1 : -1;
      setFrameSize(Math.max(10, frameSize + direction * distanceChange / 10));
    } else if (activeMode === "rotate") {
      // Calculate angle between center of frame and current mouse position
      const centerX = framePosition.x;
      const centerY = framePosition.y;
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      setFrameRotation(angle + 90); // Add 90 to make top of frame the reference point
    }
    
    setDragStart({ x, y });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const saveDesign = () => {
    if (!canvasRef.current || !roomImage) return;
    
    // In a real implementation, you would use html2canvas or a similar library
    // to capture the current state of the visualizer
    const newDesign = {
      id: Date.now().toString(),
      name: `Room Design ${savedDesigns.length + 1}`,
      thumbnail: roomImage
    };
    
    setSavedDesigns([...savedDesigns, newDesign]);
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Virtual Room Visualizer | Preview Frames in Your Space | Jay's Frames</title>
        <meta name="description" content="Upload a photo of your room and visualize how custom framed artwork will look on your walls. Try different frames, positions, and sizes with our virtual room visualizer." />
        <meta name="keywords" content="virtual room visualizer, frame preview tool, custom framing visualization, art placement tool, Houston custom framing preview" />
      </Helmet>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <Upload className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Virtual Room Visualizer</h1>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Upload a photo of your room and see how custom framed artwork would look on your walls. Experiment with different frames, sizes, and positions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualizer Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-xl p-8 shadow-elegant h-full">
                <h2 className="text-2xl font-serif font-bold mb-6 text-primary">Room Preview</h2>
                
                {!roomImage ? (
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg h-96 flex flex-col items-center justify-center">
                    <Upload className="h-16 w-16 text-neutral-300 mb-4" />
                    <p className="text-neutral-500 mb-4">Upload a photo of your room to begin</p>
                    <label className="cursor-pointer">
                      <span className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md">
                        Select Room Photo
                      </span>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </div>
                ) : (
                  <div 
                    ref={canvasRef}
                    className="relative border rounded-lg overflow-hidden h-96 bg-neutral-200 cursor-grab"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  >
                    <img 
                      src={roomImage} 
                      alt="Room Preview" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {selectedFrame && (
                      <div 
                        className="absolute border-8 bg-white/20"
                        style={{
                          width: `${frameSize}%`,
                          height: `${frameSize * 1.25}%`, // Default aspect ratio
                          transform: `translate(-50%, -50%) rotate(${frameRotation}deg)`,
                          top: `${framePosition.y}px`,
                          left: `${framePosition.x}px`,
                          borderColor: frameOptions.find(f => f.id === selectedFrame)?.name === "Classic Black" ? "#000" :
                                       frameOptions.find(f => f.id === selectedFrame)?.name === "Ornate Gold" ? "#D4AF37" :
                                       frameOptions.find(f => f.id === selectedFrame)?.name === "Minimalist White" ? "#FFF" : "#8B4513"
                        }}
                      >
                        <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-center p-2">
                          <p className="text-sm text-neutral-500">Your Artwork</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {roomImage && (
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <div className="grid grid-cols-5 gap-2">
                      <Button 
                        variant={activeMode === "move" ? "default" : "outline"} 
                        className={`text-xs px-3 col-span-1 ${activeMode === "move" ? "bg-primary text-white" : ""}`}
                        onClick={() => setActiveMode("move")}
                      >
                        <Move className="h-4 w-4 mr-1" />
                        Move
                      </Button>
                      <Button 
                        variant={activeMode === "resize" ? "default" : "outline"} 
                        className={`text-xs px-3 col-span-1 ${activeMode === "resize" ? "bg-primary text-white" : ""}`}
                        onClick={() => setActiveMode("resize")}
                      >
                        <Maximize2 className="h-4 w-4 mr-1" />
                        Size
                      </Button>
                      <Button 
                        variant={activeMode === "rotate" ? "default" : "outline"} 
                        className={`text-xs px-3 col-span-1 ${activeMode === "rotate" ? "bg-primary text-white" : ""}`}
                        onClick={() => setActiveMode("rotate")}
                      >
                        <RotateCw className="h-4 w-4 mr-1" />
                        Rotate
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-xs px-3 col-span-1"
                        onClick={() => setRoomImage(null)}
                      >
                        New Photo
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="text-xs px-3 col-span-1"
                        onClick={saveDesign}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                )}
                
                {roomImage && savedDesigns.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-medium mb-2">Saved Designs</h3>
                    <div className="flex flex-wrap gap-2">
                      {savedDesigns.map(design => (
                        <div key={design.id} className="w-16 h-16 rounded overflow-hidden border">
                          <img 
                            src={design.thumbnail} 
                            alt={design.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right sidebar options */}
            <div className="bg-gradient-to-tr from-neutral-50 to-neutral-100 rounded-xl p-6 shadow-elegant">
              <div className="bg-white rounded-lg p-4 shadow-sm mb-6 text-center">
                <h3 className="text-xl font-serif font-bold text-primary mb-1">Frame Options</h3>
                <p className="text-sm text-neutral-500">Select a frame style for your visualization</p>
              </div>
              
              {/* Frame Selection */}
              <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
                <h3 className="text-lg font-serif font-bold text-primary mb-3">Select Frame Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {frameOptions.map((frame) => (
                    <div 
                      key={frame.id}
                      className={`frame-option cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                        selectedFrame === frame.id 
                          ? 'ring-2 ring-accent scale-105 shadow-md' 
                          : 'hover:shadow-md hover:scale-105 border border-neutral-200'
                      }`}
                      onClick={() => handleFrameSelect(frame.id)}
                    >
                      <div 
                        className="h-16 border-b"
                        style={{ backgroundColor: 
                          frame.name === "Classic Black" ? "#000" :
                          frame.name === "Ornate Gold" ? "#D4AF37" :
                          frame.name === "Minimalist White" ? "#F5F5F5" : "#8B4513"
                        }}
                      ></div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-center line-clamp-1">{frame.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Artwork Selection */}
              <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
                <h3 className="text-lg font-serif font-bold text-primary mb-3">Artwork Options</h3>
                <Label className="block text-sm mb-2">Upload Your Artwork</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="mb-4" 
                />
                <div className="mb-4">
                  <Label className="block text-sm mb-2">Artwork Size</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (8" × 10")</SelectItem>
                      <SelectItem value="standard">Standard (16" × 20")</SelectItem>
                      <SelectItem value="large">Large (24" × 36")</SelectItem>
                      <SelectItem value="custom">Custom Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="bg-white p-6 shadow-sm rounded-lg mb-6">
                <h3 className="text-lg font-serif font-bold text-primary mb-3">Ready to Frame?</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  When you're happy with how your frame looks in your room, start your custom framing project.
                </p>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Link href="/custom-framing">Start Custom Framing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Recommendations Section */}
      <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
              Recommended Frames for Your Space
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Our AI analyzes your room's colors and style to suggest the perfect frames.
            </p>
          </div>
          
          <RecommendationCarousel />
          
          <div className="mt-8 text-center">
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
              <Link href="/custom-framing">
                Explore All Frame Options
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualRoomVisualizer;
