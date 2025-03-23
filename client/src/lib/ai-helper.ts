import { apiRequest } from "@/lib/queryClient";
import { AIRecommendation } from "@/types";

/**
 * Fetches frame recommendations from the AI assistant based on artwork description
 */
export async function getFrameRecommendations(artworkDescription: string): Promise<AIRecommendation> {
  try {
    const response = await apiRequest("POST", "/api/frame-recommendations", {
      artworkDescription
    });
    
    const data = await response.json();
    return {
      frames: data.frames || [],
      mats: data.mats || [],
      explanation: data.explanation || "No recommendations available at this time."
    };
  } catch (error) {
    console.error("Error getting frame recommendations:", error);
    return {
      frames: [],
      mats: [],
      explanation: "We're sorry, but we couldn't generate recommendations at this time. Please try again later or contact our design team for assistance."
    };
  }
}

/**
 * Sends a chat message to the AI assistant
 */
export async function sendChatMessage(
  sessionId: string, 
  message: string, 
  orderNumber?: string
) {
  try {
    const response = await apiRequest("POST", "/api/chat", {
      sessionId,
      message,
      orderNumber
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    return {
      message: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our customer service team for assistance.",
      recommendations: [],
      orderInfo: null
    };
  }
}

/**
 * Extracts order number from a chat message if present
 */
export function extractOrderNumber(message: string): string | undefined {
  const orderNumberMatch = message.match(/order\s*(?:number|#)?:?\s*(\w+)/i);
  return orderNumberMatch ? orderNumberMatch[1] : undefined;
}

/**
 * Formats AI recommendations into human-readable text
 */
export function formatRecommendationText(recommendation: AIRecommendation): string {
  if (!recommendation.frames.length && !recommendation.mats.length) {
    return recommendation.explanation;
  }
  
  let text = recommendation.explanation + "\n\n";
  
  if (recommendation.frames.length) {
    text += "Recommended Frames:\n";
    recommendation.frames.forEach(frame => {
      text += `- ${frame.name} (${frame.material})\n`;
    });
  }
  
  if (recommendation.mats.length) {
    text += "\nRecommended Mats:\n";
    recommendation.mats.forEach(mat => {
      text += `- ${mat.name}\n`;
    });
  }
  
  return text;
}
