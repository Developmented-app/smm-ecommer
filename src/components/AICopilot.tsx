import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, X, ChevronRight, User, AlertCircle } from 'lucide-react';

interface SMMService {
  id: string;
  name: string;
  price: number;
}

interface AICopilotProps {
  services: SMMService[];
  authToken: string;
  lang: 'en' | 'km';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AICopilot({ services, authToken, lang }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: lang === 'en' 
        ? "👋 Welcome SMM Partner! I'm your AI Campaign Copilot, fueled by Google Gemini. Ask me how to map out a viral strategy or compile an affordable follower/view bundle using our SMM panel services!"
        : "👋 សូមស្វាគមន៍ដៃគូ SMM! ខ្ញុំជា AI Campaign Copilot ដំណើរការដោយ Google Gemini។ សួរខ្ញុំពីរបៀបរៀបចំយុទ្ធសាស្ត្រល្បឿនលឿន ឬបង្កើតកញ្ចប់ការលក់ដ៏ថោកបំផុត!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestQueries = [
    {
      label: lang === 'en' ? '🚀 Boost TikTok Viral' : '🚀 ជំរុញទំព័រ TikTok ឱ្យល្បី',
      prompt: "Recommend a viral push strategy for my TikTok reels and profile under a budget of $15 USD. Tell me what SMM services to buy."
    },
    {
      label: lang === 'en' ? '💎 Best FB Post Package' : '💎 កញ្ចប់ហ្វេសប៊ុកល្អបំផុត',
      prompt: "I have a new Cambodian business Facebook Page. What services should I order to look highly established instantly?"
    },
    {
      label: lang === 'en' ? '📹 Secure YT Monetization' : '📹 យុទ្ធសាស្ត្ររកលុយ YouTube',
      prompt: "Help me strategize getting my YouTube channel to 1,000 subscribers and build real AdSense watch hours safely."
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          prompt: textToSend,
          context: { services: services.map(s => ({ id: s.id, name: s.name, price: s.price })) }
        })
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || 'Failed to communicate with AI');
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Sorry, I had trouble planning: ${err.message}. Make sure your Gemini server coordinates are fully set up.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Sparkles Trigger Button */}
      <button
        id="trigger-ai-copilot"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-yellow-200" />
        <span className="text-sm font-black tracking-wider uppercase hidden sm:inline pr-1">
          {lang === 'en' ? 'AI SMM Copilot' : 'AI ជំនួយការ'}
        </span>
      </button>

      {/* AI Assistant Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-[420px] bg-white shadow-2xl flex flex-col border-l border-slate-100 transition-transform duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-navy-950 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm tracking-tight leading-none">Angkor AI Copilot</h3>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  {lang === 'en' ? 'Powered by Gemini AI' : 'ជំនួយដោយ Gemini AI'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-red-100 border border-red-200 text-red-600' 
                    : 'bg-indigo-100 border border-indigo-200 text-indigo-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`rounded-2xl p-3 text-sm text-left shadow-sm relative ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-red-600 to-red-700 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-line'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className={`text-[9px] block text-right mt-1.5 ${
                    msg.role === 'user' ? 'text-red-200' : 'text-slate-400 font-mono'
                  }`}>{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-3.5 border border-slate-100 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Queries Suggestion Container */}
          <div className="p-3 bg-white border-t border-slate-100 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-left">
              {lang === 'en' ? 'Quick Plan Starters:' : 'គំនិតផ្តើមរហ័ស:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestQueries.map((suggest, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(suggest.prompt)}
                  disabled={isSending}
                  className="text-[11px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-100/50 rounded-lg px-2.5 py-1.5 transition-all text-left truncate max-w-full cursor-pointer disabled:opacity-50"
                >
                  {suggest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'en' ? "Formulate the model's instructions..." : "សួរយុទ្ធសាស្ត្រ SMM..."}
                disabled={isSending}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
