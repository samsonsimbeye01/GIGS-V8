import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'location';
}

interface ChatProps {
  gigId: string;
  otherUserId: string;
  otherUserName: string;
  onClose: () => void;
}

const RealTimeChat: React.FC<ChatProps> = ({ gigId, otherUserId, otherUserName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = '1'; // Mock current user ID

  useEffect(() => {
    // Subscribe to real-time messages
    const messagesSubscription = supabase
      .channel(`chat_${gigId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `gig_id=eq.${gigId}`
      }, (payload) => {
        const newMsg: Message = {
          id: payload.new.id,
          senderId: payload.new.sender_id,
          receiverId: payload.new.receiver_id,
          content: payload.new.content,
          timestamp: new Date(payload.new.created_at),
          read: false,
          type: 'text'
        };
        setMessages(prev => [...prev, newMsg]);
      })
      .subscribe();

    // Simulate initial messages
    const initialMessages: Message[] = [
      {
        id: '1',
        senderId: otherUserId,
        receiverId: currentUserId,
        content: 'Hi! I saw your gig posting. Are you still looking for someone?',
        timestamp: new Date(Date.now() - 300000),
        read: true,
        type: 'text'
      },
      {
        id: '2',
        senderId: currentUserId,
        receiverId: otherUserId,
        content: 'Yes, the position is still open. Can you tell me about your experience?',
        timestamp: new Date(Date.now() - 240000),
        read: true,
        type: 'text'
      },
      {
        id: '3',
        senderId: otherUserId,
        receiverId: currentUserId,
        content: 'I have 3 years of experience in house cleaning and I\'m available today.',
        timestamp: new Date(Date.now() - 180000),
        read: true,
        type: 'text'
      }
    ];
    setMessages(initialMessages);

    // Simulate typing indicator
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    }, 10000);

    return () => {
      messagesSubscription.unsubscribe();
      clearInterval(typingInterval);
    };
  }, [gigId, otherUserId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: otherUserId,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In real app, send to Supabase
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          gig_id: gigId,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: newMessage,
          type: 'text'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-md mx-auto h-96 flex flex-col">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{otherUserName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{otherUserName}</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-muted-foreground">
                  {isOnline ? 'Online' : 'Last seen 5m ago'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.senderId === currentUserId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeChat;