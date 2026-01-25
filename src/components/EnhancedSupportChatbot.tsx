import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Send, Bot, User, AlertTriangle, Scale } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'human';
  timestamp: string;
  type?: 'dispute' | 'legal' | 'general';
}

interface EnhancedSupportChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedSupportChatbot: React.FC<EnhancedSupportChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatType, setChatType] = useState<'general' | 'dispute' | 'legal'>('general');
  const [escalated, setEscalated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { country } = useLocation();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        content: `Hello! I'm your AI support assistant for ${country.name}. I can help with disputes, legal guidance, and general questions. How can I assist you today?`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'general'
      }]);
    }
  }, [isOpen, country]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: chatType
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-support-chatbot', {
        body: {
          message: inputMessage,
          chatType,
          country: country.code,
          conversationHistory: messages.slice(-5)
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: chatType
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if escalation is needed
      if (data.needsEscalation) {
        setEscalated(true);
        setTimeout(() => {
          const escalationMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: 'I\'m connecting you with a human moderator who can better assist with this complex issue.',
            sender: 'ai',
            timestamp: new Date().toISOString(),
            type: chatType
          };
          setMessages(prev => [...prev, escalationMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Support Assistant
            {escalated && <Badge variant="destructive">Human Support</Badge>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button 
            size="sm" 
            variant={chatType === 'general' ? 'default' : 'outline'}
            onClick={() => setChatType('general')}
          >
            General
          </Button>
          <Button 
            size="sm" 
            variant={chatType === 'dispute' ? 'default' : 'outline'}
            onClick={() => setChatType('dispute')}
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Dispute
          </Button>
          <Button 
            size="sm" 
            variant={chatType === 'legal' ? 'default' : 'outline'}
            onClick={() => setChatType('legal')}
          >
            <Scale className="w-4 h-4 mr-1" />
            Legal
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/10 rounded-lg">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background border'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-background border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 mt-4">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSupportChatbot;