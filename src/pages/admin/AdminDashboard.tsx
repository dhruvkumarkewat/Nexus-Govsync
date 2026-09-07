import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { mockDB, MockApplication } from '../../lib/mockDatabase';
import { ThemeToggle } from '../../lib/ThemeProvider';
import {
  Users, FileText, AlertTriangle, CheckCircle2, Activity,
  Shield, LogOut, Building2, Clock,
  TrendingUp, AlertOctagon, Zap
} from 'lucide-react';

const departments = [
  { name: 'Revenue',     accent: '#38bdf8' },
  { name: 'Welfare',     accent: '#fbbf24' },
  { name: 'Education',   accent: '#34d399' },
  { name: 'Health',      accent: '#f87171' },
  { name: 'Municipal',   accent: '#a78bfa' },
  { name: 'Transport',   accent: '#fb923c' },
  { name: 'Agriculture', accent: '#a3e635' },
  { name: 'Labour',      accent: '#818cf8' },
];

const S = {
  card: { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.5rem' } as React.CSSProperties,
};

const statusBadge = (s: string) => {
  switch (s) {
    case 'Completed':  return 'gs-badge-green';
    case 'In Review':  return 'gs-badge-blue';
    case 'Waiting':    return 'gs-badge-amber';
    case 'Conflict':   return 'gs-badge-red';
    default:           return 'gs-badge-zinc';
  }
};

const priorityBadge = (p: string) => {
  if (p === 'HIGH')   return 'gs-badge-red';
  if (p === 'MEDIUM') return 'gs-badge-amber';
  return 'gs-badge-zinc';
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<MockApplication[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mockDB.getApplications(),
      mockDB.getAllConflicts()
    ]).then(([apps, confs]) => {
      setApplications(apps);
      setConflicts(confs);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const totalApps    = applications.length;
  const pending      = applications.filter(a => a.status !== 'Completed').length;
  const completed    = applications.filter(a => a.status === 'Completed').length;
  const openConflicts = conflicts.filter(c => c.status === 'OPEN').length;

  const deptStats = departments.map(dept => ({
    ...dept,
    pending: applications.filter(a => a.department === dept.name && a.status !== 'Completed').length,
    total:   applications.filter(a => a.department === dept.name).length,
  }));

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const kpis = [
    { label: 'Total Applications', value: totalApps,     icon: FileText,      accent: '#6366f1' },
    { label: 'In Progress',        value: pending,       icon: Clock,         accent: '#f59e0b' },
    { label: 'Completed',          value: completed,     icon: CheckCircle2,  accent: '#22c55e' },
    { label: 'Open Conflicts',     value: openConflicts, icon: AlertTriangle, accent: '#ef4444' },
  ];

  const health = [
    { label: 'Supabase Database', status: 'Online',       ok: true },
    { label: 'Google Auth',       status: 'Active',       ok: true },
    { label: 'API Gateway',       status: 'Operational',  ok: true },
    { label: 'Conflict Engine',   status: openConflicts > 0 ? `${openConflicts} Open` : 'Clear', ok: openConflicts === 0 },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-fg)' }}>

      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <header className="h-12 px-6 flex items-center justify-between sticky top-0 z-40"
        style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[9px] tracking-wider">GS</span>
          </div>
          <div>
            <div className="font-semibold text-sm leading-none" style={{ color: 'var(--color-fg)' }}>GovSync Nexus</div>
            <div className="text-[10px] tracking-widest uppercase leading-none mt-0.5" style={{ color: 'var(--color-fg-subtle)' }}>System Administration</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-fg-muted)' }}>
            <Shield className="w-3.5 h-3.5 text-yellow-500" />
            {user?.name || 'Admin'}
          </div>
          <ThemeToggle />
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
            style={{ color: 'var(--color-fg-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#ef444410'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-fg-muted)'; e.currentTarget.style.backgroundColor = ''; }}>
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--color-fg)' }}>Admin Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>System overview — all departments, applications, and conflicts</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── KPI Row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {kpis.map(kpi => (
                <div key={kpi.label} style={S.card} className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: kpi.accent + '1a' }}>
                    <kpi.icon style={{ width: 18, height: 18, color: kpi.accent }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--color-fg)' }}>{kpi.value}</div>
                    <div className="text-[11px]" style={{ color: 'var(--color-fg-muted)' }}>{kpi.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Middle grid ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

              {/* Department Status */}
              <div style={S.card} className="lg:col-span-2 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-fg)' }}>
                    <Building2 className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    Department Status
                  </h2>
                  <span className="text-[10px]" style={{ color: 'var(--color-fg-subtle)' }}>Live · Supabase</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  {deptStats.map(dept => {
                    const pct = dept.total > 0 ? Math.round((dept.pending / dept.total) * 100) : 0;
                    return (
                      <div key={dept.name} className="px-4 py-2.5 flex items-center justify-between gap-4"
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dept.accent }} />
                          <span className="text-xs font-medium truncate" style={{ color: 'var(--color-fg)' }}>{dept.name}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="flex-1 max-w-[140px] h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-surface-3)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: dept.accent + 'cc' }} />
                        </div>
                        <div className="flex items-center gap-3 text-xs shrink-0">
                          <span style={{ color: 'var(--color-fg-muted)' }}>{dept.total} total</span>
                          <span className="font-semibold" style={{ color: dept.pending > 0 ? dept.accent : 'var(--color-fg-subtle)' }}>{dept.pending} pending</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right panel */}
              <div className="space-y-3">
                {/* System Health */}
                <div style={S.card} className="overflow-hidden">
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-fg)' }}>
                      <Activity className="w-4 h-4 text-green-500" /> System Health
                    </h2>
                  </div>
                  <div className="px-4 py-3 space-y-2.5">
                    {health.map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>{item.label}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.ok ? 'gs-badge-green' : 'gs-badge-amber'}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conflict Alert */}
                {openConflicts > 0 && (
                  <div style={{ ...S.card, borderColor: '#ef444433' }} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertOctagon className="w-4 h-4 text-red-500" />
                      <h3 className="text-sm font-semibold" style={{ color: '#f87171' }}>Conflicts Need Attention</h3>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-fg-muted)' }}>
                      {openConflicts} data conflict{openConflicts > 1 ? 's' : ''} across departments.
                    </p>
                    <div className="space-y-1.5">
                      {conflicts.filter(c => c.status === 'OPEN').map(c => (
                        <div key={c.id} className="text-[10px] px-2.5 py-1.5 rounded gs-badge-red">
                          <span className="font-bold">{c.field}</span> — {c.source_a} vs {c.source_b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live indicator */}
                <div style={S.card} className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#6366f11a' }}>
                    <Zap className="w-4 h-4" style={{ color: '#818cf8' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--color-fg)' }}>Interoperability Engine</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px]" style={{ color: 'var(--color-fg-muted)' }}>All systems operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Recent Applications Table ────────────────────────── */}
            <div style={S.card} className="overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-fg)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                  Recent Applications
                </h2>
                <span className="text-[10px]" style={{ color: 'var(--color-fg-subtle)' }}>Last {recentApps.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
                      {['ID', 'Service', 'Department', 'Status', 'Priority', 'Date'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--color-fg-subtle)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app, i) => (
                      <tr key={app.id}
                        style={{ borderBottom: i < recentApps.length - 1 ? '1px solid var(--color-border-subtle)' : undefined }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                        <td className="px-4 py-2.5 text-xs font-mono font-semibold" style={{ color: 'var(--color-accent)' }}>{app.id}</td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--color-fg)' }}>{app.service}</td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--color-fg-muted)' }}>{app.department}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusBadge(app.status)}`}>{app.status}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityBadge(app.priority)}`}>{app.priority}</span>
                        </td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--color-fg-subtle)' }}>
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
