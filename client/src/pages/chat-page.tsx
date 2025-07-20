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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: "ai",
      message: "Hello! I'm your AI companion. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

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
