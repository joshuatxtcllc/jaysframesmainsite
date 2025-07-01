import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Camera, 
  ArrowLeft, 
  ImagePlus, 
  Maximize, 
  Minimize, 
  RotateCw, 
  Sliders, 
  ZoomIn,
  ChevronsUpDown,
  Wand2,
  Info
} from "lucide-react";
import { Link } from "wouter";
import { AugmentedRealityFrameFitter } from "@/components/ar/augmented-reality-frame-fitter";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { FrameOption, MatOption, GlassOption } from "@/types";

export default function ARFrameAssistant() {
  const [activeTab, setActiveTab] = useState<string>("camera");
  const [dimensions, setDimensions] = useState({ width: 16, height: 20 }); // Default dimensions (inches)
  const [selectedFrame, setSelectedFrame] = useState<FrameOption | null>(null);
  const [selectedMat, setSelectedMat] = useState<MatOption | null>(null);
  const [selectedGlass, setSelectedGlass] = useState<GlassOption | null>(null);
  const [showAdvancedControls, setShowAdvancedControls] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Fetch frame options
  const { data: frameOptions = [] } = useQuery<FrameOption[]>({
    queryKey: ['/api/frame-options'],
  });
  
  // Fetch mat options
  const { data: matOptions = [] } = useQuery<MatOption[]>({
    queryKey: ['/api/mat-options'],
  });
  
  // Fetch glass options
  const { data: glassOptions = [] } = useQuery<GlassOption[]>({
    queryKey: ['/api/glass-options'],
  });
  
  // Set default options when data is loaded
  useEffect(() => {
    if (frameOptions.length > 0 && !selectedFrame) {
      setSelectedFrame(frameOptions[0]);
    }
    
    if (matOptions.length > 0 && !selectedMat) {
      setSelectedMat(matOptions[0]);
    }
    
    if (glassOptions.length > 0 && !selectedGlass) {
      setSelectedGlass(glassOptions[0]);
    }
  }, [frameOptions, matOptions, glassOptions, selectedFrame, selectedMat, selectedGlass]);
  
  // Handle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Helmet>
        <title>AR Frame Fitting Assistant | Jay's Frames</title>
        <meta name="description" content="Try our augmented reality frame fitting assistant to see how different frames will look on your wall" />
      </Helmet>
      
      {!isFullscreen && (
        <div className="mb-6">
          <Link href="/custom-framing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Custom Framing
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">AR Frame Fitting Assistant</h1>
          <p className="text-muted-foreground mt-1">
            See how your artwork will look framed on your wall in real-time
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AR Preview Area */}
        <div className={`${isFullscreen ? 'col-span-full' : 'lg:col-span-2'}`}>
          <Card className="overflow-hidden h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Frame Fitting Assistant</CardTitle>
                  <CardDescription>Position your device camera towards your wall</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 relative">
              {selectedFrame && selectedMat && selectedGlass && (
                <AugmentedRealityFrameFitter
                  width={dimensions.width}
                  height={dimensions.height}
                  selectedFrame={selectedFrame}
                  selectedMat={selectedMat}
                  selectedGlass={selectedGlass}
                  activeTab={activeTab}
                  isFullscreen={isFullscreen}
                  showAdvancedControls={showAdvancedControls}
                />
              )}
            </CardContent>
            
            {!isFullscreen && (
              <CardFooter className="flex justify-between items-center p-4 bg-muted/20">
                <div className="flex gap-2">
                  <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab} 
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-[200px]">
                      <TabsTrigger value="camera">
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </TabsTrigger>
                      <TabsTrigger value="upload">
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Upload
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    id="advanced-controls" 
                    checked={showAdvancedControls}
                    onCheckedChange={setShowAdvancedControls}
                  />
                  <Label htmlFor="advanced-controls" className="text-sm">
                    <Sliders className="h-3 w-3 inline mr-1" />
                    Advanced Controls
                  </Label>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* Control Panel */}
        {!isFullscreen && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Frame Options</CardTitle>
                <CardDescription>Customize your frame for this AR preview</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Dimensions */}
                <div className="space-y-2">
                  <Label>Artwork Dimensions (inches)</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-1/2">
                      <Label htmlFor="width" className="text-xs">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        min={1}
                        max={48}
                        value={dimensions.width}
                        onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                      />
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="height" className="text-xs">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        min={1}
                        max={48}
                        value={dimensions.height}
                        onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Frame Selection */}
                <div className="space-y-2">
                  <Label htmlFor="frame">Frame Style</Label>
                  <Select 
                    value={selectedFrame?.id.toString() || ""} 
                    onValueChange={(value) => {
                      const frame = frameOptions.find(f => f.id.toString() === value);
                      if (frame) setSelectedFrame(frame);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a frame style" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameOptions.map((frame) => (
                        <SelectItem key={frame.id} value={frame.id.toString()}>
                          {frame.name} ({frame.color})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Mat Selection */}
                <div className="space-y-2">
                  <Label htmlFor="mat">Mat Style</Label>
                  <Select 
                    value={selectedMat?.id.toString() || ""} 
                    onValueChange={(value) => {
                      const mat = matOptions.find(m => m.id.toString() === value);
                      if (mat) setSelectedMat(mat);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mat style" />
                    </SelectTrigger>
                    <SelectContent>
                      {matOptions.map((mat) => (
                        <SelectItem key={mat.id} value={mat.id.toString()}>
                          {mat.name} ({mat.color})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Glass Selection */}
                <div className="space-y-2">
                  <Label htmlFor="glass">Glass Type</Label>
                  <Select 
                    value={selectedGlass?.id.toString() || ""} 
                    onValueChange={(value) => {
                      const glass = glassOptions.find(g => g.id.toString() === value);
                      if (glass) setSelectedGlass(glass);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a glass type" />
                    </SelectTrigger>
                    <SelectContent>
                      {glassOptions.map((glass) => (
                        <SelectItem key={glass.id} value={glass.id.toString()}>
                          {glass.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="help">
                    <AccordionTrigger className="text-sm font-medium">
                      <Info className="h-4 w-4 mr-2" />
                      How to use the AR Assistant
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Position your phone camera facing your wall or artwork</li>
                        <li>Tap on the screen to place the frame</li>
                        <li>Adjust the size and position using pinch and drag gestures</li>
                        <li>Try different frame styles and colors</li>
                        <li>For best results, use in well-lit areas</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  className="w-full" 
                  onClick={() => setAiAssistantOpen(true)}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Get AI Frame Recommendations
                </Button>
                
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/custom-framing">
                    Continue to Custom Framing
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      
      {/* Footer Instructions (visible in fullscreen mode) */}
      {isFullscreen && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
          <div className="flex justify-between items-center gap-4 max-w-4xl mx-auto">
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Minimize className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
            
            <div className="text-sm text-center">
              <p>Tap to place frame • Pinch to resize • Drag to reposition</p>
            </div>
            
            <div className="flex gap-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="camera" className="px-2 py-1">
                    <Camera className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="px-2 py-1">
                    <ImagePlus className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}