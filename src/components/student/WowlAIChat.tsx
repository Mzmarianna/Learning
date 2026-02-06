import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, Sparkles, X, Lightbulb, Gamepad2, Book, Zap, Heart, Brain } from 'lucide-react';
import wowlAvatar from '../../assets/64d5bb1a100e68b30321f1f4e7826d3c45d21e17.png';
import wowlIntro from '../../assets/d793d71f8bba9c420a59bd904e5c55a30b6f73a3.png';
import { generateWowlResponse } from '@/lib/ai/gemini-service';
import type { StudentContext, BehaviorSignals } from '@/lib/ai/gemini-service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface WowlAIChatProps {
  studentName: string;
  interests?: string[];
  learningStyle?: string;
  currentLevel?: number;
  recentTopics?: string[];
}

export default function WowlAIChat({ 
  studentName, 
  interests = [],
  learningStyle = 'visual',
  currentLevel = 1,
  recentTopics = []
}: WowlAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hoot hoot! 🦉 Hi ${studentName}! I'm Wowl, your learning buddy! I'm here to help you explore, play, and learn in ways that feel fun for YOU. What would you like to do today?`,
        timestamp: new Date(),
        suggestions: [
          "🎮 Suggest a fun math game",
          "📚 Help me with reading",
          "💡 Give me a creative challenge",
          "🎨 Show me something cool to build"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    const currentInput = inputMessage;
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build student context for Gemini
      const studentContext: StudentContext = {
        id: 'student-demo', // TODO: Get from auth
        name: studentName,
        age: 10, // TODO: Get from student data
        tier: 'explorers', // TODO: Get from student tier
        skillLevels: {
          math: currentLevel || 5,
          reading: currentLevel || 7,
          writing: currentLevel || 5,
          steam: currentLevel || 6,
        },
        knowledgeGaps: recentTopics.length > 0 ? recentTopics : [],
        strengths: interests.length > 0 ? interests : ['building', 'creativity'],
        learningStyle: learningStyle as any,
        currentQuest: undefined,
        recentProgress: {
          xpThisWeek: 0,
          questsCompleted: 0,
          streakDays: 0,
          lastSessionMinutes: 0,
        },
      };

      // Build behavior signals
      const behaviorSignals: BehaviorSignals = {
        clickSpeed: 'normal',
        timeOnCurrentProblem: 0,
        helpRequestsLast10Min: 0,
        successRateLast5Attempts: 0.5,
        messagesSent: messages.filter(m => m.role === 'user').length + 1,
        messagesReceived: messages.filter(m => m.role === 'assistant').length,
        quitAttemptsRecent: 0,
        inferredEmotion: 'neutral',
      };

      // Call Gemini service
      const response = await generateWowlResponse(
        currentInput,
        studentContext,
        behaviorSignals,
        []
      );

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        suggestions: getSuggestions(currentInput)
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error generating WOWL response:', error);
      
      // Fallback message
      const errorMsg: Message = {
        id: `ai-error-${Date.now()}`,
        role: 'assistant',
        content: "Hoot! I'm having a little trouble. Can you try asking again? 🦉",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSuggestions = (context: string): string[] => {
    const allSuggestions = [
      "🎮 Show me a fun challenge",
      "💡 Give me a creative idea",
      "📚 Help me learn something new",
      "🎨 Suggest a building project",
      "🧩 Give me a puzzle to solve",
      "⚡ Quick brain break idea",
      "🎯 What should I work on next?",
      "🌟 Tell me something cool"
    ];
    
    // Randomly select 3-4 suggestions
    const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 2));
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Remove emoji and send as message
    const cleanSuggestion = suggestion.replace(/[^\w\s]/gi, '').trim();
    setInputMessage(cleanSuggestion);
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center group"
        >
          {/* Wowl Icon */}
          <div className="relative">
            <img 
              src={wowlAvatar} 
              alt="Wowl the Owl" 
              className="w-10 h-10 object-contain"
            />
            {/* Notification dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-white"
            />
          </div>

          {/* Tooltip */}
          <div className="absolute right-full mr-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with Wowl! 🦉
          </div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🦉</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Wowl the Owl</h3>
                  <p className="text-white/80 text-xs">Your AI Learning Buddy</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-cyan-50/50 to-purple-50/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                          : 'bg-white border-2 border-purple-200 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>

                    {/* Suggestions */}
                    {message.role === 'assistant' && message.suggestions && (
                      <div className="mt-2 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left px-3 py-2 bg-white border border-purple-200 rounded-xl text-sm text-gray-700 hover:border-purple-400 hover:bg-purple-50 transition-all"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm">Wowl is thinking...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Bar */}
            <div className="px-4 py-2 bg-purple-50 border-t border-purple-100 flex gap-2 overflow-x-auto">
              {[
                { icon: Lightbulb, label: 'Idea', message: 'Give me a creative idea' },
                { icon: Gamepad2, label: 'Game', message: 'Suggest a fun game' },
                { icon: Brain, label: 'Learn', message: 'Teach me something cool' },
                { icon: Zap, label: 'Break', message: 'I need a brain break' }
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setInputMessage(action.message);
                    handleSendMessage();
                  }}
                  className="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl hover:bg-purple-100 transition-colors flex-shrink-0"
                >
                  <action.icon className="w-5 h-5 text-purple-600" />
                  <span className="text-xs text-gray-600">{action.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-100 bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Wowl anything..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`px-4 py-3 rounded-xl transition-all ${
                    inputMessage.trim()
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}