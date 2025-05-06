import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Types
export type DesignStep = {
  id: number;
  stepKey: string;
  name: string;
  description: string;
  order: number;
  points: number;
  isRequired: boolean;
  category: string;
  tips: string[];
};

export type Achievement = {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  points: number;
  rarity: string;
  criteria: Record<string, any>;
};

export type UserAchievement = {
  id: number;
  userId: number;
  achievementId: number;
  earnedAt: string;
  designId: string;
  pointsEarned: number;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  rarity: string;
};

export type DesignProgress = {
  id?: number;
  userId: number;
  designId: string;
  stepsCompleted: string[];
  currentStep: string;
  totalPoints: number;
  designChoices?: Record<string, any>;
  frameSelected?: boolean;
  matSelected?: boolean;
  glassSelected?: boolean;
  hasCustomSize?: boolean;
  lastInteractionAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Extended type for updating design progress
export type UpdateDesignProgress = Partial<DesignProgress> & {
  completedStep?: string;
};

interface DesignProgressContextType {
  steps: DesignStep[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  progress: DesignProgress | null;
  totalSteps: number;
  completedSteps: number;
  currentStepIndex: number;
  isLoading: boolean;
  error: Error | null;
  markStepCompleted: (step: string) => Promise<void>;
  updateCurrentStep: (step: string) => Promise<void>;
  updateDesignChoices: (choices: Record<string, any>) => Promise<void>;
  setFrameSelected: (selected: boolean) => Promise<void>;
  setMatSelected: (selected: boolean) => Promise<void>;
  setGlassSelected: (selected: boolean) => Promise<void>;
  setHasCustomSize: (hasCustom: boolean) => Promise<void>;
  initializeDesign: (designId: string) => Promise<void>;
}

const DesignProgressContext = createContext<DesignProgressContextType | undefined>(undefined);

export function DesignProgressProvider({ children, designId = 'default' }: { 
  children: ReactNode;
  designId?: string;
}) {
  const queryClient = useQueryClient();
  const [designIdState, setDesignIdState] = useState<string>(designId);
  
  // Queries for steps and achievements
  const { 
    data: steps = [] as DesignStep[], 
    isLoading: isLoadingSteps,
    error: stepsError 
  } = useQuery<DesignStep[]>({
    queryKey: ['/api/design/steps'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  const { 
    data: achievements = [] as Achievement[], 
    isLoading: isLoadingAchievements,
    error: achievementsError 
  } = useQuery<Achievement[]>({
    queryKey: ['/api/design/achievements'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  const { 
    data: userAchievements = [] as UserAchievement[], 
    isLoading: isLoadingUserAchievements,
    error: userAchievementsError 
  } = useQuery<UserAchievement[]>({
    queryKey: ['/api/design/user-achievements', 1], // Hard-coded user ID 1 for now
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Query for user's design progress
  const { 
    data: progress = null as DesignProgress | null, 
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress
  } = useQuery<DesignProgress | null>({
    queryKey: ['/api/design/progress', designIdState],
    enabled: !!designIdState,
  });
  
  // Mutation for updating design progress
  const updateProgressMutation = useMutation({
    mutationFn: async (data: UpdateDesignProgress) => {
      return apiRequest({
        url: `/api/design/progress/${designIdState}`,
        method: 'PATCH',
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/design/progress', designIdState] });
      queryClient.invalidateQueries({ queryKey: ['/api/design/user-achievements', 1] });
    },
  });
  
  // Computed values
  const totalSteps = steps.length;
  const completedSteps = progress?.stepsCompleted?.length || 0;
  const currentStepIndex = steps.findIndex(step => step.stepKey === progress?.currentStep) || 0;
  
  // Loading and error states
  const isLoading = isLoadingSteps || isLoadingAchievements || isLoadingUserAchievements || isLoadingProgress;
  const error = stepsError || achievementsError || userAchievementsError || progressError;
  
  // Functions to update progress
  const markStepCompleted = async (stepKey: string) => {
    await updateProgressMutation.mutateAsync({ completedStep: stepKey });
  };
  
  const updateCurrentStep = async (stepKey: string) => {
    await updateProgressMutation.mutateAsync({ currentStep: stepKey });
  };
  
  const updateDesignChoices = async (choices: Record<string, any>) => {
    await updateProgressMutation.mutateAsync({ designChoices: choices });
  };
  
  const setFrameSelected = async (selected: boolean) => {
    await updateProgressMutation.mutateAsync({ frameSelected: selected });
  };
  
  const setMatSelected = async (selected: boolean) => {
    await updateProgressMutation.mutateAsync({ matSelected: selected });
  };
  
  const setGlassSelected = async (selected: boolean) => {
    await updateProgressMutation.mutateAsync({ glassSelected: selected });
  };
  
  const setHasCustomSize = async (hasCustom: boolean) => {
    await updateProgressMutation.mutateAsync({ hasCustomSize: hasCustom });
  };
  
  const initializeDesign = async (newDesignId: string) => {
    setDesignIdState(newDesignId);
    await refetchProgress();
  };
  
  const value = {
    steps,
    achievements,
    userAchievements,
    progress,
    totalSteps,
    completedSteps,
    currentStepIndex,
    isLoading,
    error,
    markStepCompleted,
    updateCurrentStep,
    updateDesignChoices,
    setFrameSelected,
    setMatSelected,
    setGlassSelected,
    setHasCustomSize,
    initializeDesign,
  };
  
  return (
    <DesignProgressContext.Provider value={value}>
      {children}
    </DesignProgressContext.Provider>
  );
}

export function useDesignProgress() {
  const context = useContext(DesignProgressContext);
  if (context === undefined) {
    throw new Error('useDesignProgress must be used within a DesignProgressProvider');
  }
  return context;
}