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
      const lastMessage = input.toLowerCase();
      let mockReply = "I am a simulated ECI assistant. According to ECI guidelines, ";
      
      if (lastMessage.includes("register") || lastMessage.includes("enroll")) {
        mockReply += "you need to fill out Form 6 to register as a new voter. You can do this online on the NVSP portal or at your local Electoral Registration Office. Make sure you are 18 years or older as of January 1st.";
      } else if (lastMessage.includes("id") || lastMessage.includes("epic") || lastMessage.includes("document")) {
        mockReply += "you must carry your EPIC (Voter ID). If you don't have an EPIC, you can use an approved photo ID like an Aadhaar card, PAN card, Driving License, or Passport to the polling booth to cast your vote.";
      } else if (lastMessage.includes("evm") || lastMessage.includes("vote")) {
        mockReply += "voting is done through Electronic Voting Machines (EVMs). Press the blue button next to your candidate's name. Wait for the beep sound to confirm your vote has been recorded, and you can verify your choice on the VVPAT slip printed alongside it.";
      } else if (lastMessage.includes("date") || lastMessage.includes("when")) {
        mockReply += "election dates differ by state and constituency. Please check the official ECI website for the schedule relevant to your state assembly or parliamentary constituency.";
      } else {
        mockReply += "please refer to the official Election Commission of India website (eci.gov.in) or call the toll-free voter helpline at 1950 for accurate guidance regarding your query.";
      }

      let assistantMessageContent = '';
      setMessages(prev => [...prev, { id: 'temp', role: 'assistant', content: '' }]);

      const words = mockReply.split(' ');
      for (let i = 0; i < words.length; i++) {
          assistantMessageContent += words[i] + ' ';
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { id: Date.now().toString(), role: 'assistant', content: assistantMessageContent };
            return updated;
          });
          await new Promise(resolve => setTimeout(resolve, 80)); // Typewriter delay
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
