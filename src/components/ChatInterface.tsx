
import React, { useState, useRef, useEffect } from "react";
import { Message } from "./Message";
import { InputArea } from "./InputArea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAureaAPI } from "@/hooks/useAureaAPI";
import { ConversationMessage } from "@/types/aurea-api";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm Aurea AI, your intelligent blockchain assistant. I can help you with:\n\n🔄 **DeFi Operations**: Swaps, bridges, lending, staking\n📊 **Portfolio Management**: Track and optimize your assets\n⛓️ **Multi-Chain Support**: Ethereum, Polygon, Arbitrum, and more\n💡 **Smart Insights**: Market analysis and recommendations\n🛡️ **Security**: Transaction simulation and protection\n\nConnect your wallet and let's start building your DeFi strategy!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading, apiKey, wallet } = useAureaAPI();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const buildConversationHistory = (): ConversationMessage[] => {
    return messages
      .filter(msg => msg.id !== "1") // Exclude welcome message
      .map(msg => ({
        sender: msg.isUser ? "user" : "aurea",
        content: msg.text,
      }));
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      if (!apiKey) {
        // Fallback to local response if no API key
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: "Please configure your API key in the header to enable real Aurea AI functionality. I'm currently running in demo mode with limited capabilities.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const conversationHistory = buildConversationHistory();
      const result = await sendMessage(
        text, 
        wallet?.address, 
        wallet?.chainId?.toString(), 
        conversationHistory
      );
      
      if (result) {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: result.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Error fallback
        const errorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I encountered an error processing your request. Please check your API key and wallet connection, then try again.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing technical difficulties. Please try again later or check your connection.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-glass backdrop-blur-sm">
      <div className="flex-1 p-6">
        <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <Message
                key={message.id}
                text={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {(isTyping || isLoading) && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-xs border border-white/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-aurea-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-aurea-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-aurea-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <InputArea onSendMessage={handleSendMessage} disabled={isTyping || isLoading} />
    </div>
  );
};
