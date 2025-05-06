import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useDesignProgress } from '@/contexts/design-progress-context';

interface ProgressBarProps {
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ showLabel = true, className = '' }: ProgressBarProps) {
  const { totalSteps, completedSteps } = useDesignProgress();
  
  // Calculate percentage
  const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Design Progress</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <Progress value={percentage} className="h-2" />
    </div>
  );
}