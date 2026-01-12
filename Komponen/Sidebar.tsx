
import React from 'react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeId, onSelect, onNewChat, onDelete }) => {
  return (
    <aside className="w-80 h-full glass-panel border-r border-white/5 hidden lg:flex flex-col z-50">
      <div className="p-10">
        <button 
          onClick={onNewChat}
          className="w-full bg-accent hover:bg-accent/90 text-white p-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-accent/20 active:scale-95 flex items-center justify-center gap-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg>
          New Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-3 custom-scroll">
        <div className="px-4 mb-6">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural History</span>
        </div>
        {conversations.map(c => (
          <div 
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group flex items-center justify-between p-5 rounded-[1.5rem] cursor-pointer transition-all border ${activeId === c.id ? 'bg-white/5 border-white/10 text-white' : 'text-slate-500 border-transparent hover:bg-white/5'}`}
          >
            <span className="text-sm font-bold truncate pr-4 uppercase tracking-tighter">{c.title || 'Untitled Session'}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all transform hover:rotate-90"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="p-10 border-t border-white/5 bg-black/50">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-tr from-accent to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-2xl shadow-accent/20">RZ</div>
          <div>
            <p className="text-xs font-black uppercase text-white tracking-[0.2em]">Tier One Elite</p>
            <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Global Access v7</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
