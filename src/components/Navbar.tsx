import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useUI } from './providers/UIProvider';
import { useNavigate } from 'react-router-dom';

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Use Cases', href: '#workflow' },
  { label: 'Solutions', href: '#how-it-works' },
  { label: 'Resources', href: '#impact' },
  { label: 'About', href: '#security' },
];

export default function Navbar() {
  const { theme, toggleTheme, openModal } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ink/70 backdrop-blur-xl border-b border-ink-2/40' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
            <span className="text-ink font-bold text-xs tracking-widest">GS</span>
          </div>
          <span className="text-paper font-semibold text-sm tracking-tight">GovSync Nexus</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button key={l.label} onClick={() => scrollTo(l.href)} className="text-paper-2 hover:text-gold text-sm transition-colors cursor-pointer">
              {l.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-full border border-ink-2/40 flex items-center justify-center text-paper-2 hover:text-gold transition-colors">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-full bg-gold text-ink text-sm font-semibold hover:bg-gold-2 transition-colors">
            Sign In / Login
          </button>
        </div>
        <button className="md:hidden text-paper-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-ink/90 backdrop-blur-xl border-b border-ink-2/40 overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-3">
              {links.map((l) => (
                <button key={l.label} onClick={() => scrollTo(l.href)} className="text-left text-paper-2 hover:text-gold text-sm">
                  {l.label}
                </button>
              ))}
              <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="mt-2 px-4 py-2 rounded-full bg-gold text-ink text-sm font-semibold">
                Sign In / Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
