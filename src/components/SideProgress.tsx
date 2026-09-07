import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Home', num: '01' },
  { id: 'problem', label: 'The Problem', num: '02' },
  { id: 'how-it-works', label: 'How It Works', num: '03' },
  { id: 'platform', label: 'Platform', num: '04' },
  { id: 'workflow', label: 'Workflow', num: '05' },
  { id: 'security', label: 'Security', num: '06' },
  { id: 'impact', label: 'Impact', num: '07' },
  { id: 'cta', label: 'Get Started', num: '08' },
];

export default function SideProgress() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const rAF = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);

      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top);
        if (dist < bestDist) { bestDist = dist; best = i; }
      }
      setActive(best);
    };
    const tick = () => { onScroll(); rAF.current = requestAnimationFrame(tick); };
    rAF.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rAF.current);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col items-center w-16 pointer-events-none">
      <div className="relative h-full w-px bg-ink-2/40">
        <motion.div
          className="absolute left-0 top-0 w-px bg-gold"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      <div className="absolute inset-y-0 left-0 flex flex-col justify-center gap-6 pl-5">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`pointer-events-auto flex items-center gap-3 transition-all duration-300 ${active === i ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
          >
            <span className={`text-[10px] font-mono leading-none ${active === i ? 'text-gold' : 'text-paper-2'}`}>{s.num}</span>
            <span className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${active === i ? 'text-paper translate-x-0' : 'text-paper-2 -translate-x-1'}`}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
