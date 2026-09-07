import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchContent, type ContentBlock } from '../lib/api';
import { getIcon } from '../lib/IconMap';

export default function SecuritySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [features, setFeatures] = useState<ContentBlock[]>([]);

  useEffect(() => { fetchContent('security', 'feature').then(setFeatures).catch(() => {}); }, []);

  return (
    <section id="security" ref={ref} className="relative bg-ink py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <motion.span
              className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Trusted. Secure. Compliant.
            </motion.span>
            <motion.h2
              className="mt-3 font-serif text-3xl md:text-4xl text-paper leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Security by design.<br />Privacy by default.
            </motion.h2>
            <motion.p
              className="mt-3 text-paper-2 text-sm leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              End-to-end encryption, purpose-based access, consent-driven sharing and complete auditability.
            </motion.p>
            <motion.button
              className="mt-6 px-5 py-2.5 rounded-full border border-paper/20 text-paper text-sm font-medium hover:bg-paper/10 transition-colors flex items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Learn About Security <ArrowRight size={14} />
            </motion.button>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {features.map((f, i) => {
                const Icon = getIcon(f.icon || 'Shield');
                return (
                  <motion.div
                    key={f.id}
                    className="bg-ink-2/40 border border-ink-2/60 rounded-lg p-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-md bg-ink-2/60 flex items-center justify-center text-gold mb-2">
                      <Icon size={16} />
                    </div>
                    <div className="text-paper text-xs font-semibold">{f.title}</div>
                    <div className="text-paper-2 text-[10px] mt-0.5">{f.body}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7" ref={imgRef}>
            <motion.div
              className="relative rounded-2xl overflow-hidden border border-ink-2/40"
              style={{ y }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1 }}
            >
              <img src="/images/vault.jpg" alt="Vault" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-paper text-xs font-semibold mb-1">Zero-Trust Architecture</div>
                <div className="text-paper-2 text-[10px]">Every request authenticated. Every action logged.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
