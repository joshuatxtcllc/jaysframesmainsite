import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SeoHead from '@/components/seo/seo-head';
import { Send } from 'lucide-react';

interface FrameAssistantResponse {
  response: string;
}

export default function TextFrameAssistant() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'assistant', text: string}[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Add user message to chat history
    setChatHistory(prev => [...prev, {type: 'user', text: message}]);

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/frame-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from the assistant');
      }

      const data: FrameAssistantResponse = await response.json();
      setResponse(data.response);

      // Add assistant response to chat history
      setChatHistory(prev => [...prev, {type: 'assistant', text: data.response}]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to communicate with the assistant. Please try again later.');
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <SeoHead
        title="Text-Based Frame Assistant | Jay's Frames"
        description="Use our AI assistant to help with custom framing, design recommendations, and artwork analysis."
        canonicalUrl="/voice-frame-assistant"
      />

      <h1 className="text-3xl font-bold mb-4 text-center">Frame Design Assistant</h1>
      <p className="text-center mb-8 text-gray-600">
        Ask the Frame Design Assistant about custom framing, materials, preservation techniques, or design recommendations.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chat with the Frame Design Assistant</CardTitle>
          <CardDescription>
            Get expert framing advice and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-2">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Send a message to start the conversation
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-white ml-12' 
                      : 'bg-gray-100 text-gray-800 mr-12'
                  }`}
                >
                  {message.text}
                </div>
              ))
            )}
            {isLoading && (
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mr-12">
                <div className="flex space-x-2 justify-center items-center h-6">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about custom framing..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">Suggested Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "What frame colors work best with black and white photography?",
            "How do I choose the right matting for my artwork?",
            "What's the difference between conservation and museum glass?",
            "Can you suggest frames for a watercolor painting?",
            "How should I frame a sports jersey?",
            "What are the current trends in custom framing?"
          ].map((question, i) => (
            <Button 
              key={i} 
              variant="outline" 
              className="justify-start h-auto py-2 px-3 text-left"
              onClick={() => setMessage(question)}
              disabled={isLoading}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}