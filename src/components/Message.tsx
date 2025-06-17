
import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const Message: React.FC<MessageProps> = ({ text, isUser, timestamp }) => {
  return (
    <div className={cn("flex gap-3 animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-aurea-400 to-aurea-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-sm border",
          isUser
            ? "bg-aurea-500/90 text-white border-aurea-400/50 rounded-br-md"
            : "bg-white/10 text-gray-100 border-white/20 rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed">{text}</p>
        <time className={cn("text-xs mt-2 block", isUser ? "text-aurea-100" : "text-gray-400")}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};
