import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { useDesignProgress } from '@/contexts/design-progress-context';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StepIndicatorProps {
  showAllSteps?: boolean;
  className?: string;
  onStepClick?: (stepKey: string) => void;
}

export function StepIndicator({ 
  showAllSteps = false, 
  className = '',
  onStepClick
}: StepIndicatorProps) {
  const { steps, progress, currentStepIndex } = useDesignProgress();
  
  // Determine which steps to show
  const stepsToShow = showAllSteps 
    ? steps 
    : steps.filter((step, index) => {
        // Show current step, previous step, and next step
        return index >= currentStepIndex - 1 && index <= currentStepIndex + 1;
      });
  
  // Check if step is completed
  const isStepCompleted = (stepKey: string) => {
    return progress?.stepsCompleted?.includes(stepKey) || false;
  };
  
  // Check if step is current
  const isCurrentStep = (stepKey: string) => {
    return progress?.currentStep === stepKey;
  };
  
  // Handle step click
  const handleStepClick = (stepKey: string) => {
    if (onStepClick) {
      onStepClick(stepKey);
    }
  };
  
  return (
    <div className={`flex flex-wrap items-center ${className}`}>
      {stepsToShow.map((step, index) => (
        <React.Fragment key={step.id}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`
                    flex items-center rounded-full p-1 cursor-pointer
                    ${isCurrentStep(step.stepKey) ? 'ring-2 ring-primary' : ''}
                    ${isStepCompleted(step.stepKey) ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                  `}
                  onClick={() => handleStepClick(step.stepKey)}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full">
                    {isStepCompleted(step.stepKey) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{step.name}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
                {step.points > 0 && (
                  <Badge variant="outline" className="mt-1">
                    {step.points} points
                  </Badge>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {index < stepsToShow.length - 1 && (
            <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}