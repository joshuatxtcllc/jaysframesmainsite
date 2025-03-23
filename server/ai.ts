import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const model = "gpt-4-turbo";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder",
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
  createdAt: string;
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
 * Generates frame recommendations based on artwork description
 */
export async function getFrameRecommendations(
  artworkDescription: string,
  frameOptions: any[],
  matOptions: any[]
): Promise<any> {
  try {
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
