import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import './chat.css';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Election Commission of India (ECI) assistant. How can I help you with voter registration, polling details, or election timelines today?"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let assistantMessageContent = '';
      setMessages(prev => [...prev, { id: 'temp', role: 'assistant', content: '' }]);

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            assistantMessageContent += decoder.decode(value, { stream: true });
            
            // Just update the latest message in state to simulate streaming
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { id: Date.now().toString(), role: 'assistant', content: assistantMessageContent };
              return updated;
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <button 
        className="chat-toggle-btn"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <Bot size={20} className="text-accent-primary" />
                <h3>ECI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="chat-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map(m => (
                <div key={m.id} className={`chat-message-row ${m.role}`}>
                  <div className={`chat-avatar ${m.role}`}>
                    {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`chat-bubble ${m.role}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-message-row assistant">
                  <div className="chat-avatar assistant">
                    <Bot size={16} />
                  </div>
                  <div className="chat-bubble assistant typing">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your voting rights..."
                className="chat-input"
              />
              <button type="submit" disabled={!input.trim()} className="chat-send-btn">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
