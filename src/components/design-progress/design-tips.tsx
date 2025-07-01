import React from 'react';
import { useDesignProgress } from '@/contexts/design-progress-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface DesignTipsProps {
  className?: string;
}

export function DesignTips({ className = '' }: DesignTipsProps) {
  const { steps, progress } = useDesignProgress();
  
  // Get current step
  const currentStep = steps.find(step => step.stepKey === progress?.currentStep);
  
  if (!currentStep || !currentStep.tips || currentStep.tips.length === 0) {
    return null;
  }
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Tips for {currentStep.name}
        </CardTitle>
        <CardDescription>
          Helpful hints to make the perfect frame
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {currentStep.tips.map((tip, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}