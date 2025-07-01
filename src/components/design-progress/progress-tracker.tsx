import React from 'react';
import { ProgressBar } from './progress-bar';
import { StepIndicator } from './step-indicator';
import { AchievementsDisplay } from './achievements-display';
import { DesignTips } from './design-tips';
import { useDesignProgress } from '@/contexts/design-progress-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medal, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressTrackerProps {
  designId?: string;
  compact?: boolean;
  className?: string;
  onStepClick?: (stepKey: string) => void;
}

export function ProgressTracker({ 
  designId = 'default',
  compact = false,
  className = '',
  onStepClick
}: ProgressTrackerProps) {
  const { isLoading, progress, steps, currentStepIndex, updateCurrentStep, markStepCompleted } = useDesignProgress();
  
  // Get current step
  const currentStep = steps.find(step => step.stepKey === progress?.currentStep);
  
  // Get next step
  const nextStepIndex = currentStepIndex + 1;
  const nextStep = nextStepIndex < steps.length ? steps[nextStepIndex] : null;
  
  // Handle next step click
  const handleNextStep = () => {
    if (currentStep && nextStep) {
      // Mark current step as completed
      markStepCompleted(currentStep.stepKey);
      
      // Update to next step
      updateCurrentStep(nextStep.stepKey);
      
      // Call onStepClick if provided
      if (onStepClick) {
        onStepClick(nextStep.stepKey);
      }
    }
  };
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-3 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center justify-between">
            <span>Frame Design Progress</span>
            {progress?.totalPoints ? (
              <span className="text-sm font-normal text-muted-foreground">
                {progress.totalPoints} points earned
              </span>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar />
          <StepIndicator onStepClick={onStepClick} />
          
          {currentStep && (
            <div className="flex items-center justify-between mt-4">
              <div>
                <h4 className="text-sm font-medium">{currentStep.name}</h4>
                <p className="text-xs text-muted-foreground">{currentStep.description}</p>
              </div>
              
              {nextStep && (
                <Button size="sm" onClick={handleNextStep} className="gap-1">
                  Next <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Design Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <ProgressBar />
          <StepIndicator showAllSteps onStepClick={onStepClick} />
        </div>
        
        <Tabs defaultValue="progress">
          <TabsList className="mb-4">
            <TabsTrigger value="progress" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Current Progress</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-1">
              <Medal className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4">
            {currentStep && (
              <div>
                <h3 className="text-lg font-medium">{currentStep.name}</h3>
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
                    {currentStep.points > 0 && (
                      <span className="ml-2 text-primary">
                        +{currentStep.points} points
                      </span>
                    )}
                  </div>
                  
                  {nextStep && (
                    <Button size="sm" onClick={handleNextStep} className="gap-1">
                      Continue to {nextStep.name} <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            <DesignTips className="mt-4" />
          </TabsContent>
          
          <TabsContent value="achievements">
            <AchievementsDisplay />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}