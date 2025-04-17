
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";

export type MessageType = {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  buttons?: ButtonOption[];
};

export type ButtonOption = {
  id: string;
  label: string;
  value: string;
  action?: string;
  category?: string;
};

interface ChatMessageProps {
  message: MessageType;
  onButtonClick: (option: ButtonOption) => void;
  isLatestMessage: boolean;
}

export function ChatMessage({ message, onButtonClick, isLatestMessage }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div 
        className={cn(
          "max-w-[85%] rounded-lg p-4",
          isBot 
            ? "bg-chatbot-bot text-black border border-gray-200 rounded-tl-none shadow-sm" 
            : "bg-chatbot-user text-black rounded-tr-none"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {isBot && message.buttons && message.buttons.length > 0 && isLatestMessage && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.buttons.map((option) => (
              option.action === 'back' ? (
                <Button
                  key={option.id}
                  variant="outline"
                  onClick={() => onButtonClick(option)}
                  className="flex items-center gap-1 bg-transparent hover:bg-chatbot-light text-chatbot-secondary border-chatbot-secondary"
                >
                  <ChevronLeft size={16} /> {option.label}
                </Button>
              ) : option.action === 'restart' ? (
                <Button
                  key={option.id}
                  variant="outline"
                  onClick={() => onButtonClick(option)}
                  className="flex items-center gap-1 bg-transparent hover:bg-chatbot-light text-chatbot-secondary border-chatbot-secondary"
                >
                  <RotateCcw size={16} /> {option.label}
                </Button>
              ) : (
                <Button
                  key={option.id}
                  onClick={() => onButtonClick(option)}
                  className="bg-chatbot-primary text-white hover:bg-chatbot-secondary transition-colors"
                >
                  {option.label}
                </Button>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
