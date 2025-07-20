import { useState, useRef, useEffect, RefObject } from "react";
import { format } from "date-fns";
import { 
  Loader2, Send, Paperclip, Mic, Lock, Heart, 
  Smile, Sparkles, ThumbsUp, Coffee, Sun, Moon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: number;
  sender: "user" | "ai";
  message: string;
  timestamp: Date;
  sentiment?: string;
  suggestions?: string[];
};

interface ChatInterfaceProps {
  messages: Message[];
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export default function ChatInterface({
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  isLoading,
  messagesEndRef,
}: ChatInterfaceProps) {
  const [sentimentDetected, setSentimentDetected] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [therapistTyping, setTherapistTyping] = useState(false);
  
  // Simulate therapist "typing" before responses
  useEffect(() => {
    if (isLoading) {
      const typingDelay = Math.floor(Math.random() * 2000) + 500; // Random delay between 500ms and 2500ms
      const typingTimer = setTimeout(() => {
        setTherapistTyping(true);
      }, typingDelay);
      
      return () => {
        clearTimeout(typingTimer);
        setTherapistTyping(false);
      };
    }
  }, [isLoading]);
  
  // Set sentiment when a new AI message is received
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "ai" && lastMessage.sentiment) {
      setSentimentDetected(lastMessage.sentiment);
      
      // Clear sentiment after display duration
      const timer = setTimeout(() => {
        setSentimentDetected(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  // Determine message color based on sentiment
  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return "";
    
    switch (sentiment.toLowerCase()) {
      case "stress":
      case "anxiety":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "sadness":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "happiness":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-neutral-50 border-neutral-200 text-neutral-700";
    }
  };
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get sentiment emoji
  const getSentimentEmoji = (sentiment?: string) => {
    if (!sentiment) return "💬";
    
    switch (sentiment.toLowerCase()) {
      case "stress":
      case "anxiety":
        return "😓";
      case "sadness":
        return "😔";
      case "happiness":
        return "😊";
      case "hope":
      case "optimism":
        return "✨";
      case "confusion":
        return "🤔";
      case "gratitude":
        return "🙏";
      default:
        return "💬";
    }
  };
  
  // List of quick emoji responses
  const emojiResponses = [
    { emoji: "👍", label: "Thanks" },
    { emoji: "❤️", label: "Appreciated" },
    { emoji: "😊", label: "Makes me happy" },
    { emoji: "🤔", label: "Not sure" },
    { emoji: "✨", label: "Inspiring" },
    { emoji: "💯", label: "Exactly right" },
  ];

  return (
    <main className="flex-1 md:ml-64 bg-gradient-to-b from-indigo-50/50 to-white flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b border-indigo-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-inner">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="font-display font-semibold text-lg text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
              SereneAI
            </h1>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-neutral-500 ml-1">{getGreeting()}, how can I help you today?</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 font-normal">
          {format(new Date(), 'EEEE, MMM d')}
        </Badge>
      </div>

      {/* Welcome Message - only shown when no messages yet */}
      {messages.length === 0 && (
        <div className="mx-auto max-w-2xl pt-10 pb-5 text-center">
          <div className="mb-4 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-3 inline-flex">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 mb-3">
            Welcome to SereneAI
          </h2>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            I'm here to support your mental wellness journey. Feel free to share your thoughts, 
            ask for advice, or just have a conversation.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <Button 
              variant="outline" 
              className="border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              onClick={() => onInputChange("How can you help me with anxiety?")}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Help with anxiety
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              onClick={() => onInputChange("I need to improve my sleep habits")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Better sleep habits
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              onClick={() => onInputChange("What are some mindfulness techniques?")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Mindfulness practices
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              onClick={() => onInputChange("I'm feeling stressed about work")}
            >
              <Coffee className="mr-2 h-4 w-4" />
              Work stress relief
            </Button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className={`flex mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === "ai" && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div 
              className={`
                ${message.sender === 'ai' 
                  ? 'ml-3 bg-white rounded-t-2xl rounded-br-2xl rounded-bl-lg border border-indigo-100 shadow-sm' 
                  : 'mr-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-2xl rounded-bl-2xl rounded-br-lg shadow-md'
                } 
                p-4 max-w-md transition-all duration-300 hover:shadow-md
              `}
            >
              {/* Message with proper spacing for line breaks */}
              <div 
                className={`whitespace-pre-line ${message.sender === 'ai' ? 'text-neutral-800' : 'text-white'}`}
                style={{ lineHeight: '1.6' }}
              >
                {message.message}
              </div>
              
              {/* Suggestions with improved styling */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button 
                      key={idx} 
                      className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm hover:bg-indigo-100 transition-colors duration-300 border border-indigo-100 text-left flex items-center"
                      onClick={() => onInputChange(suggestion)}
                    >
                      <ThumbsUp className="h-3 w-3 mr-2 text-indigo-500" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Sentiment indicator for AI responses */}
              {message.sender === "ai" && message.sentiment && (
                <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-indigo-50 text-xs text-indigo-600">
                  {getSentimentEmoji(message.sentiment)} {message.sentiment}
                </div>
              )}
              
              {/* Timestamp with natural format */}
              <div className={`text-xs ${message.sender === 'ai' ? 'text-neutral-400' : 'text-white/70'} mt-2 flex`}>
                {message.sender === 'ai' && <Sparkles className="h-3 w-3 mr-1" />}
                {format(message.timestamp, 'h:mm a')}
              </div>
            </div>
            
            {message.sender === "user" && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-indigo-700 text-sm font-semibold">
                  You
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Sentiment Notification */}
        {sentimentDetected && (
          <div className="flex justify-center mb-6 animate-fade-in-down">
            <div className={`px-4 py-2 rounded-full text-sm border ${getSentimentColor(sentimentDetected)} flex items-center shadow-sm`}>
              {getSentimentEmoji(sentimentDetected)}
              <span className="ml-2">I sense you're feeling {sentimentDetected.toLowerCase()}</span>
            </div>
          </div>
        )}

        {/* "Therapist is typing" indicator - more natural */}
        {isLoading && therapistTyping && (
          <div className="flex mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 bg-white p-4 rounded-t-2xl rounded-br-2xl rounded-bl-lg border border-indigo-100 shadow-sm">
              <div className="flex space-x-2 items-center h-6">
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Bar */}
      {messages.length > 0 && !isLoading && (
        <div className="border-t border-indigo-100 bg-white/50 backdrop-blur-sm px-6 py-2 flex justify-center items-center space-x-3 overflow-x-auto">
          {emojiResponses.map((item) => (
            <button 
              key={item.emoji} 
              onClick={() => onInputChange(item.label)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 transition-colors text-sm flex items-center shadow-sm hover:shadow border border-indigo-100"
            >
              <span className="mr-1.5">{item.emoji}</span>
              <span className="text-indigo-700">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-white p-4 border-t border-indigo-100 shadow-sm">
        <div className="flex items-center">
          <button 
            className="text-neutral-500 hover:text-indigo-600 transition-colors duration-300 mr-3 rounded-full p-2 hover:bg-indigo-50"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1 bg-indigo-50/50 rounded-2xl flex items-center p-1 border border-indigo-100">
            <Textarea
              placeholder="Type your message... (Press Enter to send)"
              className="flex-1 bg-transparent border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[44px] max-h-[150px] py-3 px-4"
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ overflow: 'auto' }}
            />
            <button 
              className={`
                text-neutral-500 hover:text-indigo-600 transition-colors duration-300 mx-2 rounded-full p-1.5
                hover:bg-indigo-100 ${showEmoji ? 'bg-indigo-100 text-indigo-600' : ''}
              `}
              onClick={() => setShowEmoji(!showEmoji)}
              aria-label="Show emoji picker"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button 
            className={`
              ml-3 rounded-full w-12 h-12 flex items-center justify-center shadow-md 
              transition-all duration-300 hover:shadow-lg
              ${(!inputMessage.trim() && !isLoading) 
                ? 'bg-indigo-200 text-indigo-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
              }
            `}
            onClick={onSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            aria-label="Send message"
          >
            {isLoading ? 
              <Loader2 className="h-5 w-5 animate-spin" /> : 
              <Send className="h-5 w-5" />
            }
          </button>
        </div>
        
        {/* Session Info & Privacy Indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-neutral-500 flex items-center">
            <Lock className="h-3 w-3 text-neutral-400 mr-1" />
            End-to-end encrypted conversation
          </span>
          <span className="text-xs text-indigo-600 font-medium">
            Session time: {format(new Date(), 'h:mm a')}
          </span>
        </div>
      </div>
      
      {/* Emoji Picker (simplified) */}
      {showEmoji && (
        <div className="bg-white border border-indigo-100 rounded-lg shadow-lg p-3 absolute bottom-20 right-20 grid grid-cols-6 gap-2 max-w-xs">
          {["😊", "😄", "🙂", "😐", "😔", "😢", "😡", "😴", "❤️", "👍", "👎", "🙏", "✨", "💯", "🤔", "😂", "😍", "🙌", "👋", "🔥", "💪", "🎉", "🌈", "🌞"].map(emoji => (
            <button 
              key={emoji}
              className="text-2xl hover:bg-indigo-50 p-1 rounded"
              onClick={() => {
                onInputChange(inputMessage + emoji);
                setShowEmoji(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
      
      {/* Add CSS for animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </main>
  );
}
