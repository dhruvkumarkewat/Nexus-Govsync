import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { getIcon } from '../lib/IconMap';
import { fetchContent } from '../lib/api';
import ProblemScene from './ProblemScene';

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    fetchContent('problem').then(setContent).catch(() => {});
  }, []);

  const painPoints = content.filter((c) => c.kind === 'pain');
  const citizenIssues = content.filter((c) => c.kind === 'citizen');

  return (
    <section id="problem" ref={ref} className="relative bg-ink py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4">
            <motion.span
              className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              The Problem
            </motion.span>
            <motion.h2
              className="mt-3 font-serif text-3xl md:text-4xl text-paper leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Fragmented systems.<br />Real impact.
            </motion.h2>
            <motion.p
              className="mt-3 text-paper-2 text-sm leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Silos, incompatible formats, manual work and delays cost time, money and affect citizens.
            </motion.p>

            <div className="mt-8 grid gap-3">
              {painPoints.map((p, i) => {
                const Icon = getIcon(p.icon || 'CircleHelp');
                return (
                  <motion.div
                    key={p.id}
                    className="flex items-center gap-3 bg-ink-2/40 border border-ink-2/60 rounded-lg p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-ink-2/60 flex items-center justify-center text-gold">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-paper text-xs font-semibold">{p.title}</div>
                      <div className="text-paper-2 text-[10px] mt-0.5">{p.body}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <ProblemScene />
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              className="bg-ink-2/40 border border-ink-2/60 rounded-xl p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-paper text-xs font-semibold mb-3">Citizens Face</div>
              <div className="flex flex-col gap-3">
                {citizenIssues.map((c, i) => {
                  const Icon = getIcon(c.icon || 'CircleHelp');
                  return (
                    <motion.div
                      key={c.id}
                      className="flex items-start gap-2.5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    >
                      <div className="w-7 h-7 rounded-md bg-ink-2/60 flex items-center justify-center shrink-0 text-paper-2">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="text-paper text-xs font-medium">{c.title}</div>
                        <div className="text-paper-2 text-[10px] mt-0.5">{c.body}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
