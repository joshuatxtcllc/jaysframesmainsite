import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getFrameRecommendations } from "@/lib/ai-helper";
import { AIRecommendation, FrameOption, MatOption } from "@/types";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function RecommendationCarousel() {
  const [artworkDescription, setArtworkDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artworkDescription.trim()) {
      toast({
        title: "Please enter a description",
        description: "Tell us about your artwork to get personalized recommendations",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await getFrameRecommendations(artworkDescription);
      setRecommendation(result);
    } catch (error) {
      toast({
        title: "Error getting recommendations",
        description: "Please try again or contact customer support",
        variant: "destructive",
      });
      console.error("Error getting recommendations:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Personalized Frame Recommendations</h2>
        <p className="text-muted-foreground">
          Describe your artwork, and our AI will suggest the perfect frames and mats
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            value={artworkDescription}
            onChange={(e) => setArtworkDescription(e.target.value)}
            placeholder="Describe your artwork (e.g., 'A vibrant watercolor landscape with blue and green hues')"
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-white">Getting recommendations...</span>
              </>
            ) : (
              <span className="text-white">Get Recommendations</span>
            )}
          </Button>
        </div>
      </form>

      {recommendation && (
        <div className="space-y-6">
          <div className="max-w-3xl mx-auto bg-muted p-4 rounded-lg">
            <p className="italic">{recommendation.explanation}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-center">Recommended Frames</h3>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {recommendation.frames.map((frame) => (
                  <CarouselItem key={frame.id} className="md:basis-1/2 lg:basis-1/3">
                    <FrameCard frame={frame} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-center">Recommended Mats</h3>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {recommendation.mats.map((mat) => (
                  <CarouselItem key={mat.id} className="md:basis-1/2 lg:basis-1/3">
                    <MatCard mat={mat} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}

function FrameCard({ frame }: { frame: FrameOption }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{frame.name}</span>
          <Badge variant="outline">{frame.material}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        <div 
          className="w-32 h-32 border-8 rounded-sm flex items-center justify-center"
          style={{ 
            borderColor: frame.color,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <span className="text-xs text-muted-foreground">Frame Preview</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: frame.color }} 
          />
          <span className="text-sm">{frame.color}</span>
        </div>
        <span className="font-medium">${(frame.pricePerInch / 100).toFixed(2)}/inch</span>
      </CardFooter>
    </Card>
  );
}

function MatCard({ mat }: { mat: MatOption }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{mat.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        <div 
          className="w-32 h-32 border border-muted-foreground/30 rounded-sm flex items-center justify-center"
          style={{ 
            backgroundColor: mat.color,
            color: isLightColor(mat.color) ? '#000' : '#fff',
          }}
        >
          <span className="text-xs">Mat Preview</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-muted-foreground/30" 
            style={{ backgroundColor: mat.color }} 
          />
          <span className="text-sm">{mat.color}</span>
        </div>
        <span className="font-medium">${(mat.price / 100).toFixed(2)}</span>
      </CardFooter>
    </Card>
  );
}

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // For hex colors
  if (color.startsWith('#')) {
    let r, g, b;
    
    if (color.length === 7) { // #RRGGBB
      r = parseInt(color.substr(1, 2), 16);
      g = parseInt(color.substr(3, 2), 16);
      b = parseInt(color.substr(5, 2), 16);
    } else if (color.length === 4) { // #RGB
      r = parseInt(color.substr(1, 1) + color.substr(1, 1), 16);
      g = parseInt(color.substr(2, 1) + color.substr(2, 1), 16);
      b = parseInt(color.substr(3, 1) + color.substr(3, 1), 16);
    } else {
      return true; // Default to light for unknown formats
    }
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }
  
  // Default to light for non-hex colors
  return true;
}