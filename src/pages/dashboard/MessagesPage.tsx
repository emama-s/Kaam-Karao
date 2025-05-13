
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Search, Send } from "lucide-react";

// Mock conversation data
const conversations = [
  {
    id: "c1",
    participantId: "2",
    participantName: "Mary Provider",
    participantAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    lastMessage: "I'll be there at 10 AM tomorrow.",
    timestamp: "2025-05-13T08:30:00Z",
    unread: true
  },
  {
    id: "c2",
    participantId: "3",
    participantName: "Alex Electrician",
    participantAvatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    lastMessage: "The job is complete. Thank you for your business!",
    timestamp: "2025-05-12T16:45:00Z",
    unread: false
  }
];

const messages = [
  {
    id: "m1",
    senderId: "1", // John Customer
    text: "Hello, I'd like to confirm my appointment for tomorrow.",
    timestamp: "2025-05-13T08:15:00Z"
  },
  {
    id: "m2",
    senderId: "2", // Mary Provider
    text: "Hi John, Yes your appointment is confirmed. I'll be there at 10 AM tomorrow.",
    timestamp: "2025-05-13T08:30:00Z"
  }
];

export function MessagesPage() {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: `m${chatMessages.length + 1}`,
      senderId: user?.id || "",
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageText("");
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Chat with your service providers or customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          {/* Conversation list */}
          <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer ${
                    activeConversation.id === conversation.id ? "bg-muted" : ""
                  } ${conversation.unread ? "font-medium" : ""}`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <Avatar>
                    <AvatarImage src={conversation.participantAvatar} />
                    <AvatarFallback>
                      {conversation.participantName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="truncate">
                        {conversation.participantName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(conversation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm truncate text-muted-foreground">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat window */}
          <div className="md:col-span-2 border rounded-lg flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarImage src={activeConversation.participantAvatar} />
                <AvatarFallback>
                  {activeConversation.participantName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{activeConversation.participantName}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2 max-w-[80%]">
                    {message.senderId !== user?.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activeConversation.participantAvatar} />
                        <AvatarFallback>
                          {activeConversation.participantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <Card 
                        className={`p-3 ${
                          message.senderId === user?.id 
                            ? "bg-primary text-primary-foreground" 
                            : ""
                        }`}
                      >
                        {message.text}
                      </Card>
                      <span className="text-xs text-muted-foreground mt-1 ml-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSend} className="flex gap-2">
                <Textarea 
                  placeholder="Type a message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="resize-none min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MessagesPage;
