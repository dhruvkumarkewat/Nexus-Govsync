import { Landmark, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-ink-2/40 py-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
            <span className="text-ink font-bold text-xs">GS</span>
          </div>
          <div>
            <div className="text-paper text-xs font-semibold">GovSync Nexus</div>
            <div className="text-paper-2 text-[10px]">An initiative for a digitally connected Bharat.</div>
          </div>
        </div>
        <div className="text-paper-2 text-xs flex items-center gap-1">
          Made with <Heart size={12} className="text-red-400 fill-red-400" /> in India
        </div>
        <div className="flex items-center gap-4 text-paper-2 text-xs">
          <a href="#" className="hover:text-gold transition-colors">Privacy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms</a>
          <a href="#" className="hover:text-gold transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
}
