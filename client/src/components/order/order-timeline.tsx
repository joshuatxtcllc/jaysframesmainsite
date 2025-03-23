import { Check, Clock } from "lucide-react";

interface OrderTimelineProps {
  currentStage: string;
}

const OrderTimeline = ({ currentStage }: OrderTimelineProps) => {
  const stages = [
    { id: "order_received", label: "Order Received" },
    { id: "materials_ordered", label: "Materials Ordered" },
    { id: "materials_arrived", label: "Materials Arrived" },
    { id: "frame_cutting", label: "Frame Cutting" },
    { id: "mat_cutting", label: "Mat Cutting" },
    { id: "assembly", label: "Assembly" },
    { id: "completed", label: "Ready for Pickup" }
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

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-0.5 bg-neutral-200"></div>
      
      {stages.map((stage, index) => {
        const isCompleted = isStageCompleted(stage.id);
        const isActive = isStageActive(stage.id);
        const isUpcoming = !isCompleted && !isActive;

        return (
          <div key={stage.id} className={`relative z-10 mb-8 flex items-start ${isUpcoming ? 'opacity-50' : ''}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
              isCompleted 
                ? 'bg-success' 
                : isActive 
                  ? 'bg-accent animate-pulse' 
                  : 'bg-neutral-300'
            }`}>
              {isCompleted ? (
                <Check className="h-5 w-5 text-white" />
              ) : isActive ? (
                <Clock className="h-5 w-5 text-white" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-neutral-500"></span>
              )}
            </div>
            <div className="ml-4">
              <h5 className="font-bold">
                {stage.label}
                {isActive && <span className="text-accent text-sm ml-2">(In Progress)</span>}
              </h5>
              {isCompleted && (
                <p className="text-sm text-neutral-500">Completed</p>
              )}
              {isActive && (
                <p className="text-sm text-neutral-500">Started {new Date().toLocaleDateString()}</p>
              )}
              {isUpcoming && (
                <p className="text-sm text-neutral-500">Upcoming</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
