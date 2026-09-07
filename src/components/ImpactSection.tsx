import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { fetchMetrics, type Metric } from '../lib/api';

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => { if (inView) spring.set(value); }, [inView, spring, value]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

export default function ImpactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => { fetchMetrics('impact').then(setMetrics).catch(() => {}); }, []);

  const m = (key: string) => metrics.find((x) => x.key === key)?.value ?? 0;

  return (
    <section id="impact" ref={ref} className="relative bg-paper py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">Impact</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl text-ink">Measurable results. Real change.</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { key: 'applications', label: 'Applications Processed', prefix: '', suffix: 'K+' },
            { key: 'hours', label: 'Hours Saved', prefix: '', suffix: 'M+' },
            { key: 'departments', label: 'Departments Live', prefix: '', suffix: '+' },
            { key: 'satisfaction', label: 'Citizen Satisfaction', prefix: '', suffix: '%' },
          ].map((item, i) => (
            <motion.div
              key={item.key}
              className="bg-ink/5 border border-ink-2/10 rounded-xl p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-serif text-ink">
                <AnimatedNumber value={m(item.key)} prefix={item.prefix} suffix={item.suffix} />
              </div>
              <div className="text-ink-2 text-xs mt-2">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
