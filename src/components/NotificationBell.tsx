import { Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationBellProps {
  count: number;
}

export const NotificationBell = ({ count }: NotificationBellProps) => (
  <div className="relative">
    <div className="p-2 bg-slate-900 rounded-full border border-slate-800 hover:border-cyan-500 transition-all cursor-pointer group">
      <Bell 
        className={cn(
          "w-6 h-6 transition-colors",
          count > 0 ? "text-slate-400 group-hover:text-cyan-400" : "text-slate-500 group-hover:text-slate-400"
        )} 
      />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-black text-black ring-4 ring-[#050506] shadow-[0_0_10px_rgba(6,182,212,0.6)] z-10"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  </div>
);
