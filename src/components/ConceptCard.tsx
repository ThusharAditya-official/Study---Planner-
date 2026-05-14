import { isBefore, format, startOfDay, addDays } from 'date-fns';
import { Concept } from '../types';
import { cn } from '../lib/utils';
import { Trash2 } from 'lucide-react';

interface ConceptCardProps {
  concept: Concept;
  onToggle: (conceptId: string, revisionIndex: number) => void;
  onDelete: (conceptId: string) => void;
}

export const ConceptCard = ({ concept, onToggle, onDelete }: ConceptCardProps) => {
  const today = startOfDay(new Date());
  const isConceptOverdue = concept.revisions.some(rev => !rev.isCompleted && isBefore(new Date(rev.date), today));

  return (
    <div className={cn(
      "bg-[#0f1117] border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all shadow-xl group relative overflow-hidden",
      isConceptOverdue && "border-l-4 border-l-rose-500"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className="pr-4">
          <h3 className="text-white font-bold text-xl tracking-tight mb-1">{concept.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {isConceptOverdue ? (
            <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded">OVERDUE</span>
          ) : (
            <span className="text-[10px] font-black text-cyan-400 border border-cyan-400/30 px-2 py-1 rounded uppercase tracking-tighter">In Progress</span>
          )}
          <button 
            onClick={() => onDelete(concept.id)}
            className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 mt-1"
            title="Delete concept"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {concept.revisions.map((rev, idx) => {
          const revDate = new Date(rev.date);
          const isRevOverdue = !rev.isCompleted && isBefore(revDate, today);
          const isDueNow = !rev.isCompleted && !isRevOverdue && isBefore(revDate, addDays(today, 2));

          return (
            <button
              key={idx}
              onClick={() => onToggle(concept.id, idx)}
              className={cn(
                "w-12 h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-300 relative group/btn",
                rev.isCompleted 
                  ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:brightness-110" 
                  : isRevOverdue 
                  ? "bg-rose-500/20 border-2 border-rose-500 text-rose-500 shadow-[inset_0_0_10px_rgba(244,63,94,0.1)] hover:bg-rose-500/30"
                  : isDueNow
                  ? "bg-slate-800 border-2 border-cyan-500 text-cyan-400 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)] hover:bg-slate-700"
                  : "bg-slate-800 border border-slate-700 text-slate-600 hover:border-cyan-500/50 hover:text-cyan-400"
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {rev.label}
              </span>
              {rev.isCompleted ? (
                 <span className="text-lg font-black">✓</span>
              ) : isRevOverdue ? (
                 <span className="text-lg font-black">!</span>
              ) : isDueNow ? (
                 <span className="text-[10px] font-black mt-1 uppercase">Due Now</span>
              ) : (
                 <span className="text-[10px] font-bold mt-1 text-slate-400 group-hover/btn:text-cyan-400">{format(revDate, 'MM/dd')}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
