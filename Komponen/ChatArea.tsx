
import React, { useState, useRef, useEffect } from 'react';
import { Message, Mode } from '../types';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  mode: Mode;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping, onSendMessage, mode }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 py-12 space-y-12 max-w-5xl mx-auto w-full custom-scroll scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-fade-in">
            <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-3xl animate-float ${mode === 'owner' ? 'bg-black border-2 border-gold text-gold shadow-gold/20' : 'bg-accent text-white shadow-accent/20'}`}>
              <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
                {mode === 'owner' ? <span className="text-gold">MASTER</span> : 'RAMZZ'}<span className="opacity-10">.AI</span>
              </h2>
              <p className="text-slate-500 text-xl font-medium tracking-wide">Elite Intelligence for the Modern Era.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
              {['Bikin rencana startup tech yang gila', 'Jelasin Quantum Computing pake bahasa Jaksel', 'Strategi marketing luxury brand 2025', 'Coding Landing Page mewah pake React'].map(q => (
                <button key={q} onClick={() => onSendMessage(q)} className="p-7 glass-panel rounded-3xl text-sm font-bold text-left hover:border-gold/30 transition-all hover:scale-[1.02] active:scale-95 border border-white/5">"{q}"</button>
              ))}
            </div>
          </div>
        ) : (
          messages.filter(m => m.content || m.isStreaming).map((m, idx) => (
            <div key={idx} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[90%] md:max-w-[80%] flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center text-[10px] font-black border-2 transition-all ${m.role === 'user' ? 'bg-accent border-white/10' : (mode === 'owner' ? 'bg-black border-gold text-gold shadow-gold/20' : 'bg-slate-900 border-white/5 text-slate-400')}`}>
                  {m.role === 'user' ? 'YOU' : 'RZ'}
                </div>
                <div className={`p-6 md:p-8 rounded-[2rem] shadow-2xl text-[17px] leading-[1.8] markdown-body ${m.role === 'user' ? 'bg-accent text-white rounded-tr-none' : `glass-panel text-slate-100 rounded-tl-none`}`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.isStreaming && <span className="inline-block w-2 h-5 bg-gold ml-1 animate-pulse align-middle"></span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 md:p-14 relative z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className={`glass-panel p-2.5 rounded-[3rem] border-2 transition-all duration-700 flex items-center ${mode === 'owner' ? 'border-gold/30 shadow-2xl shadow-gold/5' : 'border-white/5 focus-within:border-accent/50 focus-within:shadow-2xl focus-within:shadow-accent/5'}`}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={mode === 'owner' ? "Perintah Anda, Boss?" : "Ketik pesan untuk Ramzz..."} 
              className="flex-1 bg-transparent px-8 py-5 outline-none text-white font-medium text-lg placeholder-slate-800" 
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping} 
              className={`p-6 rounded-[2rem] transition-all transform active:scale-90 ${input.trim() && !isTyping ? (mode === 'owner' ? 'bg-gold text-black shadow-gold/40' : 'bg-accent text-white shadow-accent/40') : 'bg-white/5 text-slate-800'}`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7M5 12h14" /></svg>
            </button>
          </form>
          <div className="flex justify-center gap-8 mt-8 opacity-20">
             <span className="text-[10px] font-black tracking-[0.4em] uppercase">Ultra Low Latency</span>
             <span className="text-[10px] font-black tracking-[0.4em] uppercase">Neural Engine v7</span>
             <span className="text-[10px] font-black tracking-[0.4em] uppercase">Deep Logic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
