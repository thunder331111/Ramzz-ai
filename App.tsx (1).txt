
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Mode } from './types';
import { gemini } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import OwnerModal from './components/OwnerModal';

const HISTORY_KEY = 'ramzz_ultra_v7_data';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('standard');
  const [isTyping, setIsTyping] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setConversations(parsed);
          setActiveId(parsed[0].id);
        }
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(HISTORY_KEY, JSON.stringify(conversations));
  }, [conversations, isLoaded]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    let currentId = activeId;
    if (!currentId) {
      currentId = crypto.randomUUID();
      const newConv: Conversation = { id: currentId, title: content.slice(0, 40), messages: [], createdAt: Date.now() };
      setConversations(prev => [newConv, ...prev]);
      setActiveId(currentId);
    }

    const userMsg: Message = { role: 'user', content, timestamp: Date.now() };
    const tempAiMsg: Message = { role: 'model', content: '', timestamp: Date.now(), isStreaming: true };

    // Update UI dengan pesan user & placeholder pesan AI
    setConversations(prev => prev.map(c => 
      c.id === currentId ? { ...c, messages: [...c.messages, userMsg, tempAiMsg] } : c
    ));

    setIsTyping(true);
    let fullResponse = "";

    try {
      const activeConv = conversations.find(c => c.id === currentId);
      const history = activeConv ? [...activeConv.messages, userMsg] : [userMsg];
      
      const stream = gemini.generateStreamingResponse(history, mode);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setConversations(prev => prev.map(c => 
          c.id === currentId ? {
            ...c,
            messages: c.messages.map((m, idx) => 
              idx === c.messages.length - 1 ? { ...m, content: fullResponse } : m
            )
          } : c
        ));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConversations(prev => prev.map(c => 
        c.id === currentId ? {
          ...c,
          messages: c.messages.map((m, idx) => 
            idx === c.messages.length - 1 ? { ...m, isStreaming: false } : m
          )
        } : c
      ));
      setIsTyping(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen w-full bg-luxury text-white overflow-hidden animate-fade-in">
      <Sidebar 
        conversations={conversations} 
        activeId={activeId} 
        onSelect={setActiveId} 
        onNewChat={() => {
          const id = crypto.randomUUID();
          setConversations(prev => [{ id, title: 'Chat Baru', messages: [], createdAt: Date.now() }, ...prev]);
          setActiveId(id);
        }}
        onDelete={id => {
          setConversations(prev => prev.filter(c => c.id !== id));
          if (activeId === id) setActiveId(null);
        }}
      />

      <main className="flex-1 flex flex-col relative h-full">
        <header className="glass-panel px-6 md:px-12 py-6 border-b border-white/5 flex items-center justify-between z-50">
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">RAMZZ.AI <span className="text-[10px] ml-2 opacity-40 font-bold uppercase tracking-widest">v7.0</span></h1>
            {mode === 'owner' && <span className="bg-gold/10 border border-gold/20 text-gold text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase animate-pulse">Master View</span>}
          </div>
          <button 
            onClick={() => mode === 'owner' ? setMode('standard') : setShowOwnerModal(true)} 
            className={`px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 ${mode === 'owner' ? 'bg-gold text-black' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            {mode === 'owner' ? 'Exit Owner' : 'Owner Access'}
          </button>
        </header>

        <ChatArea 
          messages={conversations.find(c => c.id === activeId)?.messages || []} 
          isTyping={isTyping} 
          onSendMessage={handleSendMessage} 
          mode={mode} 
        />

        {showOwnerModal && (
          <OwnerModal onClose={() => setShowOwnerModal(false)} onSuccess={() => { setMode('owner'); setShowOwnerModal(false); }} />
        )}
      </main>
    </div>
  );
};

export default App;
