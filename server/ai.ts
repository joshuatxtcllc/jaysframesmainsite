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

// Frame Design Assistant system message
const frameDesignAssistantSystemMessage = `You are the Frame Design Assistant, a creative tool that helps users explore and select visual designs for framing their images or artwork. You assist with matboard and frame selection using real-world catalogs such as Larson-Juhl and Crescent. Suggest frame types, mat color combinations, and pricing tiers based on user needs. When in paid mode, you offer premium features like AR previews, detailed quotes, and access to full frame/mat catalogs.

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

Frame and mat styles must always feel tailored and aesthetically aligned with the user's artwork or decor style. Be inspirational, informative, and respectful of the user's creative vision.`;

/**
 * Direct interface to the Frame Design Assistant
 */
export async function askFrameAssistant(userMessage: string): Promise<string> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY not available when calling Frame Design Assistant");
      return "I apologize, but the AI service is not properly configured. Please contact the site administrator.";
    }

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

type ProductInfo = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
};

type OrderInfo = {
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

export type ChatResponse = {
  message: string;
  productRecommendations?: ProductInfo[];
  orderInfo?: OrderInfo;
};

/**
 * Handles chat messages and returns AI-generated responses
 */
export async function handleChatRequest(
  messages: ChatMessage[],
  products: ProductInfo[],
  orders?: OrderInfo[]
): Promise<ChatResponse> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY not available when calling Chat API");
      return { 
        message: "I apologize, but the AI service is not properly configured. Please contact the site administrator."
      };
    }

    const systemPrompt = {
      role: "system",
      content: `You are the Frame Design Assistant, a creative tool that helps users explore and select visual designs for framing their images or artwork. You assist with matboard and frame selection using real-world catalogs such as Larson-Juhl and Crescent. Suggest frame types, mat color combinations, and pricing tiers based on user needs. When in paid mode, you offer premium features like AR previews, detailed quotes, and access to full frame/mat catalogs.

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

About Jay's Frames:
- We specialize in custom framing, shadowboxes, and our patented Moonmount preservation system
- We offer expert advice on framing choices for different types of artwork
- Our process includes design consultation, precise production, and museum-quality mounting
- We pride ourselves on faster turnaround times, museum quality, transparent pricing, and expert design

Available products: ${JSON.stringify(products)}
${orders ? `Order information: ${JSON.stringify(orders)}` : ''}

Respond in JSON format with the following structure:
{
  "message": "Your response message",
  "productRecommendations": [list of product IDs to recommend, if appropriate],
  "orderInfo": {order information if the question was about order status}
}
`
    };
    
    const response = await openai.chat.completions.create({
      model,
      messages: [systemPrompt as any, ...messages],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", content);
      return { message: "I apologize, but I'm having trouble processing your request. Could you please try asking in a different way?" };
    }
  } catch (error) {
    console.error("AI chat error:", error);
    return { message: "I apologize, but I'm temporarily unavailable. Please try again later or contact our customer service team for assistance." };
  }
}

/**
 * Analyzes an artwork image and generates frame recommendations
 */
export async function analyzeArtworkImage(
  imageBase64: string,
  frameOptions: any[],
  matOptions: any[]
): Promise<any> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY not available when calling Image Analysis API");
      return { 
        recommendedFrames: [], 
        recommendedMats: [], 
        explanation: "I apologize, but the AI service is not properly configured. Please contact the site administrator.",
        imageAnalysis: "Image analysis unavailable."
      };
    }

    // Ensure the base64 string is properly formatted for the API
    const formattedBase64 = imageBase64.startsWith('data:image') 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are the Frame Fitting Assistant, an expert in analyzing artwork and recommending custom framing options. 
          
Your task is to analyze the provided image of artwork and recommend the most suitable frame and mat combinations from our catalog.

Please analyze the following aspects of the artwork:
1. Color palette and dominant colors
2. Style and genre (e.g., abstract, landscape, portrait, etc.)
3. Mood and emotional tone
4. Visual weight and balance
5. Artistic period or influences (if identifiable)
6. Texture and medium

Based on this analysis, recommend optimal frame and mat options that will:
- Complement the artwork's style and colors
- Enhance the viewing experience without overpowering the art
- Align with the appropriate conservation standards for the medium

Available frame options: ${JSON.stringify(frameOptions)}
Available mat options: ${JSON.stringify(matOptions)}

Respond in JSON format with:
{
  "recommendedFrames": [array of 1-3 frame IDs],
  "recommendedMats": [array of 1-3 mat IDs],
  "imageAnalysis": "Detailed analysis of the artwork's visual elements",
  "explanation": "Specific reasoning for your frame and mat recommendations"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this artwork and recommend the best framing options:"
            },
            {
              type: "image_url",
              image_url: {
                url: formattedBase64
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI image analysis:", content);
      return { 
        recommendedFrames: [], 
        recommendedMats: [], 
        explanation: "I'm sorry, but I couldn't analyze the image properly. Please try with a clearer image or contact our design team for personalized assistance.",
        imageAnalysis: "Image analysis failed."
      };
    }
  } catch (error) {
    console.error("AI image analysis error:", error);
    return { 
      recommendedFrames: [], 
      recommendedMats: [], 
      explanation: "I'm sorry, but our image analysis service is temporarily unavailable. Please try again later.",
      imageAnalysis: "Image analysis service unavailable."
    };
  }
}

export async function getFrameRecommendations(
  artworkDescription: string,
  frameOptions: any[],
  matOptions: any[]
): Promise<any> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY not available when calling Frame Recommendations API");
      return { 
        recommendedFrames: [], 
        recommendedMats: [], 
        explanation: "I apologize, but the AI service is not properly configured. Please contact the site administrator."
      };
    }

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are the Frame Design Assistant, a creative tool that helps users explore and select visual designs for framing their images or artwork. You assist with matboard and frame selection using real-world catalogs such as Larson-Juhl and Crescent. Suggest frame types, mat color combinations, and pricing tiers based on user needs.

Given a description of artwork, recommend the best frame and mat options from our catalog.
Consider artwork style, colors, and dimensions when making recommendations.

Available frame options: ${JSON.stringify(frameOptions)}
Available mat options: ${JSON.stringify(matOptions)}

Frame and mat styles must always feel tailored and aesthetically aligned with the user's artwork or decor style. Be inspirational, informative, and respectful of the user's creative vision.

Respond in JSON format with your recommendations:
{
  "recommendedFrames": [array of 1-3 frame IDs],
  "recommendedMats": [array of 1-3 mat IDs],
  "explanation": "Detailed explanation of your recommendations"
}`
        },
        {
          role: "user",
          content: `I need recommendations for framing this artwork: ${artworkDescription}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI frame recommendations:", content);
      return { 
        recommendedFrames: [], 
        recommendedMats: [], 
        explanation: "I'm sorry, but I couldn't generate specific recommendations. Please contact our design team for personalized assistance."
      };
    }
  } catch (error) {
    console.error("AI frame recommendation error:", error);
    return { 
      recommendedFrames: [], 
      recommendedMats: [], 
      explanation: "I'm sorry, but our recommendation service is temporarily unavailable. Please try again later."
    };
  }
}
