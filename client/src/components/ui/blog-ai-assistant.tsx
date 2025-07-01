
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Bot, User, Sparkles, FileText, Eye, CheckCircle, X, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  generatedPost?: {
    title: string;
    content: string;
    excerpt: string;
    keywords: string;
    categoryId: number;
  };
}

interface GeneratedPost {
  title: string;
  content: string;
  excerpt: string;
  keywords: string;
  categoryId: number;
  id?: string;
}

export function BlogAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewPost, setPreviewPost] = useState<GeneratedPost | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories for post generation
  const { data: categories } = useQuery({
    queryKey: ['/api/blog/categories'],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsGenerating(true);

    try {
      // Check if the message is asking for blog post generation
      const isGenerationRequest = inputMessage.toLowerCase().includes('generate') || 
                                  inputMessage.toLowerCase().includes('create') || 
                                  inputMessage.toLowerCase().includes('write') ||
                                  inputMessage.toLowerCase().includes('blog post');

      if (isGenerationRequest) {
        // Generate blog post
        const response = await fetch('/api/blog/ai-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: inputMessage,
            includeGeneration: true
          }),
        });

        const data = await response.json();

        if (response.ok && data.generatedPost) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: data.response,
            timestamp: new Date(),
            generatedPost: data.generatedPost,
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(data.message || 'Failed to generate content');
        }
      } else {
        // Regular chat response
        const response = await fetch('/api/blog/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputMessage }),
        });

        const data = await response.json();

        if (response.ok) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: data.response,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(data.message || 'Failed to get response');
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process request',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewPost = (post: GeneratedPost) => {
    setPreviewPost(post);
  };

  const handlePublishPost = async (post: GeneratedPost) => {
    setIsPublishing(true);
    
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          status: 'published',
          authorId: 1,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Blog post has been published successfully.',
        });
        
        // Refresh blog posts
        queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
        
        setPreviewPost(null);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to publish post');
      }
    } catch (error) {
      toast({
        title: 'Publishing failed',
        description: error instanceof Error ? error.message : 'Failed to publish post',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async (post: GeneratedPost) => {
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          status: 'draft',
          authorId: 1,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Draft saved',
          description: 'Blog post has been saved as a draft.',
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
        setPreviewPost(null);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save draft');
      }
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save draft',
        variant: 'destructive',
      });
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((c: any) => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Custom Framing Blog Assistant
            </DialogTitle>
            <DialogDescription>
              Expert in custom framing topics - generate posts about conservation, materials, techniques, and Houston framing trends.
            </DialogDescription>
          </DialogHeader>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4 border rounded-lg">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Hi! I'm your custom framing blog assistant. I specialize in:</p>
                  <ul className="mt-2 text-sm space-y-1">
                    <li>• Frame selection guides and material comparisons</li>
                    <li>• Conservation and preservation techniques</li>
                    <li>• Matting options and color coordination</li>
                    <li>• Glass types and UV protection</li>
                    <li>• Houston-specific framing trends and tips</li>
                    <li>• Shadow box and dimensional framing</li>
                  </ul>
                  <p className="mt-4 font-medium">Try: "Generate a blog post about choosing the right mat color" or "Write about UV protection for artwork"</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    <div className={`space-y-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.generatedPost && (
                        <Card className="mt-2">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Generated Post
                              </CardTitle>
                              <Badge variant="secondary">
                                {getCategoryName(message.generatedPost.categoryId)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <h4 className="font-semibold mb-2">{message.generatedPost.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {message.generatedPost.excerpt}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePreviewPost(message.generatedPost!)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handlePublishPost(message.generatedPost!)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Publish
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isGenerating && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span>Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2 pt-4">
            <Input
              placeholder="Ask about custom framing topics, conservation, matting, or generate blog posts..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isGenerating}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isGenerating}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Preview Dialog */}
      {previewPost && (
        <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Preview Blog Post</DialogTitle>
              <DialogDescription>
                Review the generated content before publishing
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{previewPost.title}</h2>
                  <Badge variant="outline">{getCategoryName(previewPost.categoryId)}</Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Excerpt</h3>
                  <p className="text-muted-foreground">{previewPost.excerpt}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Keywords</h3>
                  <p className="text-sm text-muted-foreground">{previewPost.keywords}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Content</h3>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: previewPost.content.replace(/\n/g, '<br />') }} />
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewPost(null)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSaveDraft(previewPost)}
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handlePublishPost(previewPost)}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish Now
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
