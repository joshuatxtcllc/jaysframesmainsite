# AI Integration Log for Jay's Frames

## Overview
This log documents the AI integration for Jay's Frames e-commerce website, focusing on the Frame Design Assistant functionality. The AI assistant provides expert framing recommendations and customer support through the OpenAI API.

## Implementation Details

### Model Selection
- Using **GPT-4o** (gpt-4o) model - the newest OpenAI model as of May 13, 2024
- Previously used "gpt-4-turbo" but upgraded to improve response quality

### Environment Setup
- OpenAI API key stored securely as environment variable (`OPENAI_API_KEY`)
- API client initialized in `server/ai.ts`

```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### Core AI Functions

#### 1. Ask Frame Assistant (Direct Q&A)
```typescript
export async function askFrameAssistant(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: frameDesignAssistantSystemMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7
    });

    return response.choices[0].message.content || "Sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error calling Frame Design Assistant:", error);
    return "I apologize, but I'm temporarily unavailable. Please try again later.";
  }
}
```

#### 2. Chat Request Handler (With Product/Order Context)
```typescript
export async function handleChatRequest(
  messages: ChatMessage[],
  products: ProductInfo[],
  orders?: OrderInfo[]
): Promise<ChatResponse> {
  // Implementation includes system context about products and orders
  // Returns JSON-formatted responses with product recommendations
}
```

#### 3. Frame Recommendations (Based on Artwork)
```typescript
export async function getFrameRecommendations(
  artworkDescription: string,
  frameOptions: any[],
  matOptions: any[]
): Promise<any> {
  // Implementation with tailored recommendations based on artwork description
  // Returns JSON with recommended frames, mats, and explanation
}
```

### System Messages

#### Frame Design Assistant System Message
```
You are the Frame Design Assistant, a creative tool that helps users explore and select visual designs for framing their images or artwork. You assist with matboard and frame selection using real-world catalogs such as Larson-Juhl and Crescent. Suggest frame types, mat color combinations, and pricing tiers based on user needs. When in paid mode, you offer premium features like AR previews, detailed quotes, and access to full frame/mat catalogs.

Free Features:
- Users can upload images and choose from a basic selection of frames/mats
- Provide 2–3 recommended design combos
- Give basic pricing estimates (no detailed breakdown)

Paid Features:
- Full access to all Larson-Juhl frame designs and Crescent matboards
- Personalized design advice
- High-end preview generation
- Detailed cost breakdowns
- AR visualizations
- Order placement integration

Frame and mat styles must always feel tailored and aesthetically aligned with the user's artwork or decor style. Be inspirational, informative, and respectful of the user's creative vision.
```

#### Chat System Message
Includes expanded context about Jay's Frames:
```
About Jay's Frames:
- We specialize in custom framing, shadowboxes, and our patented Moonmount preservation system
- We offer expert advice on framing choices for different types of artwork
- Our process includes design consultation, precise production, and museum-quality mounting
- We pride ourselves on faster turnaround times, museum quality, transparent pricing, and expert design
```

### API Endpoints

1. `/api/frame-assistant`
   - Method: POST
   - Request body: `{ message: string }`
   - Response: `{ response: string }`
   - Purpose: Direct questions to the Frame Design Assistant

2. `/api/frame-recommendations`
   - Method: POST
   - Request body: `{ artworkDescription: string }`
   - Response: `{ frames: FrameOption[], mats: MatOption[], explanation: string }`
   - Purpose: Get tailored frame and mat recommendations based on artwork description

3. `/api/chat`
   - Method: POST
   - Request body: `{ message: string, sessionId: string }`
   - Response: `{ message: string, productRecommendations?: Product[], orderInfo?: Order }`
   - Purpose: General chatbot functionality with product recommendations and order information

### Frontend Integration

#### Frame Assistant Test Page
Created a dedicated test page at `/frame-assistant-test` for directly interacting with the Frame Design Assistant:

```typescript
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
      
      const result = await fetchResponse.json() as FrameAssistantResponse;
      setResponse(result.response);
    } catch (err) {
      console.error('Error contacting Frame Assistant:', err);
      setError('Failed to get a response from the Frame Design Assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // UI implementation...
}
```

## Testing and Validation

### API Testing
Tested the Frame Assistant endpoint with a curl request:

```bash
curl -X POST http://localhost:5000/api/frame-assistant \
  -H "Content-Type: application/json" \
  -d '{"message": "What types of frames do you recommend for a watercolor painting?"}'
```

Response:
```json
{
  "response": "Watercolor paintings have a delicate and translucent quality, so frames that complement these characteristics often work best. Here are a few recommendations for framing a watercolor painting:\n\n1. **Natural Wood Frames**: \n   - A light or medium-toned wood frame such as maple, oak, or ash can enhance the soft, organic feel of a watercolor. These frames provide a warm and natural border that doesn't overpower the artwork.\n\n2. **White or Off-White Frames**:\n   - A crisp white or slightly off-white frame can provide a clean, contemporary look that highlights the colors in your painting. This choice can make the artwork stand out while maintaining a minimalist aesthetic.\n\n3. **Gold or Silver Leaf Frames**:\n   - For a more traditional or elegant touch, consider using a gold or silver leaf frame. These frames can add a touch of sophistication without being too flashy, especially if they are understated and feature a matte or brushed finish.\n\n4. **Floater Frames**:\n   - If you want a modern presentation, a floater frame can give the illusion of the painting floating within the frame, adding depth and dimension. This style is particularly effective for showcasing watercolor paintings on canvas or panels.\n\nFor matting, consider using a single or double mat with a neutral color like white, cream, or a soft gray to prevent the artwork from being overwhelmed. The mat can also create a visual separation between the artwork and the frame, allowing the colors of the watercolor to truly shine.\n\nIf you have specific colors or styles in mind, I'd be happy to provide more tailored suggestions or estimates based on your preferences!"
}
```

### UI Testing
- Successfully rendered the Frame Assistant Test page
- Tested user input and response display
- Verified error handling for empty messages and API failures

## Future Improvements

### AI Integration Enhancements
1. Add image analysis capabilities for uploaded artwork
2. Implement more sophisticated AI-powered visualizations of frame recommendations
3. Add memory to chat sessions to improve conversation continuity
4. Develop A/B testing for different prompt strategies
5. Integrate rate limiting and usage tracking for OpenAI API

### UI Improvements
1. Add visual representations of frame and mat recommendations
2. Implement AR preview functionality for premium users
3. Add voice input option for accessibility
4. Create a more interactive chat interface with suggestions

## API Usage Optimization
1. Implement caching for common questions to reduce API calls
2. Use token counting to optimize prompt lengths
3. Introduce request batching for multiple simultaneous queries
4. Implement fallback strategies for API outages

## Security Considerations
1. API key is stored securely as an environment variable
2. User inputs are validated before being sent to the API
3. Error messages are sanitized to prevent information leakage
4. Rate limiting should be implemented to prevent abuse