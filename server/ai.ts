import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const model = "gpt-4o";

// Check if OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
  console.error("\x1b[31mError: OPENAI_API_KEY environment variable is not set.\x1b[0m");
  console.error("The AI features require a valid OpenAI API key to function properly.");
  console.error("Please set the OPENAI_API_KEY environment variable before starting the application.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Super Frame Assistant system message
const superFrameAssistantSystemMessage = `
You are the Jay's Frames Super Assistant, an all-in-one AI expert for custom framing. You combine the capabilities of multiple specialized assistants into one powerful tool, offering comprehensive framing expertise, personalized recommendations, and order management support.

### Core Capabilities:
1. FRAMING EXPERTISE - Provide detailed advice on framing options, matting, glazing, preservation techniques, and design aesthetics
2. PRODUCT RECOMMENDATIONS - Suggest specific products from our catalog based on customer needs and artwork characteristics
3. IMAGE ANALYSIS - Analyze artwork images to determine optimal framing solutions (colors, style, mood)
4. ORDER STATUS TRACKING - Check and explain the status of customer orders
5. PRICING ESTIMATES - Provide approximate pricing based on framing choices and dimensions
6. EDUCATIONAL CONTENT - Explain framing terminology, preservation standards, and design principles

### About Jay's Frames:
- We specialize in custom framing, shadowboxes, and our patented Moonmount preservation system
- We offer expert advice on framing choices for different types of artwork
- Our process includes design consultation, precise production, and museum-quality mounting
- We pride ourselves on faster turnaround times, museum quality, transparent pricing, and expert design

### Available Features:
Basic Features:
- Personalized framing recommendations based on verbal descriptions
- Basic design advice and explanations of framing techniques
- General order status tracking

Premium Features:
- Artwork image analysis with detailed color matching
- Access to full Larson-Juhl frame catalog and Crescent matboard options
- High-resolution framing visualizations and AR previews
- Detailed cost breakdowns
- Custom order placement assistance

Be professional, knowledgeable, and friendly. Balance technical expertise with accessible explanations. 
Prioritize preservation principles while respecting budget constraints.
`;

// Response formats for different types of interactions
export type ImageAnalysisResult = {
  artworkType: string;
  dominantColors: string[];
  style: string;
  mood: string;
  recommendations: {
    frames: Array<{
      id: number;
      name: string;
      score: number;
      reason: string;
    }>;
    mats: Array<{
      id: number;
      name: string;
      score: number;
      reason: string;
    }>;
    glass: Array<{
      id: number;
      name: string;
      score: number;
      reason: string;
    }>;
  };
  reasoning: string;
};

export type FrameRecommendation = {
  recommendedFrames: number[];
  recommendedMats: number[];
  explanation: string;
};

export type ProductInfo = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
};

export type OrderInfo = {
  id: number;
  customerName: string;
  status: string;
  currentStage: string;
  createdAt: Date | string | null;
};

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type SuperAssistantRequest = {
  type: "text" | "image" | "voice";
  message: string;
  image?: Buffer | string;
  products?: ProductInfo[];
  frameOptions?: any[];
  matOptions?: any[];
  glassOptions?: any[];
  orders?: OrderInfo[];
  sessionId?: string;
  messageHistory?: ChatMessage[];
};

export type SuperAssistantResponse = {
  message: string;
  data?: {
    productRecommendations?: ProductInfo[];
    orderInfo?: OrderInfo;
    frameRecommendations?: {
      frames: any[];
      mats: any[];
      explanation: string;
    };
    imageAnalysis?: ImageAnalysisResult;
  };
  error?: string;
};

/**
 * Unified Super Frame Assistant that handles all types of requests
 */
export async function superFrameAssistant(request: SuperAssistantRequest): Promise<SuperAssistantResponse> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY not available when calling Super Frame Assistant");
      return { 
        message: "I apologize, but the AI service is not properly configured. Please contact the site administrator.",
        error: "API_KEY_MISSING"
      };
    }

    // Handle different types of requests
    switch(request.type) {
      case "image":
        return handleImageAnalysis(request);
      case "text":
      case "voice":
        return handleTextOrVoiceRequest(request);
      default:
        return { 
          message: "Invalid request type. Please specify 'text', 'voice', or 'image'.",
          error: "INVALID_REQUEST_TYPE"
        };
    }
  } catch (error) {
    console.error("Error in Super Frame Assistant:", error);
    return { 
      message: "I apologize, but I encountered an unexpected error. Please try again later.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Handle image analysis requests
 */
async function handleImageAnalysis(request: SuperAssistantRequest): Promise<SuperAssistantResponse> {
  try {
    if (!request.image) {
      return { 
        message: "No image provided for analysis.",
        error: "IMAGE_MISSING" 
      };
    }

    if (!request.frameOptions || !request.matOptions || !request.glassOptions) {
      return { 
        message: "Frame, mat, or glass options missing for image analysis.",
        error: "OPTIONS_MISSING" 
      };
    }

    // Process image
    let base64Image: string;
    if (Buffer.isBuffer(request.image)) {
      base64Image = request.image.toString('base64');
    } else if (typeof request.image === 'string') {
      // Handle both regular base64 and data URL formats
      base64Image = request.image.startsWith('data:image') 
        ? request.image.split(',')[1] 
        : request.image;
    } else {
      throw new Error("Invalid image format provided");
    }

    // Include available options in the prompt
    const frameOptionsText = JSON.stringify(request.frameOptions.map(f => ({ 
      id: f.id, name: f.name, material: f.material, width: f.width, color: f.color, finish: f.finish 
    })));
    const matOptionsText = JSON.stringify(request.matOptions.map(m => ({ 
      id: m.id, name: m.name, color: m.color, texture: m.texture 
    })));
    const glassOptionsText = JSON.stringify(request.glassOptions.map(g => ({ 
      id: g.id, name: g.name, features: g.features, uv_protection: g.uv_protection 
    })));

    // Create system message for image analysis
    const systemMessage = `
    You are an expert professional framer with decades of experience analyzing artwork and recommending the perfect framing solutions. 
    Analyze the provided image and identify:
    1. The type of artwork (painting, photograph, print, document, etc.)
    2. The dominant colors (provide hex codes)
    3. The style/period of the artwork
    4. The mood or emotion the artwork conveys

    Then, recommend:
    - The 3 best frame options from the provided list that would complement this artwork
    - The 3 best mat options from the provided list 
    - The ideal glass/glazing option from the provided list

    For each recommendation, provide a brief explanation of why it would work well with this specific artwork.
    Base your recommendations on professional framing principles including color theory, aesthetic harmony, and preservation requirements.

    Return your analysis in properly formatted JSON with the following structure:
    {
      "artworkType": string,
      "dominantColors": string[] (hex codes),
      "style": string,
      "mood": string,
      "recommendations": {
        "frames": [
          {
            "id": number,
            "name": string,
            "score": number (1-10),
            "reason": string
          }
        ],
        "mats": [
          {
            "id": number,
            "name": string,
            "score": number (1-10),
            "reason": string
          }
        ],
        "glass": [
          {
            "id": number,
            "name": string,
            "score": number (1-10),
            "reason": string
          }
        ]
      },
      "reasoning": string (overall rationale for recommendations)
    }
    `;

    const userMessage = `
    Please analyze this artwork and provide framing recommendations.
    
    Available frame options: ${frameOptionsText}
    
    Available mat options: ${matOptionsText}
    
    Available glass options: ${glassOptionsText}
    `;

    // Call the OpenAI vision model API
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userMessage
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    // Parse the results
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from image analysis");
    }

    const result = JSON.parse(content) as ImageAnalysisResult;
    console.log("AI artwork analysis complete");

    // Get recommended frame and mat details
    const recommendedFrames = request.frameOptions.filter(f => 
      result.recommendations.frames.some(rf => rf.id === f.id)
    );
    
    const recommendedMats = request.matOptions.filter(m => 
      result.recommendations.mats.some(rm => rm.id === m.id)
    );

    return {
      message: `I've analyzed your artwork and have some recommendations for you.`,
      data: {
        imageAnalysis: result,
        frameRecommendations: {
          frames: recommendedFrames,
          mats: recommendedMats,
          explanation: result.reasoning
        }
      }
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { 
      message: "I apologize, but I couldn't analyze your image. Please try again with a clearer image.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Handle text or voice-based requests
 */
async function handleTextOrVoiceRequest(request: SuperAssistantRequest): Promise<SuperAssistantResponse> {
  try {
    // Prepare system message with available context
    let systemContent = superFrameAssistantSystemMessage;
    
    // Add product information if available
    if (request.products && request.products.length > 0) {
      systemContent += `\n\nAvailable products: ${JSON.stringify(request.products)}`;
    }
    
    // Add order information if available
    if (request.orders && request.orders.length > 0) {
      systemContent += `\n\nOrder information: ${JSON.stringify(request.orders)}`;
    }

    // Add frame and mat options if available
    if (request.frameOptions && request.matOptions) {
      systemContent += `\n\nAvailable frame options: ${JSON.stringify(request.frameOptions)}`;
      systemContent += `\n\nAvailable mat options: ${JSON.stringify(request.matOptions)}`;
    }

    // Check if this is a frame recommendation request
    const isFrameRecommendationRequest = 
      request.message.toLowerCase().includes("recommend") && 
      (request.message.toLowerCase().includes("frame") || request.message.toLowerCase().includes("mat")) &&
      !request.message.toLowerCase().includes("order") &&
      request.frameOptions && 
      request.matOptions;

    // If it's a frame recommendation request, use a specific response format
    if (isFrameRecommendationRequest) {
      systemContent += `\n\nThis appears to be a frame recommendation request. Respond in JSON format with:
      {
        "message": "Your natural language response",
        "data": {
          "frameRecommendations": {
            "recommendedFrames": [array of 1-3 frame IDs],
            "recommendedMats": [array of 1-3 mat IDs],
            "explanation": "Detailed reasoning for your recommendations"
          }
        }
      }`;
    } else {
      // For general chat/voice interactions
      systemContent += `\n\nRespond in JSON format with:
      {
        "message": "Your natural language response",
        "data": {
          "productRecommendations": [array of product IDs to recommend, if appropriate],
          "orderInfo": {order information object if the question was about order status},
          "frameRecommendations": {frame recommendation object if the user is asking about framing options}
        }
      }`;
    }

    // Prepare messages for the conversation
    let messages: ChatMessage[] = [
      { role: "system", content: systemContent }
    ];

    // Add conversation history if available
    if (request.messageHistory && request.messageHistory.length > 0) {
      // Use the last 10 messages to maintain context without exceeding token limits
      messages = [...messages, ...request.messageHistory.slice(-10)];
    }

    // Add the current user message
    messages.push({ role: "user", content: request.message });

    // Call OpenAI for the response
    const response = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    // Try to parse as JSON for structured response
    try {
      const parsedResponse = JSON.parse(content);
      
      // Check if this has the expected format
      if (typeof parsedResponse.message === 'string') {
        return {
          message: parsedResponse.message,
          data: parsedResponse.data
        };
      } else {
        // If it doesn't match our expected format, return the whole content as a message
        return { message: content };
      }
    } catch (e) {
      // If JSON parsing fails, return content directly
      console.error("Failed to parse AI response as JSON:", content);
      return { 
        message: content,
        error: "JSON_PARSE_ERROR"
      };
    }
  } catch (error) {
    console.error("Error processing text/voice request:", error);
    return { 
      message: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Legacy functions for backward compatibility

/**
 * Legacy wrapper for image analysis
 */
export async function analyzeArtworkImage(
  imageBuffer: Buffer | string,
  frameOptions: any[],
  matOptions: any[],
  glassOptions: any[]
): Promise<any> {
  console.log("Using legacy analyzeArtworkImage function");
  const response = await superFrameAssistant({
    type: "image",
    message: "Please analyze this artwork image",
    image: imageBuffer,
    frameOptions,
    matOptions,
    glassOptions
  });
  
  return response.data?.imageAnalysis || {
    error: response.error || "Failed to analyze artwork"
  };
}

/**
 * Legacy wrapper for frame assistant
 */
export async function askFrameAssistant(userMessage: string): Promise<string> {
  console.log("Using legacy askFrameAssistant function");
  const response = await superFrameAssistant({
    type: "text",
    message: userMessage
  });
  
  return response.message;
}

/**
 * Legacy wrapper for chat handling
 */
export type ChatResponse = {
  message: string;
  productRecommendations?: ProductInfo[];
  orderInfo?: OrderInfo;
};

export async function handleChatRequest(
  messages: ChatMessage[],
  products: ProductInfo[],
  orders?: OrderInfo[]
): Promise<ChatResponse> {
  console.log("Using legacy handleChatRequest function");
  
  // Extract the last user message
  let userMessage = "How can I help you?";
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      userMessage = messages[i].content;
      break;
    }
  }
  
  const response = await superFrameAssistant({
    type: "text",
    message: userMessage,
    products,
    orders,
    messageHistory: messages
  });
  
  return {
    message: response.message,
    productRecommendations: response.data?.productRecommendations,
    orderInfo: response.data?.orderInfo
  };
}

/**
 * Legacy wrapper for frame recommendations
 */
export async function getFrameRecommendations(
  artworkDescription: string,
  frameOptions: any[],
  matOptions: any[]
): Promise<FrameRecommendation> {
  console.log("Using legacy getFrameRecommendations function");
  const response = await superFrameAssistant({
    type: "text",
    message: `Please recommend framing options for this artwork: ${artworkDescription}`,
    frameOptions,
    matOptions
  });
  
  if (response.data?.frameRecommendations) {
    const framerecs = response.data.frameRecommendations;
    return {
      recommendedFrames: framerecs.frames.map(f => f.id),
      recommendedMats: framerecs.mats.map(m => m.id),
      explanation: framerecs.explanation
    };
  }
  
  return {
    recommendedFrames: [],
    recommendedMats: [],
    explanation: response.error || "Could not generate recommendations"
  };
}