import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Calendar, Clock, Zap, Settings, CheckCircle, AlertCircle, Play } from 'lucide-react';

interface SchedulerStatus {
  isRunning: boolean;
  nextRun: string | null;
  schedule: string;
}

interface BlogPreview {
  title: string;
  content: string;
  excerpt: string;
  keywords: string[];
  slug: string;
}

export function BlogAutomationPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Fetch scheduler status
  const { data: statusData, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/blog/scheduler/status'],
  });

  // Fetch blog preview
  const { data: previewData, isLoading: isPreviewLoading } = useQuery({
    queryKey: ['/api/blog/automated/preview'],
  });

  // Manual trigger mutation
  const triggerMutation = useMutation({
    mutationFn: () => apiRequest('/api/blog/scheduler/trigger', { method: 'POST' }),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Success',
          description: data.message,
          variant: 'default'
        });
        queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      } else {
        toast({
          title: 'Info',
          description: data.message,
          variant: 'default'
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to generate blog post',
        variant: 'destructive'
      });
    }
  });

  const handleManualTrigger = () => {
    setIsGenerating(true);
    triggerMutation.mutate();
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const status: SchedulerStatus = statusData?.status;
  const preview: BlogPreview = previewData?.preview;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Automation</h2>
          <p className="text-gray-600">
            Automated SEO-focused blog posts for Houston framing keywords
          </p>
        </div>
        <Button
          onClick={handleManualTrigger}
          disabled={isGenerating || triggerMutation.isPending}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isGenerating || triggerMutation.isPending ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Generate Now
            </>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scheduler Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Scheduler Status
            </CardTitle>
            <CardDescription>
              Automated weekly blog post generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isStatusLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={status?.isRunning ? "default" : "secondary"} className="flex items-center gap-1">
                    {status?.isRunning ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{status?.schedule}</span>
                </div>
                
                {status?.nextRun && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Next run: {new Date(status.nextRun).toLocaleString()}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* SEO Targets */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Targets</CardTitle>
            <CardDescription>
              Keywords being targeted for ranking recovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">picture framing houston</span>
                <Badge variant="destructive">Pos. 9 (-2)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">houston frame shop</span>
                <Badge variant="destructive">Pos. 9 (-2)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">custom framing houston</span>
                <Badge variant="destructive">Pos. 12 (-6)</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">houston heights framing</span>
                <Badge variant="secondary">Target</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">museum quality framing houston</span>
                <Badge variant="secondary">Target</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Preview */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Next Blog Post Preview</CardTitle>
            <CardDescription>
              Preview of the next automated blog post that will be generated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPreviewLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold">{preview.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Slug: /{preview.slug}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Excerpt:</h4>
                  <p className="text-sm text-gray-700">{preview.excerpt}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Target Keywords:</h4>
                  <div className="flex flex-wrap gap-1">
                    {preview.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Content Preview:</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto">
                    {preview.content.substring(0, 500)}...
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weekly Topics Rotation */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Topics Rotation</CardTitle>
          <CardDescription>
            Automated topic rotation to ensure diverse SEO content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-medium text-sm">Week 1: Local Houston Art Scene</div>
              <div className="font-medium text-sm">Week 2: Conservation & Climate</div>
              <div className="font-medium text-sm">Week 3: Neighborhood Spotlight</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-sm">Week 4: Seasonal Projects</div>
              <div className="font-medium text-sm">Week 5: Behind the Scenes</div>
              <div className="text-sm text-gray-600">Rotation automatically continues</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}