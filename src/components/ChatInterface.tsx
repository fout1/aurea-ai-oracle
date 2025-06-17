
import React, { useState, useRef, useEffect } from "react";
import { Message } from "./Message";
import { InputArea } from "./InputArea";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      text: "Hello! I'm Aurea AI, your intelligent assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "I understand your question. Let me help you with that. As Aurea AI, I'm designed to provide intelligent and helpful responses tailored to your needs.",
      "That's an interesting point! Based on my analysis, I can offer several perspectives on this topic that might be valuable to you.",
      "Thank you for asking! I've processed your request and here's what I think would be the most helpful approach for your situation.",
      "Great question! Let me break this down for you with some insights that could be particularly useful in this context.",
      "I appreciate you bringing this up. From my understanding, here are some key considerations that might help guide your thinking.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
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
            {isTyping && (
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
      <InputArea onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};
