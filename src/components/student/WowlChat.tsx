import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Mic, MicOff, Send, Sparkles, Video, Gamepad2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  generateGreeting,
  generateEncouragement,
  generateTeachingMoment,
  generateFeedback,
  generateShortStory,
  mirrorTone,
  detectMood,
  respondToMood,
  StudentProfile,
  WowlMessage,
  getVideoForSkill,
  getGameForSkill,
  rememberDetail,
  generateADHDMessage,
} from '../../lib/wowl-personality';

interface WowlChatProps {
  studentProfile: StudentProfile;
  onUpdateProfile?: (profile: StudentProfile) => void;
}

export default function WowlChat({ studentProfile, onUpdateProfile }: WowlChatProps) {
  const [messages, setMessages] = useState<WowlMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    // Send initial greeting
    const timeOfDay = getTimeOfDay();
    const greeting = generateGreeting(studentProfile, timeOfDay);
    setMessages([greeting]);

    // If student has ADHD, add supportive message
    if (studentProfile.hasADHD) {
      setTimeout(() => {
        const adhdMsg = generateADHDMessage(studentProfile.preferredSessionLength || 15);
        addMessage(adhdMsg);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Auto-speak new messages
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type !== 'question' || !isListening) {
        speakMessage(lastMessage.text);
      }
    }
  }, [messages, autoSpeak]);

  // ==================== SPEECH FUNCTIONS ====================

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.15; // Child-friendly, warm
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // ==================== MESSAGE HANDLING ====================

  const addMessage = (message: WowlMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: WowlMessage = {
      id: `user-${Date.now()}`,
      text: inputText,
      type: 'question',
      emoji: '👤',
    };
    addMessage(userMessage);

    // Detect mood and respond
    const mood = detectMood(inputText);
    const moodResponse = respondToMood(mood);

    // Generate Wowl's response
    setTimeout(() => {
      let response = generateIntelligentResponse(inputText);
      response = mirrorTone(inputText, response);

      const wowlMessage: WowlMessage = {
        id: `wowl-${Date.now()}`,
        text: response,
        type: 'teaching',
        emoji: '🦉',
      };
      addMessage(wowlMessage);

      // Add mood response if needed
      if (mood !== 'neutral') {
        setTimeout(() => {
          addMessage({
            id: `mood-${Date.now()}`,
            text: moodResponse,
            type: 'encouragement',
            emoji: '💙',
          });
        }, 1000);
      }
    }, 800);

    setInputText('');
  };

  const generateIntelligentResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Check for personal info
    if (lowerInput.includes('my favorite') || lowerInput.includes('i like')) {
      // Extract and remember
      if (lowerInput.includes('animal')) {
        const animal = extractAfter(input, 'animal is') || extractAfter(input, 'animals are');
        if (animal && onUpdateProfile) {
          const updated = rememberDetail(studentProfile, 'animal', animal);
          onUpdateProfile(updated);
        }
        return `Oh, I LOVE ${animal || 'animals'} too! 🦁 I'll remember that about you!`;
      }
    }

    // Check for help requests
    if (lowerInput.includes('help') || lowerInput.includes('don\'t understand')) {
      return `No problem! 💙 Let me explain it a different way. What part is confusing?`;
    }

    // Check for struggle indicators
    if (lowerInput.includes('hard') || lowerInput.includes('difficult') || lowerInput.includes('can\'t')) {
      return generateEncouragement('struggling').text;
    }

    // Check for success indicators
    if (lowerInput.includes('did it') || lowerInput.includes('got it') || lowerInput.includes('done')) {
      return generateEncouragement('success').text;
    }

    // Default encouraging response
    return `That's a great question! 🤔 Let me think about the best way to help you with that...`;
  };

  const extractAfter = (text: string, phrase: string): string | null => {
    const index = text.toLowerCase().indexOf(phrase);
    if (index === -1) return null;
    const after = text.substring(index + phrase.length).trim();
    return after.split(' ')[0].replace(/[.,!?]/g, '');
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // ==================== TEACHING ACTIONS ====================

  const showVideoForSkill = (skill: string) => {
    const videoUrl = getVideoForSkill(skill);
    if (videoUrl) {
      setCurrentVideo(videoUrl);
      setShowVideo(true);

      const videoMessage: WowlMessage = {
        id: `video-${Date.now()}`,
        text: `Check out this video! 📺 It explains ${skill} perfectly!`,
        type: 'teaching',
        emoji: '🎬',
        includesVideo: true,
        videoUrl,
      };
      addMessage(videoMessage);
    }
  };

  const launchGameForSkill = (skill: string) => {
    const gameUrl = getGameForSkill(skill);
    if (gameUrl) {
      const gameMessage: WowlMessage = {
        id: `game-${Date.now()}`,
        text: `Let's practice with a fun game! 🎮 Try this and show me what you learned!`,
        type: 'teaching',
        emoji: '🕹️',
        includesGame: true,
        gameUrl,
      };
      addMessage(gameMessage);

      // Open game in new tab
      window.open(gameUrl, '_blank');
    }
  };

  // ==================== DEMO TEACHING MOMENT ====================

  const triggerTeachingMoment = () => {
    const gap = 'letter sounds';
    const teachingMsg = generateTeachingMoment(gap);
    addMessage(teachingMsg);

    // Show video after a moment
    setTimeout(() => {
      showVideoForSkill('letter-sounds');
    }, 2000);

    // Suggest game after video
    setTimeout(() => {
      launchGameForSkill('phonics-practice');
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-5xl"
          >
            🦉
          </motion.div>
          <div>
            <h2 className="text-xl font-bold">Wowl</h2>
            <p className="text-xs text-purple-100">Your learning buddy</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={() => setAutoSpeak(!autoSpeak)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isWowl = message.type !== 'question' || message.emoji === '🦉';

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${isWowl ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    isWowl
                      ? 'bg-white border-2 border-purple-200'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  } rounded-2xl p-4 shadow-lg`}
                >
                  {/* Avatar + Name */}
                  {isWowl && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{message.emoji || '🦉'}</span>
                      <span className="font-bold text-purple-900">Wowl</span>
                    </div>
                  )}

                  {/* Message Text with Emojis */}
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>

                  {/* Video Embed */}
                  {message.includesVideo && message.videoUrl && (
                    <div className="mt-4">
                      <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-900">Watch & Learn</span>
                        </div>
                        <iframe
                          src={message.videoUrl}
                          className="w-full h-48 rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Game Link */}
                  {message.includesGame && message.gameUrl && (
                    <div className="mt-4">
                      <Button
                        onClick={() => window.open(message.gameUrl, '_blank')}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-full"
                      >
                        <Gamepad2 className="w-5 h-5 mr-2" />
                        Play Practice Game
                      </Button>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-4 border-purple-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type or speak your answer..."
            className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
          />

          {/* Voice Input */}
          <Button
            onClick={isListening ? stopListening : startListening}
            size="lg"
            className={`${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {/* Send */}
          <Button
            onClick={handleSendMessage}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            disabled={!inputText.trim()}
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>

        {/* Demo Teaching Button */}
        <div className="mt-3">
          <Button
            onClick={triggerTeachingMoment}
            variant="outline"
            size="sm"
            className="w-full border-2 border-purple-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Demo: Trigger Teaching Moment
          </Button>
        </div>
      </div>

      {/* Speech Indicator */}
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Volume2 className="w-5 h-5" />
          </motion.div>
          <span className="font-semibold">Wowl is speaking...</span>
        </motion.div>
      )}

      {/* Listening Indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Mic className="w-6 h-6" />
          </motion.div>
          <span className="font-bold text-lg">Listening...</span>
        </motion.div>
      )}
    </div>
  );
}
