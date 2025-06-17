
import React, { useState, useRef, KeyboardEvent } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-6 border-t border-white/10 backdrop-blur-sm bg-white/5">
      <div className="flex items-end space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-aurea-400 hover:bg-white/10 mb-2"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className={cn(
              "w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl",
              "text-white placeholder-gray-400 resize-none outline-none",
              "focus:border-aurea-400/50 focus:ring-2 focus:ring-aurea-400/20 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "min-h-[48px] max-h-[120px]"
            )}
            rows={1}
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-aurea-400 hover:bg-white/10 mb-2"
        >
          <Mic className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            "bg-gradient-to-r from-aurea-500 to-aurea-600 hover:from-aurea-600 hover:to-aurea-700",
            "text-white border-0 rounded-xl px-4 py-2 mb-2 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-aurea-500/25"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
