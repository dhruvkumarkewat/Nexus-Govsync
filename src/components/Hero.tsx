import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useUI } from './providers/UIProvider';
import { getIcon } from '../lib/IconMap';

const departmentCards = [
  { name: 'Revenue Department', sub: 'Income Data', color: '#38bdf8', icon: 'Landmark' },
  { name: 'Education Department', sub: 'Education Data', color: '#34d399', icon: 'GraduationCap' },
  { name: 'Welfare Department', sub: 'Benefit Processing', color: '#fbbf24', icon: 'HeartHandshake' },
  { name: 'Municipal Corporation', sub: 'Property & Civic', color: '#a78bfa', icon: 'Building2' },
  { name: 'Transport Department', sub: 'Vehicle Records', color: '#f87171', icon: 'Bus' },
  { name: 'Health Department', sub: 'Health Records', color: '#fb7185', icon: 'Stethoscope' },
];

export default function Hero() {
  const { openModal } = useUI();
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(mx, [-300, 300], [8, -8]), { stiffness: 40, damping: 20 });
  const ry = useSpring(useTransform(my, [-300, 300], [-8, 8]), { stiffness: 40, damping: 20 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mx.set(e.clientX - rect.left - rect.width / 2);
      my.set(e.clientY - rect.top - rect.height / 2);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <img src="/images/hero.jpg" alt="India Gate" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-2 gap-12 items-center py-24">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">AI-Assisted Interoperability Platform</span>
          </motion.div>
          <motion.h1
            className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-paper leading-[1.1]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Don’t replace <br /> government systems.<br />
            <span className="text-gold">Make them talk</span> to each other.
          </motion.h1>
          <motion.p
            className="mt-5 text-paper-2 max-w-md text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            GovSync Nexus connects independent government systems securely, intelligently and at scale—so Bharat can deliver better services, faster.
          </motion.p>
          <motion.div
            className="mt-7 flex items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <button onClick={() => openModal('demo')} className="px-5 py-2.5 rounded-full bg-paper text-ink text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2">
              Explore Platform <ArrowRight size={14} />
            </button>
            <button onClick={() => openModal('video')} className="px-5 py-2.5 rounded-full border border-paper/30 text-paper text-sm font-medium hover:bg-paper/10 transition-colors flex items-center gap-2">
              <Play size={14} /> Watch Overview
            </button>
          </motion.div>
        </div>

        <motion.div
          className="relative hidden lg:flex items-center justify-center"
          style={{ perspective: 1000, rotateX: rx, rotateY: ry }}
        >
          <div className="relative w-[420px] h-[420px]">
            <div className="absolute inset-0 rounded-full border border-gold/20" />
            <div className="absolute inset-6 rounded-full border border-gold/10" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-40 bg-ink/80 backdrop-blur-xl border border-gold/30 rounded-xl p-3 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-gold flex items-center justify-center">
                    <span className="text-ink font-bold text-[10px]">GS</span>
                  </div>
                  <div>
                    <div className="text-paper text-xs font-semibold">GovSync Nexus</div>
                    <div className="text-[10px] text-paper-2">Interoperability Layer</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-ink-2 overflow-hidden">
                  <motion.div className="h-full bg-gold" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, delay: 0.8 }} />
                </div>
              </div>
            </div>

            {departmentCards.map((d, i) => {
              const angle = (i / departmentCards.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 175;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const Icon = getIcon(d.icon);
              return (
                <motion.div
                  key={d.name}
                  className="absolute left-1/2 top-1/2"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                  animate={{ x: x - 85, y: y - 30, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                >
                  <div className="w-[170px] bg-ink/70 backdrop-blur-lg border border-ink-2/60 rounded-lg p-3 shadow-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${d.color}22`, color: d.color }}>
                        <Icon size={14} />
                      </div>
                      <div className="text-paper text-xs font-medium leading-tight">{d.name}</div>
                    </div>
                    <div className="text-[10px] text-paper-2">{d.sub}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
