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

/**
 * Analyzes an artwork image and generates frame recommendations
 * @param imageBuffer Buffer containing the image data
 * @param frameOptions Available frame options from the database
 * @param matOptions Available mat options from the database
 * @param glassOptions Available glass options from the database
 * @returns Analysis results with recommendations
 */
export async function analyzeArtworkImage(
  imageBuffer: Buffer | string,
  frameOptions: any[],
  matOptions: any[],
  glassOptions: any[]
) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY not available when calling Image Analysis API");
      throw new Error("AI service is not properly configured");
    }

    // Convert to base64 if it's a buffer
    let base64Image: string;
    if (Buffer.isBuffer(imageBuffer)) {
      base64Image = imageBuffer.toString('base64');
    } else if (typeof imageBuffer === 'string') {
      // Handle both regular base64 and data URL formats
      base64Image = imageBuffer.startsWith('data:image') 
        ? imageBuffer.split(',')[1] 
        : imageBuffer;
    } else {
      throw new Error("Invalid image format provided");
    }

    // Create system message with framing guidelines
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

    // Include available options in the prompt
    const frameOptionsText = JSON.stringify(frameOptions.map(f => ({ id: f.id, name: f.name, material: f.material, width: f.width, color: f.color, finish: f.finish })));
    const matOptionsText = JSON.stringify(matOptions.map(m => ({ id: m.id, name: m.name, color: m.color, texture: m.texture })));
    const glassOptionsText = JSON.stringify(glassOptions.map(g => ({ id: g.id, name: g.name, features: g.features, uv_protection: g.uv_protection })));

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

    // Parse and return the result
    const result = JSON.parse(response.choices[0].message.content || "{}");
    console.log("AI artwork analysis complete");
    return result;
  } catch (error) {
    console.error("Error analyzing artwork image:", error);
    throw new Error(`Failed to analyze artwork: ${error instanceof Error ? error.message : String(error)}`);
  }
}

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
 * Generates frame recommendations based on text description
 */
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

Frame and mat styles must always feel tailored and aesthetically aligned with the user's artwork or decor style. 

Respond in JSON format with:
{
  "recommendedFrames": [array of 1-3 frame IDs],
  "recommendedMats": [array of 1-3 mat IDs],
  "explanation": "Detailed reasoning for your recommendations"
}`
        },
        {
          role: "user",
          content: `Please recommend framing options for this artwork: ${artworkDescription}`
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
      console.error("Failed to parse AI recommendations:", content);
      return { 
        recommendedFrames: [], 
        recommendedMats: [], 
        explanation: "I'm sorry, but I couldn't generate recommendations based on your description. Please provide more details or contact our design team for personalized assistance."
      };
    }
  } catch (error) {
    console.error("AI frame recommendations error:", error);
    return { 
      recommendedFrames: [], 
      recommendedMats: [], 
      explanation: "I'm sorry, but our recommendations service is temporarily unavailable. Please try again later."
    };
  }
}