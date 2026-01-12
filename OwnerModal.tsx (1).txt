
import React, { useState } from 'react';

interface OwnerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const OwnerModal: React.FC<OwnerModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'ramzz') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 animate-fade-in">
      <div className={`w-full max-w-md glass-panel p-12 rounded-[4rem] border-2 transition-all duration-500 ${error ? 'border-red-500 animate-pulse' : 'border-gold/20'}`}>
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 bg-gold/10 border-2 border-gold rounded-[2rem] flex items-center justify-center mb-8 shadow-3xl shadow-gold/10">
             <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Authority</h2>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mt-4">Security Protocol 091-Alpha</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input 
            autoFocus 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-6 outline-none focus:border-gold text-center tracking-[1.5em] text-3xl font-black text-white transition-all placeholder:tracking-normal placeholder:text-slate-800" 
            placeholder="••••" 
          />
          <button type="submit" className="w-full py-6 rounded-[1.5rem] bg-gold text-black font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gold/20">Authorize</button>
          <button type="button" onClick={onClose} className="w-full text-slate-700 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors">Abort Access</button>
        </form>
      </div>
    </div>
  );
};

export default OwnerModal;
