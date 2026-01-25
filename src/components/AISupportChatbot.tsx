import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Loader2, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  confidence?: number;
}

interface AISupportChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISupportChatbot: React.FC<AISupportChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { country } = useLocation();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = country.language === 'sw' 
        ? 'Karibu Linka! Ninaweza kukusaidia vipi leo?'
        : 'Welcome to Linka! How can I help you today?';
      
      setMessages([{
        id: '1',
        text: welcomeMsg,
        sender: 'bot',
        timestamp: new Date(),
        confidence: 100
      }]);
    }
  }, [isOpen, country.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-support-chatbot', {
        body: {
          message: input,
          language: country.language,
          userId: 'current-user-id',
          context: { country: country.name }
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        confidence: data.confidence
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.needsHuman) {
        toast({
          title: 'Human Support Available',
          description: 'This query may need human assistance. Contact support for detailed help.'
        });
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: country.language === 'sw' 
          ? 'Samahani, kuna tatizo. Jaribu tena au wasiliana na msaada.'
          : 'Sorry, there was an error. Please try again or contact support.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md h-96 flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 text-blue-500" />
            Linka AI Support
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={`p-2 rounded-lg text-sm ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.text}
                    {message.confidence && message.confidence < 80 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {message.confidence}% confident
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={country.language === 'sw' ? 'Andika ujumbe...' : 'Type your message...'}
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Emergency: {country.emergencyNumbers.police}</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Phone className="w-3 h-3 mr-1" />
                Human Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISupportChatbot;