import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  MessageSquareOff
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatMessage, Task, Goal } from "../types";

interface AIChatPanelProps {
  chatHistory: ChatMessage[];
  loadingChat: boolean;
  onSendMessage: (text: string) => void;
  tasks: Task[];
  goals: Goal[];
}

export default function AIChatPanel({
  chatHistory,
  loadingChat,
  onSendMessage,
  tasks,
  goals
}: AIChatPanelProps) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null); // messageId of playing TTS
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition on mount if supported
  useEffect(() => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsRecording(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(prev => prev ? prev + " " + transcript : transcript);
          }
        };

        rec.onerror = (err: any) => {
          console.error("Speech recognition error:", err);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
        setSpeechSupported(true);
      }
    } catch (e) {
      console.warn("SpeechRecognition is not allowed or supported in this sandboxed context:", e);
      setSpeechSupported(false);
    }
  }, []);

  // Auto-scroll chats
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loadingChat]);

  const handleSend = () => {
    if (!inputText.trim() || loadingChat) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleToggleRecord = () => {
    if (!speechSupported) {
      // Simulate speech-to-text typing fallback as mock
      setIsRecording(true);
      setTimeout(() => {
        setInputText("Proactively summarize my high urgency tasks and goals.");
        setIsRecording(false);
      }, 1500);
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Start recording failed:", e);
      }
    }
  };

  // Convert text response to Audible audio voice using local synthesizer
  const speakText = (text: string, msgId: string) => {
    try {
      if ("speechSynthesis" in window) {
        if (isPlayingAudio === msgId) {
          window.speechSynthesis.cancel();
          setIsPlayingAudio(null);
          return;
        }

        window.speechSynthesis.cancel(); // cancel any active speech
        
        // Remove markdown headers and indicators to read cleanly
        const cleanString = text
          .replace(/[*#_`~[\]]/g, "")
          .replace(/- /g, " ")
          .slice(0, 300); // Read first 300 chars to avoid buffer fatigue

        const utterance = new SpeechSynthesisUtterance(cleanString);
        utterance.onend = () => {
          setIsPlayingAudio(null);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(null);
        };

        setIsPlayingAudio(msgId);
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn("Text-to-speech option not natively supported on this browser.");
      }
    } catch (e) {
      console.warn("Speech synthesis error or blocked by sandbox permissions:", e);
      setIsPlayingAudio(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[600px]" id="ai-chat-root">
      
      {/* Sidebar Coaching Header */}
      <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <Bot className="w-5 h-5 text-blue-400" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse"></span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Strategist Coach</h3>
            <p className="text-[10px] text-slate-500">Active context: {tasks.length} tasks synced</p>
          </div>
        </div>

        {/* Pulsating Speech Indicator */}
        {isRecording && (
          <div className="flex items-center space-x-1" id="voice-waves">
            <span className="w-1 h-3 bg-blue-450 rounded-full animate-bounce [animation-delay:0.1s]"></span>
            <span className="w-1 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
            <span className="w-1 h-3 bg-blue-450 rounded-full animate-bounce [animation-delay:0.5s]"></span>
          </div>
        )}
      </div>

      {/* Messages listing window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar bg-slate-50/50" id="chat-messages-container">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-slate-400 py-12">
            <Bot className="w-10 h-10 text-blue-500 stroke-1" />
            <div className="space-y-1 max-w-sm">
              <p className="text-sm font-bold text-slate-800">Your AI Active Companion</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Hi! Ready to optimize your executive focus. I can suggest optimal slots, decompose obstacles into actionable checklists, or compose unblocking email followups customized for you.
              </p>
            </div>
            
            {/* Quick Helper Prompts */}
            <div className="grid grid-cols-1 gap-2 pt-2 max-w-sm w-full">
              <button 
                onClick={() => setInputText("Break down: Make final financial sheets by Friday")}
                className="text-left text-xs bg-white border border-slate-200 hover:border-blue-200/60 hover:bg-blue-50/20 p-2.5 rounded-xl transition text-slate-650 font-medium"
              >
                📝 &quot;Break down: Make final financial sheets...&quot;
              </button>
              <button 
                onClick={() => setInputText("What tasks do I have due tomorrow?")}
                className="text-left text-xs bg-white border border-slate-200 hover:border-blue-200/60 hover:bg-blue-50/20 p-2.5 rounded-xl transition text-slate-650 font-medium"
              >
                ⏰ &quot;What tasks do I have due tomorrow?&quot;
              </button>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isAI ? "self-start flex-row" : "ml-auto flex-row-reverse"
                }`}
                id={`chat-bubble-${msg.id}`}
              >
                {/* Avatar Icon */}
                <div className={`p-2 rounded-xl flex-shrink-0 h-9 w-9 flex items-center justify-center ${
                  isAI 
                    ? "bg-blue-50 text-blue-700 border border-blue-100" 
                    : "bg-slate-900 text-white"
                }`}>
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble details */}
                <div className="space-y-2">
                  <div className={`p-3 rounded-2xl shadow-sm border text-xs leading-relaxed ${
                    isAI 
                      ? "bg-white border-slate-200/80 text-slate-800 rounded-tl-none font-medium" 
                      : "bg-blue-600 border-blue-600 text-white rounded-tr-none font-bold"
                  }`}>
                    {isAI ? (
                      <div className="markdown-body">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>

                  {/* Bubble audio tts tools for AI responses */}
                  {isAI && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-semibold transition ${
                          isPlayingAudio === msg.id
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                        title="Voice Read-out"
                        id={`tpl-speech-btn-${msg.id}`}
                      >
                        {isPlayingAudio === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read audibly</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {isAI && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            setInputText(sug);
                            // Optionally send it instantly
                          }}
                          className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/30 px-2.5 py-1.5 rounded-xl transition-all"
                          id={`sug-chip-${sIdx}`}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Generating AI streaming/waiting state */}
        {loadingChat && (
          <div className="flex gap-3 max-w-[85%] self-start" id="chat-bubble-loading">
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-750 h-9 w-9 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
            </div>
            <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-slate-200/80 shadow-sm flex items-center space-x-1.5 text-xs py-4 text-slate-500">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="pl-1 font-medium animate-pulse">Gemini formulated actionable outlines...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Tray Row */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5 rounded-b-2xl" id="chat-input-tray">
        <button
          onClick={handleToggleRecord}
          className={`p-3.5 rounded-xl border flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-rose-50 border-rose-200 text-rose-600 ring-2 ring-rose-500/10' 
              : 'bg-white border-slate-200/80 text-slate-500 hover:text-slate-800'
          }`}
          title={speechSupported ? "Talk with Coach (Speech Typing)" : "Simulate Speech Transcription Input"}
          id="toggle-coacing-record-btn"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input 
          type="text"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isRecording ? "Listening to your voice..." : "Ask your AI Coach to draft a message, breakdown a task, or analyze goals..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loadingChat}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
          id="chat-text-input"
        />

        <button 
          onClick={handleSend}
          disabled={!inputText.trim() || loadingChat}
          className="bg-slate-900 border hover:bg-slate-800 text-white p-3 px-4 rounded-xl flex items-center justify-center disabled:opacity-50 transition"
          id="chat-send-btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
