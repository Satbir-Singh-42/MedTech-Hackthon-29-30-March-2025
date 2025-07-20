import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import ChatInterface from "@/components/chat/chat-interface";
import SOSModal from "@/components/modals/sos-modal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";


type Message = {
  id: number;
  sender: "user" | "ai";
  message: string;
  timestamp: Date;
  sentiment?: string;
  suggestions?: string[];
};

export default function ChatPage() {
  const { user } = useAuth();
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch existing chat messages only if user is authenticated
  const { data: chatHistory } = useQuery({
    queryKey: ["/api/chat/messages"],
    enabled: !!user,
    retry: false,
  });

  // Initialize messages with chat history or default welcome message
  useEffect(() => {
    if (chatHistory && Array.isArray(chatHistory)) {
      const formattedMessages = chatHistory.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender,
        message: msg.message,
        timestamp: new Date(msg.timestamp),
        sentiment: msg.sentiment,
        suggestions: msg.suggestions,
      }));
      setMessages(formattedMessages);
    } else if (messages.length === 0) {
      // Set default welcome message based on user status
      const welcomeMessage = user 
        ? "Hello! I'm your AI companion. How are you feeling today?"
        : "Welcome to SereneAI! Please log in from the home page to start chatting and save your conversation history.";
      
      setMessages([{
        id: 0,
        sender: "ai",
        message: welcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [chatHistory]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat", { message });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, {
        id: data.id,
        sender: "ai",
        message: data.message,
        timestamp: new Date(data.timestamp),
        sentiment: data.sentiment,
        suggestions: data.suggestions,
      }]);
      // Invalidate chat messages to refetch updated history
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // If user is not logged in, show local message only
    if (!user) {
      const newMessage: Message = {
        id: Date.now(),
        sender: "user",
        message: inputMessage,
        timestamp: new Date(),
      };
      
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: "ai",
        message: "I can see your message, but to save our conversation and provide personalized responses, please log in from the home page. You can still chat here, but the conversation won't be saved.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage, aiResponse]);
      setInputMessage("");
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      message: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar onSOSClick={() => setIsSOSModalOpen(true)} />
      
      <ChatInterface
        messages={messages}
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        isLoading={sendMessageMutation.isPending}
        messagesEndRef={messagesEndRef}
      />

      <SOSModal isOpen={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} />
    </div>
  );
}
