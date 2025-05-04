
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Ruler, 
  Scissors, 
  Hammer, 
  Frame, 
  Image as ImageIcon, 
  Layers, 
  CheckSquare,
  Package
} from "lucide-react";

interface FrameProductionStagesProps {
  currentStage: string;
  frameDetails?: {
    frameType?: string;
    dimensions?: string;
    matColor?: string;
    glassType?: string;
  };
}

const FrameProductionStages = ({ 
  currentStage,
  frameDetails
}: FrameProductionStagesProps) => {
  // Define all the micro-stages in the frame production process
  const productionStages = [
    {
      id: "measurement",
      label: "Measurement",
      icon: Ruler,
      description: "Precise measurements of artwork and frame dimensions",
      requires: ["order_received", "materials_ordered", "materials_arrived"]
    },
    {
      id: "frame_cutting",
      label: "Frame Cutting",
      icon: Scissors,
      description: "Cutting frame moulding to exact specifications",
      requires: ["frame_cutting"]
    },
    {
      id: "mat_cutting",
      label: "Mat Cutting",
      icon: Layers,
      description: "Precision cutting of mats with beveled edges",
      requires: ["mat_cutting"]
    },
    {
      id: "joining",
      label: "Frame Joining",
      icon: Hammer,
      description: "Joining frame corners with precision",
      requires: ["frame_cutting", "assembly"]
    },
    {
      id: "mounting",
      label: "Artwork Mounting",
      icon: ImageIcon,
      description: "Secure mounting of artwork using archival methods",
      requires: ["mat_cutting", "assembly"]
    },
    {
      id: "glazing",
      label: "Glass Installation",
      icon: Frame,
      description: "Installation of selected glass or acrylic",
      requires: ["assembly"]
    },
    {
      id: "final_assembly",
      label: "Final Assembly",
      icon: Package,
      description: "Assembly of all components into finished frame",
      requires: ["assembly"]
    },
    {
      id: "quality_check",
      label: "Quality Inspection",
      icon: CheckSquare,
      description: "Final inspection and cleaning",
      requires: ["quality_check", "completed"]
    }
  ];

  // Determine which stages should be active based on current stage
  const isStageActive = (stageRequires: string[]) => {
    return stageRequires.includes(currentStage);
  };
  
  // For animation effects
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  
  useEffect(() => {
    // Find which stage should be animated
    const index = productionStages.findIndex(stage => 
      isStageActive(stage.requires)
    );
    setActiveStageIndex(index);
  }, [currentStage]);

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4">Frame Production Details</h3>
      
      {frameDetails && (
        <Card className="mb-6 bg-neutral-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {frameDetails.frameType && (
                <div>
                  <span className="font-medium text-neutral-500">Frame Type:</span>
                  <p>{frameDetails.frameType}</p>
                </div>
              )}
              {frameDetails.dimensions && (
                <div>
                  <span className="font-medium text-neutral-500">Dimensions:</span>
                  <p>{frameDetails.dimensions}</p>
                </div>
              )}
              {frameDetails.matColor && (
                <div>
                  <span className="font-medium text-neutral-500">Mat Color:</span>
                  <p>{frameDetails.matColor}</p>
                </div>
              )}
              {frameDetails.glassType && (
                <div>
                  <span className="font-medium text-neutral-500">Glass Type:</span>
                  <p>{frameDetails.glassType}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {productionStages.map((stage, index) => {
          const isActive = isStageActive(stage.requires);
          const Icon = stage.icon;
          
          return (
            <Card 
              key={stage.id} 
              className={cn(
                "border transition-all duration-500 transform",
                isActive ? "border-accent" : "border-neutral-200",
                index === activeStageIndex ? "scale-105 shadow-md" : ""
              )}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                  isActive ? "bg-accent/20 text-accent" : "bg-neutral-100 text-neutral-400"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className={cn(
                  "font-bold text-sm mb-1",
                  isActive ? "text-accent" : "text-neutral-500"
                )}>
                  {stage.label}
                </h4>
                <p className="text-xs text-neutral-500">
                  {stage.description}
                </p>
                
                {isActive && (
                  <div className="w-full mt-2 pt-2 border-t border-neutral-200">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      index === activeStageIndex ? "bg-accent/10 text-accent animate-pulse" : "bg-neutral-100 text-neutral-500"
                    )}>
                      {index === activeStageIndex ? "In Progress" : "Queued"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FrameProductionStages;
