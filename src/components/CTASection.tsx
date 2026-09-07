import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useUI } from './providers/UIProvider';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const { openModal } = useUI();

  return (
    <section id="cta" ref={ref} className="relative min-h-[70vh] overflow-hidden flex items-end">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img src="/images/cta-bhavan.jpg" alt="Rashtrapati Bhavan" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 w-full">
        <div className="grid md:grid-cols-2 gap-10 items-end">
          <div>
            <motion.h2
              className="font-serif text-3xl md:text-5xl text-paper leading-tight"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              Better together.<br />Built for Bharat.
            </motion.h2>
            <motion.p
              className="mt-3 text-paper-2 text-sm max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              GovSync Nexus is the digital bridge that powers seamless, inclusive and future-ready governance.
            </motion.p>
            <motion.div
              className="mt-6 flex items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button onClick={() => openModal('demo')} className="px-5 py-2.5 rounded-full bg-gold text-ink text-sm font-semibold hover:bg-gold-2 transition-colors flex items-center gap-2">
                Request Demo <ArrowRight size={14} />
              </button>
              <button onClick={() => openModal('demo')} className="px-5 py-2.5 rounded-full border border-paper/30 text-paper text-sm font-medium hover:bg-paper/10 transition-colors">
                Contact Sales
              </button>
            </motion.div>
          </div>

          <motion.div
            className="flex items-end justify-end gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="text-right">
              <div className="text-paper text-xs font-semibold">GovSync Nexus</div>
              <div className="text-paper-2 text-[10px]">An initiative for a digitally connected Bharat.</div>
            </div>
            <div className="text-paper-2 text-xs flex items-center gap-1">
              Made with <span className="text-red-400">♥</span> in India
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
