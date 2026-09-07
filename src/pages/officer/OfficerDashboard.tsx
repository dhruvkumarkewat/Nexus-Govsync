import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { mockDB, MockApplication } from '../../lib/mockDatabase';
import { Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const S = {
  card: { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.5rem' } as React.CSSProperties,
  th: { color: 'var(--color-fg-subtle)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' },
};

const priorityBadge = (p: string) => {
  if (p === 'HIGH') return 'gs-badge-red';
  if (p === 'MEDIUM') return 'gs-badge-amber';
  return 'gs-badge-zinc';
};

export default function OfficerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<MockApplication[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);

  useEffect(() => {
    if (user?.department) {
      mockDB.getApplicationsForDepartment(user.department).then(setApplications);
      mockDB.getConflictsForDepartment(user.department).then(setConflicts);
    }
  }, [user]);

  const pendingApps = applications.length;
  const highPriority = applications.filter(a => a.priority === 'HIGH').length;
  const conflictCount = conflicts.filter(c => c.status === 'OPEN').length;

  const kpis = [
    { label: 'Pending Applications', value: pendingApps, icon: FileText, accent: '#6366f1' },
    { label: 'Verification Queue', value: pendingApps, icon: Clock, accent: '#f59e0b' },
    { label: 'Data Conflicts', value: conflictCount, icon: AlertTriangle, accent: '#ef4444' },
    { label: 'Completed Today', value: 12, icon: CheckCircle, accent: '#22c55e' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold" style={{ color: 'var(--color-fg)' }}>Overview</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>{user?.department} Department — Live verification queue</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {kpis.map(kpi => (
          <div key={kpi.label} style={S.card} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.accent + '1a' }}>
              <kpi.icon className="w-4.5 h-4.5" style={{ color: kpi.accent, width: 18, height: 18 }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--color-fg)' }}>{kpi.value}</div>
              <div className="text-[11px]" style={{ color: 'var(--color-fg-muted)' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority Queue */}
        <div style={S.card} className="overflow-hidden">
          <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>Priority Verification Queue</h2>
            <button onClick={() => navigate('/officer/applications')} className="text-xs font-medium transition-colors" style={{ color: 'var(--color-accent)' }}>View All</button>
          </div>
          <div>
            {applications.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--color-fg-muted)' }}>No pending verification tasks.</div>
            ) : (
              applications.slice(0, 5).map((app, i) => (
                <div key={app.id} className="px-4 py-3 flex items-center justify-between transition-colors"
                  style={{ borderBottom: i < Math.min(applications.length, 5) - 1 ? '1px solid var(--color-border-subtle)' : undefined }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-3)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--color-fg)' }}>{app.id} — {app.service}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: 'var(--color-fg-subtle)' }}>{app.current_step}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityBadge(app.priority)}`}>{app.priority}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/officer/applications/${app.id}`)}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-md ml-3 shrink-0 transition-colors"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-fg-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-fg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--color-fg-muted)'; }}>
                    Open
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div style={S.card} className="overflow-hidden">
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>Recent Notifications</h2>
          </div>
          <div>
            <div className="px-4 py-3 flex gap-3"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-3)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
              <div className="mt-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /></div>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-fg)' }}>New verification assigned</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>Application GS-10821 requires Income Verification.</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--color-fg-subtle)' }}>10 mins ago</div>
              </div>
            </div>
            {conflictCount > 0 && (
              <div className="px-4 py-3 flex gap-3" style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-3)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                <div className="mt-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /></div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-fg)' }}>Data conflict detected</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>Income values differ between Revenue and Welfare sources.</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--color-fg-subtle)' }}>1 hour ago</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
