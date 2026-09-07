import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, CircleCheck, Loader2, Activity } from 'lucide-react';
import { fetchApplications, updateApplication, fetchTasks, updateTask, fetchMetrics } from '../lib/api';
import type { Application, Task, Metric } from '../lib/api';

const roleTabs = ['Citizen', 'Officer', 'Admin'];

export default function PlatformSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [role, setRole] = useState(0);
  const [apps, setApps] = useState<Application[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAppId, setPendingAppId] = useState<number | null>(null);
  const [pendingTaskId, setPendingTaskId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [a, t, m] = await Promise.all([fetchApplications(), fetchTasks(), fetchMetrics('admin')]);
      setApps(a);
      setTasks(t);
      setMetrics(m);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const doAppAction = async (id: number, action: string) => {
    setPendingAppId(id);
    try { await updateApplication(id, action); } catch (e) { console.error(e); }
    setPendingAppId(null);
    load();
  };

  const doTaskAction = async (id: number, action: string) => {
    setPendingTaskId(id);
    try { await updateTask(id, action); } catch (e) { console.error(e); }
    setPendingTaskId(null);
    load();
  };

  const stat = (key: string) => metrics.find((m) => m.key === key)?.value ?? 0;

  const citizenApp = apps[0];
  const officerTask = tasks.find((t) => t.status !== 'Verified' && t.status !== 'Approved') || tasks[0];

  return (
    <section id="platform" ref={ref} className="relative bg-ink py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <motion.span
              className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Platform in Action
            </motion.span>
            <motion.h2
              className="mt-3 font-serif text-3xl md:text-4xl text-paper leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Built for every role.<br />Designed for clarity.
            </motion.h2>
            <motion.p
              className="mt-3 text-paper-2 text-sm leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Unified experiences for citizens, officers and administrators—each with what they need, when they need it.
            </motion.p>
            <motion.button
              className="mt-6 px-5 py-2.5 rounded-full border border-paper/20 text-paper text-sm font-medium hover:bg-paper/10 transition-colors flex items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Explore Dashboards <ArrowRight size={14} />
            </motion.button>
          </div>

          <div className="lg:col-span-8">
            <div className="flex gap-2 mb-4">
              {roleTabs.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setRole(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${role === i ? 'bg-gold text-ink' : 'bg-ink-2/40 text-paper-2 border border-ink-2/60 hover:border-gold/40'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {role === 0 && (
                <motion.div
                  key="citizen"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="bg-ink-2/40 border border-ink-2/60 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-paper text-sm font-semibold">Citizen Dashboard</div>
                    <div className="text-paper-2 text-xs">Good morning, Rahul 👋</div>
                  </div>
                  {loading ? (
                    <div className="h-40 flex items-center justify-center text-paper-2"><Loader2 size={18} className="animate-spin" /></div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{apps.filter((a) => a.status === 'Active').length}</div>
                          <div className="text-paper-2 text-[10px]">Active</div>
                        </div>
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-gold text-xl font-semibold">{apps.filter((a) => a.status === 'Pending Action').length}</div>
                          <div className="text-paper-2 text-[10px]">Pending Action</div>
                        </div>
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{apps.filter((a) => a.status === 'Completed').length}</div>
                          <div className="text-paper-2 text-[10px]">Completed</div>
                        </div>
                      </div>
                      <div className="text-paper text-xs font-semibold mb-2">Recent Updates</div>
                      <div className="space-y-2 mb-4">
                        {(citizenApp?.meta?.timeline || []).slice(0, 3).map((ev: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-paper-2 text-xs">
                            <CircleCheck size={12} className="text-gold shrink-0" />
                            <span className="flex-1">{ev.text}</span>
                            <span className="text-[10px] opacity-60">{new Date(ev.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                        {!citizenApp && <div className="text-paper-2 text-xs">No updates yet</div>}
                      </div>
                      {citizenApp && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => doAppAction(citizenApp.id, 'track')}
                            className="px-3 py-1.5 rounded-lg bg-ink/50 text-paper text-xs hover:bg-gold/20 transition-colors"
                          >
                            {pendingAppId === citizenApp.id ? <Loader2 size={12} className="animate-spin inline" /> : <Check size={12} className="inline" />} Track Application
                          </button>
                          <button
                            onClick={() => doAppAction(citizenApp.id, 'submit')}
                            className="px-3 py-1.5 rounded-lg bg-ink/50 text-paper text-xs hover:bg-gold/20 transition-colors"
                          >
                            {pendingAppId === citizenApp.id ? <Loader2 size={12} className="animate-spin inline" /> : <ArrowRight size={12} className="inline" />} Submit New
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {role === 1 && (
                <motion.div
                  key="officer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="bg-ink-2/40 border border-ink-2/60 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-paper text-sm font-semibold">Officer Dashboard</div>
                    <div className="text-paper-2 text-xs">Welfare Department</div>
                  </div>
                  {loading ? (
                    <div className="h-40 flex items-center justify-center text-paper-2"><Loader2 size={18} className="animate-spin" /></div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{tasks.filter((t) => t.status !== 'Verified' && t.status !== 'Approved').length}</div>
                          <div className="text-paper-2 text-[10px]">Pending Tasks</div>
                        </div>
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-gold text-xl font-semibold">{tasks.filter((t) => t.priority === 'High' && t.status !== 'Verified').length}</div>
                          <div className="text-paper-2 text-[10px]">Verification Queue</div>
                        </div>
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{tasks.filter((t) => t.status === 'Verified' || t.status === 'Approved').length}</div>
                          <div className="text-paper-2 text-[10px]">Active Workflows</div>
                        </div>
                      </div>
                      <div className="text-paper text-xs font-semibold mb-2">Priority Queue</div>
                      <div className="space-y-2 mb-4">
                        {tasks.slice(0, 4).map((t) => (
                          <div key={t.id} className="flex items-center justify-between bg-ink/50 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${t.priority === 'High' ? 'bg-red-400' : t.priority === 'Medium' ? 'bg-gold' : 'bg-emerald-400'}`} />
                              <div className="text-paper text-xs">{t.service}</div>
                              <div className="text-paper-2 text-[10px]">{t.applicant}</div>
                            </div>
                            <button
                              onClick={() => doTaskAction(t.id, 'verify')}
                              className="px-2 py-1 rounded bg-ink-2/60 text-paper text-[10px] hover:bg-gold/20 transition-colors"
                            >
                              {pendingTaskId === t.id ? <Loader2 size={10} className="animate-spin inline" /> : 'Verify'}
                            </button>
                          </div>
                        ))}
                        {tasks.length === 0 && <div className="text-paper-2 text-xs">No tasks</div>}
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-ink/50 text-paper text-xs hover:bg-gold/20 transition-colors">Open Queue</button>
                    </div>
                  )}
                </motion.div>
              )}

              {role === 2 && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="bg-ink-2/40 border border-ink-2/60 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-paper text-sm font-semibold">Admin Command Center</div>
                    <div className="text-paper-2 text-xs">System Overview</div>
                  </div>
                  {loading ? (
                    <div className="h-40 flex items-center justify-center text-paper-2"><Loader2 size={18} className="animate-spin" /></div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{stat('uptime')}%</div>
                          <div className="text-paper-2 text-[10px]">Uptime</div>
                        </div>
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{stat('departments')}</div>
                          <div className="text-paper-2 text-[10px]">Departments Connected</div>
                        </div>
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{stat('apis')}</div>
                          <div className="text-paper-2 text-[10px]">APIs Active</div>
                        </div>
                        <div className="bg-ink/50 rounded-lg p-3">
                          <div className="text-paper text-xl font-semibold">{stat('transactions')}</div>
                          <div className="text-paper-2 text-[10px]">Transactions</div>
                        </div>
                      </div>
                      <div className="text-paper text-xs font-semibold mb-2">System Health</div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <div className="text-paper-2 text-xs">All systems operational</div>
                        <div className="ml-auto text-paper-2 text-[10px]">{stat('uptime')}% uptime</div>
                      </div>
                      <div className="text-paper text-xs font-semibold mb-2">Performance Trend</div>
                      <div className="h-24 bg-ink/50 rounded-lg flex items-end gap-1 px-3 py-2 overflow-hidden">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const h = 20 + Math.sin(i * 0.7) * 15 + Math.random() * 10;
                          return (
                            <div key={i} className="flex-1 rounded-t-sm bg-gold/40 hover:bg-gold/70 transition-colors" style={{ height: `${h}%` }} />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
