import { useState } from 'react';
import { cn } from '../lib/utils';

interface AddConceptProps {
  onAdd: (title: string, intervalType: 3 | 5) => void;
}

export const AddConcept = ({ onAdd }: AddConceptProps) => {
  const [title, setTitle] = useState('');
  const [interval, setInterval] = useState<3 | 5>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), interval);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#14161c] p-6 rounded-2xl border border-white/5 shadow-2xl">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">New Concept Input</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter learned concept..."
          className="w-full bg-[#050506] border border-slate-800 rounded-lg p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setInterval(3)}
            className={cn(
              "flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all",
              interval === 3 
                ? "bg-cyan-500 text-black hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                : "bg-slate-800 text-white border border-slate-700 hover:border-slate-500"
            )}
          >
            3 Steps
          </button>
          <button
            type="button"
            onClick={() => setInterval(5)}
            className={cn(
              "flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all",
              interval === 5 
                ? "bg-cyan-500 text-black hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                : "bg-slate-800 text-white border border-slate-700 hover:border-slate-500"
            )}
          >
            5 Steps
          </button>
        </div>
        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-4 focus:ring-cyan-500/30"
        >
          Initialize Log
        </button>
      </div>
    </form>
  );
};
