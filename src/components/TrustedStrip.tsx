import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../lib/IconMap';
import { fetchDepartments } from '../lib/api';

export default function TrustedStrip() {
  const [depts, setDepts] = useState<any[]>([]);
  useEffect(() => { fetchDepartments().then(setDepts).catch(() => {}); }, []);

  return (
    <section className="relative bg-paper border-y border-ink-2/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="shrink-0">
          <p className="text-ink text-xs md:text-sm font-medium leading-tight">Trusted by forward-thinking<br />departments across India</p>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex gap-8 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            {[...depts, ...depts].map((d, i) => {
              const Icon = getIcon(d.icon || 'Landmark');
              return (
                <div key={i} className="flex items-center gap-2 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                  <Icon size={18} className="text-ink-2" />
                  <span className="text-ink text-sm font-medium whitespace-nowrap">{d.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
