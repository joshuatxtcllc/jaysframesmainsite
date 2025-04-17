import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: any[];
  orderInfo?: any;
}

interface ChatbotProps {
  initialIsOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const Chatbot = ({ initialIsOpen = false, setIsOpen: externalSetIsOpen }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate session ID on first load
    if (!sessionId) {
      setSessionId(nanoid());
    }
    
    // If no messages, add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: nanoid(),
          role: "assistant",
          content: "Hi there! I'm the Jay's Frames assistant. How can I help you today? I can answer framing questions, check your order status, or help you find the perfect frame."
        }
      ]);
    }
  }, [sessionId, messages.length]);

  // React to external changes in isOpen state
  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Update the isOpen state in this component and in the parent component
  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (externalSetIsOpen) {
      externalSetIsOpen(newIsOpen);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: input
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Extract order number if checking status
      const orderNumberMatch = input.match(/order\s*(?:number|#)?:?\s*(\w+)/i);
      const orderNumber = orderNumberMatch ? orderNumberMatch[1] : undefined;

      const response = await apiRequest("POST", "/api/chat", {
        sessionId,
        message: input,
        orderNumber
      });
      
      const data = await response.json();
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: data.message,
        recommendations: data.recommendations,
        orderInfo: data.orderInfo
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          role: "assistant",
          content: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg z-40 border-2 border-white"
        onClick={toggleChat}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md z-50">
      <Card className="shadow-xl border-2 border-primary">
        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-lg">Jay's Frames Assistant</h3>
          <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-primary/80">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto px-4 py-4" style={{ scrollBehavior: "smooth" }}>
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">JF</span>
                  </div>
                )}
                
                <div className={`${
                  message.role === "user" 
                    ? "mr-3 bg-accent bg-opacity-10 rounded-lg rounded-tr-none" 
                    : "ml-3 bg-neutral-100 rounded-lg rounded-tl-none"
                  } p-3 max-w-xs`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Product recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.recommendations.map((product) => (
                        <div key={product.id} className="bg-white p-2 rounded">
                          <div className="h-16 bg-neutral-200 rounded mb-1 overflow-hidden">
                            {product.imageUrl && (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <p className="text-xs text-center truncate">{product.name}</p>
                          <p className="text-xs text-center text-secondary font-bold">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Order info */}
                  {message.orderInfo && (
                    <div className="mt-3 p-2 bg-white rounded border border-neutral-200">
                      <p className="text-xs font-bold">Order #{message.orderInfo.id}</p>
                      <p className="text-xs">Status: {message.orderInfo.status}</p>
                      <p className="text-xs">Current stage: {message.orderInfo.currentStage.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                </div>
                
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-neutral-600 text-sm font-bold">You</span>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex mb-4">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">JF</span>
                </div>
                <div className="ml-3 bg-neutral-100 p-3 rounded-lg rounded-tl-none inline-flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Type your question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow rounded-r-none focus:z-10"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white rounded-l-none"
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-center text-neutral-400 mt-2">
              You can ask about framing, order status, or product recommendations
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
