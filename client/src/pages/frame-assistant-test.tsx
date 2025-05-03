import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface FrameAssistantResponse {
  response: string;
}

export default function FrameAssistantTest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const fetchResponse = await apiRequest(
        'POST',
        '/api/frame-assistant',
        { message }
      );
      
      // Check for non-200 responses
      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error occurred');
      }
      
      const result = await fetchResponse.json() as FrameAssistantResponse;
      setResponse(result.response);
    } catch (err) {
      console.error('Error contacting Frame Assistant:', err);
      setError('Failed to get a response from the Frame Design Assistant. The server might be experiencing database issues. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Frame Design Assistant Test</h1>
      <p className="text-center mb-8 text-gray-600">
        Ask the Frame Design Assistant about custom framing, materials, preservation techniques, or design recommendations.
      </p>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Question</CardTitle>
            <CardDescription>
              Be specific about artwork style, colors, dimensions, or preservation needs.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="For example: 'I have a vintage watercolor painting of a beach scene with soft blues and sandy colors. It's 11x14 inches. What frame would complement this?'"
                className="min-h-[120px]"
              />
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Getting Response...' : 'Ask Assistant'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>Frame Design Assistant Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {response.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}