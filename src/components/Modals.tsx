import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { useUI } from './providers/UIProvider';
import { submitDemo, fetchDepartments } from '../lib/api';

export function DemoModal() {
  const { modal, closeModal } = useUI();
  const open = modal === 'demo';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [depts, setDepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) { fetchDepartments().then(setDepts).catch(() => {}); setDone(false); }
  }, [open]);

  const send = async () => {
    setLoading(true);
    try {
      await submitDemo({ name, email, org, role, department, message });
      setDone(true);
    } catch (e) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={closeModal} />
          <motion.div
            className="relative bg-ink border border-ink-2/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 text-paper-2 hover:text-paper">
              <X size={18} />
            </button>
            {done ? (
              <div className="text-center py-8">
                <CheckCircle2 size={40} className="text-gold mx-auto mb-3" />
                <div className="text-paper text-lg font-semibold">Request received!</div>
                <div className="text-paper-2 text-sm mt-1">We’ll reach out shortly.</div>
                <button onClick={closeModal} className="mt-4 px-4 py-2 rounded-full bg-gold text-ink text-sm font-semibold">Close</button>
              </div>
            ) : (
              <>
                <div className="text-paper text-lg font-semibold mb-1">Request a Demo</div>
                <div className="text-paper-2 text-xs mb-4">See how GovSync Nexus transforms your department.</div>
                <div className="grid gap-3">
                  <input className="w-full bg-ink-2/40 border border-ink-2/60 rounded-lg px-3 py-2 text-paper text-sm placeholder:text-paper-2/50 focus:outline-none focus:border-gold/40" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="w-full bg-ink-2/40 border border-ink-2/60 rounded-lg px-3 py-2 text-paper text-sm placeholder:text-paper-2/50 focus:outline-none focus:border-gold/40" placeholder="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="w-full bg-ink-2/40 border border-ink-2/60 rounded-lg px-3 py-2 text-paper text-sm placeholder:text-paper-2/50 focus:outline-none focus:border-gold/40" placeholder="Organization" value={org} onChange={(e) => setOrg(e.target.value)} />
                    <input className="w-full bg-ink-2/40 border border-ink-2/60 rounded-lg px-3 py-2 text-paper text-sm placeholder:text-paper-2/50 focus:outline-none focus:border-gold/40" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
                  </div>
                  <select className="w-full bg-ink-2/40 border border-ink-2/60 rounded-lg px-3 py-2 text-paper text-sm focus:outline-none focus:border-gold/40" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="" className="bg-ink text-paper-2">Select Department</option>
                    {depts.map((d) => (
                      <option key={d.id} value={d.name} className="bg-ink text-paper">{d.name}</option>
                    ))}
                  </select>
                  <textarea className="w-full bg-ink-2/40 border border-ink-2/60 rounded-lg px-3 py-2 text-paper text-sm placeholder:text-paper-2/50 focus:outline-none focus:border-gold/40" rows={3} placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button onClick={send} className="mt-4 w-full px-4 py-2.5 rounded-full bg-gold text-ink text-sm font-semibold hover:bg-gold-2 transition-colors flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : 'Submit Request'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function VideoModal() {
  const { modal, closeModal } = useUI();
  const open = modal === 'video';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/90 backdrop-blur-sm" onClick={closeModal} />
          <motion.div
            className="relative bg-ink border border-ink-2/60 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            <button onClick={closeModal} className="absolute top-3 right-3 z-10 text-paper-2 hover:text-paper bg-ink/60 rounded-full p-1">
              <X size={18} />
            </button>
            <div className="aspect-video bg-ink-2/40 flex items-center justify-center">
              <div className="text-center text-paper-2">
                <div className="text-sm font-semibold text-paper mb-1">Platform Overview</div>
                <div className="text-xs">Video playback coming soon</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
