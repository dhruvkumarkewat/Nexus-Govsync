import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchContent, type ContentBlock } from '../lib/api';
import { getIcon } from '../lib/IconMap';

export default function WorkflowSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.3'] });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [steps, setSteps] = useState<ContentBlock[]>([]);

  useEffect(() => { fetchContent('workflow', 'step').then(setSteps).catch(() => {}); }, []);

  return (
    <section id="workflow" ref={ref} className="relative bg-paper py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <motion.span
              className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              End-to-End Workflow
            </motion.span>
            <motion.h2
              className="mt-3 font-serif text-3xl md:text-4xl text-ink leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              From request<br />to resolution.
            </motion.h2>
            <motion.p
              className="mt-3 text-ink-2 text-sm leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Automated orchestration ensures the right data reaches the right department at the right time—every time.
            </motion.p>
            <motion.button
              className="mt-6 px-5 py-2.5 rounded-full border border-ink-2/40 text-ink text-sm font-medium hover:bg-ink/5 transition-colors flex items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              View Workflow Demo <ArrowRight size={14} />
            </motion.button>
          </div>

          <div className="lg:col-span-8">
            <div className="relative">
              <div className="absolute top-[40px] left-0 right-0 h-px bg-ink-2/20 hidden lg:block" />
              <motion.div
                className="absolute top-[40px] left-0 h-px bg-gold hidden lg:block"
                style={{ width: lineWidth }}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {steps.map((s, i) => {
                  const Icon = getIcon(s.icon || 'CircleHelp');
                  return (
                    <motion.div
                      key={s.id}
                      className="relative"
                      initial={{ opacity: 0, y: 24 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-ink/5 border border-ink-2/20 flex items-center justify-center mb-3">
                        <Icon size={18} className="text-ink-2" />
                      </div>
                      <div className="text-ink text-xs font-semibold">{s.title}</div>
                      <div className="text-ink-2 text-[10px] mt-1 leading-snug">{s.body}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
