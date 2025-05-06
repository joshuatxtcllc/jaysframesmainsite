import React from 'react';
import { useDesignProgress } from '@/contexts/design-progress-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, Lock } from 'lucide-react';

interface AchievementsDisplayProps {
  showUnlocked?: boolean;
  showLocked?: boolean;
  maxDisplay?: number;
  className?: string;
}

export function AchievementsDisplay({ 
  showUnlocked = true, 
  showLocked = true,
  maxDisplay = 4,
  className = ''
}: AchievementsDisplayProps) {
  const { achievements, userAchievements, progress } = useDesignProgress();
  
  // Get unlocked achievements
  const unlockedAchievements = userAchievements || [];
  
  // Get locked achievements (not yet unlocked)
  const unlockedIds = new Set(unlockedAchievements.map(a => a.achievementId));
  const lockedAchievements = achievements.filter(a => !unlockedIds.has(a.id));
  
  // Determine which achievements to display
  let displayAchievements = [];
  if (showUnlocked && showLocked) {
    // Mix some unlocked and locked achievements
    const unlocked = unlockedAchievements.slice(0, Math.ceil(maxDisplay / 2));
    const locked = lockedAchievements.slice(0, maxDisplay - unlocked.length);
    displayAchievements = [...unlocked, ...locked];
  } else if (showUnlocked) {
    displayAchievements = unlockedAchievements.slice(0, maxDisplay);
  } else if (showLocked) {
    displayAchievements = lockedAchievements.slice(0, maxDisplay);
  }
  
  // Helper to determine rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-blue-500';
      case 'uncommon':
        return 'text-green-500';
      case 'rare':
        return 'text-purple-500';
      case 'epic':
        return 'text-orange-500';
      case 'legendary':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };
  
  if (displayAchievements.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Achievements</h3>
        {progress?.totalPoints ? (
          <Badge variant="outline" className="ml-auto">
            {progress.totalPoints} points
          </Badge>
        ) : null}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayAchievements.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id || achievement.achievementId);
          const achievementData = isUnlocked 
            ? achievement
            : achievements.find(a => a.id === achievement.id);
            
          if (!achievementData) return null;
          
          return (
            <TooltipProvider key={achievement.id || achievement.achievementId}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={`overflow-hidden transition-all duration-200 h-full flex flex-col ${
                    isUnlocked ? 'border-primary/40' : 'border-gray-200 opacity-70'
                  }`}>
                    <CardHeader className="p-3 pb-0">
                      <div className="flex justify-between items-start">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                          {achievementData.iconUrl ? (
                            <img 
                              src={achievementData.iconUrl} 
                              alt={achievementData.name} 
                              className="w-6 h-6"
                            />
                          ) : (
                            <Award className="h-5 w-5 text-primary" />
                          )}
                          {!isUnlocked && (
                            <div className="absolute inset-0 bg-background/70 rounded-full flex items-center justify-center">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRarityColor(achievementData.rarity)}`}
                        >
                          {achievementData.rarity}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2 text-sm font-medium line-clamp-1">
                        {achievementData.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-1 flex-grow">
                      <CardDescription className="text-xs line-clamp-2">
                        {achievementData.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 text-xs border-t">
                      {isUnlocked ? (
                        <span className="text-primary">Unlocked</span>
                      ) : (
                        <span>{achievementData.points} points</span>
                      )}
                    </CardFooter>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{achievementData.name}</p>
                  <p className="text-sm">{achievementData.description}</p>
                  {isUnlocked ? (
                    <p className="text-xs mt-1 text-primary">Unlocked!</p>
                  ) : (
                    <p className="text-xs mt-1">Complete related actions to unlock</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}