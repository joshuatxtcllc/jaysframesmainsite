
import { Check, Clock, AlertTriangle, Hourglass } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  currentStage: string;
  estimatedCompletion?: string;
  stageStartedAt?: string;
  notes?: string[];
  isDelayed?: boolean;
}

const OrderTimeline = ({ 
  currentStage, 
  estimatedCompletion, 
  stageStartedAt, 
  notes = [],
  isDelayed = false 
}: OrderTimelineProps) => {
  // Enhanced stages with more detailed information about the process
  const stages = [
    { 
      id: "order_received", 
      label: "Order Received",
      description: "Your order has been received and is being reviewed by our team."
    },
    { 
      id: "materials_ordered", 
      label: "Materials Ordered",
      description: "We've ordered the specific materials needed for your custom frame."
    },
    { 
      id: "materials_arrived", 
      label: "Materials Arrived",
      description: "All materials for your custom frame have arrived and are ready for production."
    },
    { 
      id: "frame_cutting", 
      label: "Frame Cutting",
      description: "Our craftspeople are precision-cutting the frame components to your exact specifications."
    },
    { 
      id: "mat_cutting", 
      label: "Mat Cutting",
      description: "Custom mats are being precision-cut with our computerized mat cutter."
    },
    { 
      id: "assembly", 
      label: "Assembly",
      description: "Your frame components are being assembled, and your artwork is being carefully fitted."
    },
    { 
      id: "quality_check", 
      label: "Quality Inspection",
      description: "Your completed frame is being inspected to ensure it meets our quality standards."
    },
    { 
      id: "completed", 
      label: "Ready for Pickup",
      description: "Your custom frame is complete and ready for pickup or delivery."
    }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === currentStage);
  };

  const isStageCompleted = (stageId: string) => {
    const currentIndex = getCurrentStageIndex();
    const stageIndex = stages.findIndex(stage => stage.id === stageId);
    return stageIndex < currentIndex;
  };

  const isStageActive = (stageId: string) => {
    return stageId === currentStage;
  };
  
  // Calculate the percentage complete for the progress bar
  const calculateProgressPercentage = () => {
    const currentIndex = getCurrentStageIndex();
    if (currentIndex < 0) return 0;
    return Math.round((currentIndex / (stages.length - 1)) * 100);
  };
  
  // For the blinking effect on the active stage
  const [blink, setBlink] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setBlink(prev => !prev);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format the estimated completion date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format the time since stage started
  const getTimeInStage = (startTimeString?: string) => {
    if (!startTimeString) return '';
    
    const startTime = new Date(startTimeString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startTime.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    }
  };

  const progressPercentage = calculateProgressPercentage();

  return (
    <div className="relative">
      {/* Overall progress bar at the top */}
      <div className="mb-6 mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Progress</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-in-out",
              isDelayed ? "bg-amber-500" : "bg-accent"
            )}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {estimatedCompletion && (
          <div className="text-sm text-neutral-500 mt-2 flex items-center">
            <Hourglass className="h-3 w-3 mr-1" />
            {isDelayed ? (
              <span className="text-amber-600">
                Estimated completion delayed - new estimate: {formatDate(estimatedCompletion)}
              </span>
            ) : (
              <span>
                Estimated completion: {formatDate(estimatedCompletion)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Vertical timeline with stages */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-neutral-200"></div>
      
      {stages.map((stage, index) => {
        const isCompleted = isStageCompleted(stage.id);
        const isActive = isStageActive(stage.id);
        const isUpcoming = !isCompleted && !isActive;
        
        // Find any notes specific to this stage
        const stageNotes = notes.filter(note => 
          note.toLowerCase().includes(stage.id.replace(/_/g, ' '))
        );

        return (
          <div 
            key={stage.id} 
            className={cn(
              "relative z-10 mb-8 flex items-start transition-opacity duration-300",
              isUpcoming ? 'opacity-50' : ''
            )}
          >
            <div 
              className={cn(
                "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                isCompleted 
                  ? 'bg-success' 
                  : isActive 
                    ? blink ? 'bg-accent' : 'bg-accent/70' 
                    : 'bg-neutral-300'
              )}
            >
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : isActive ? (
                isDelayed ? (
                  <AlertTriangle className="h-5 w-5 text-white" />
                ) : (
                  <Clock className="h-5 w-5 text-white" />
                )
              ) : (
                <span className="h-2 w-2 rounded-full bg-neutral-500"></span>
              )}
            </div>
            <div className="ml-4 flex-grow">
              <div className="flex items-center">
                <h5 className="font-bold">
                  {stage.label}
                </h5>
                {isActive && (
                  <span className={cn(
                    "text-sm ml-2 font-medium px-2 py-0.5 rounded",
                    isDelayed ? "text-amber-700 bg-amber-100" : "text-accent bg-accent/10"
                  )}>
                    {isDelayed ? "Delayed" : "In Progress"}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-neutral-500 mt-1">
                {stage.description}
              </p>
              
              {isCompleted && (
                <p className="text-sm text-success mt-1 flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Completed
                </p>
              )}
              
              {isActive && stageStartedAt && (
                <p className="text-sm text-neutral-500 mt-1">
                  Time in stage: {getTimeInStage(stageStartedAt)}
                </p>
              )}
              
              {/* Display any specific notes for this stage */}
              {stageNotes.length > 0 && (
                <div className="mt-2 bg-neutral-50 p-2 rounded border border-neutral-200">
                  <p className="text-xs font-medium">Notes:</p>
                  {stageNotes.map((note, i) => (
                    <p key={i} className="text-xs text-neutral-600 mt-1">{note}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
