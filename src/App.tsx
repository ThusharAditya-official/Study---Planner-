import { useRevisionLogic } from './hooks/useRevisionLogic';
import { ConceptCard } from './components/ConceptCard';
import { NotificationBell } from './components/NotificationBell';
import { AddConcept } from './components/AddConcept';
import { format } from 'date-fns';

export default function App() {
  const { concepts, addConcept, toggleRevision, deleteConcept, notificationCount } = useRevisionLogic();

  const activeConcepts = concepts.filter(c => !c.isArchived);
  const archivedConcepts = concepts.filter(c => c.isArchived);

  const groupedConcepts = activeConcepts.reduce((acc, concept) => {
    const dateStr = format(new Date(concept.originalDate), 'yyyy-MM-dd');
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(concept);
    return acc;
  }, {} as Record<string, typeof activeConcepts>);

  const sortedDates = Object.keys(groupedConcepts).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="min-h-screen bg-[#050506] text-slate-300 font-sans p-6 lg:p-8 flex flex-col selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Top Header Navigation */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
              NEURAL<span className="text-cyan-500">SYNC</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Cognitive Spaced Repetition</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex gap-6 text-xs font-bold tracking-widest uppercase text-slate-500">
            <span className="text-cyan-500 border-b border-cyan-500 pb-1 cursor-pointer">Dashboard</span>
            <span className="hover:text-white transition-colors cursor-pointer">Analytics</span>
            <span className="hover:text-white transition-colors cursor-pointer">Settings</span>
          </div>
          <NotificationBell count={notificationCount} />
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Active Revision Deck */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Active Cognitive Logs</h2>
            <div className="px-3 py-1 bg-cyan-500/10 rounded border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Total: {activeConcepts.length} Concepts
            </div>
          </div>

          <div className="space-y-6">
            {activeConcepts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-slate-800 rounded-2xl bg-[#0f1117]/50 shadow-inner">
                <div className="w-16 h-16 mb-4 rounded-full bg-[#050506] flex items-center justify-center border border-slate-800">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 animate-[spin_10s_linear_infinite]" />
                </div>
                <h3 className="text-xl font-medium text-slate-400 mb-2">No Active Logs</h3>
                <p className="text-slate-600 text-sm max-w-sm text-center">
                  Your neural pathways are clear. Initialize a new concept log to start optimizing your retention.
                </p>
              </div>
            ) : (
              sortedDates.map(dateStr => (
                <div key={dateStr} className="relative">
                  <div className="sticky top-0 bg-[#050506] py-2 z-10 flex items-center gap-4 mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                      Learned {format(new Date(dateStr), 'MMM dd, yyyy')}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-800"></div>
                  </div>
                  <div className="space-y-4">
                    {groupedConcepts[dateStr].map(concept => (
                      <ConceptCard 
                        key={concept.id} 
                        concept={concept} 
                        onToggle={toggleRevision}
                        onDelete={deleteConcept}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right: Sidebar Tools */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          <AddConcept onAdd={addConcept} />

          {/* Archive Section */}
          <div className="flex-1 bg-[#0f1117]/50 rounded-2xl border border-white/5 p-6 flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex justify-between items-center">
              Mastery Archive
              <span className="text-cyan-500">{archivedConcepts.length} Total</span>
            </h3>
            
            <div className="space-y-4 overflow-y-auto max-h-[400px] lg:max-h-[none] pr-2">
              {archivedConcepts.length === 0 ? (
                <p className="text-xs text-slate-600 italic">No mastered concepts yet. Complete all revisions to archive.</p>
              ) : (
                archivedConcepts.map((concept, i) => (
                  <div key={concept.id} className="flex justify-between items-center group cursor-default" style={{ opacity: Math.max(0.4, 1 - i * 0.15) }}>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[150px] sm:max-w-xs">{concept.title}</span>
                      <span className="text-[9px] uppercase tracking-tighter text-slate-600 mt-1">
                        Cleared {format(new Date(concept.revisions[concept.revisions.length - 1].date), 'MMM dd')}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center text-right">
                       <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-500 px-2 py-1 flex-shrink-0 rounded border border-cyan-500/20 uppercase">
                          {concept.revisions.length}/{concept.revisions.length} Cycles
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-auto pt-8">
              <div className="h-[2px] w-full bg-slate-800 mb-4 rounded overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all" 
                  style={{ width: concepts.length ? `${(archivedConcepts.length / concepts.length) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Total Mastery</span>
                <span className="text-white">
                  {concepts.length ? Math.round((archivedConcepts.length / concepts.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Micro-Bar */}
      <footer className="max-w-6xl w-full mx-auto mt-8 pt-4 pb-2 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-700 border-t border-white/5">
        <div className="flex gap-4">
          <span>SYSTEM: OPTIMAL</span>
          <span>LATENCY: 12ms</span>
        </div>
        <div className="flex gap-4 uppercase tracking-widest">
          <span>STORAGE: LOCAL_BROWSER</span>
          <span className="text-slate-500">Build v2.4.0_STABLE</span>
        </div>
      </footer>
    </div>
  );
}
