import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { mockDB, MockApplication } from '../../lib/mockDatabase';
import { useNavigate } from 'react-router-dom';
import {
  Plus, ArrowRight, CheckCircle2, Clock, AlertCircle,
  Shield, Check, FileText, ChevronRight, HelpCircle, Loader2
} from 'lucide-react';

const card: React.CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '0.5rem',
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'Completed': return 'gs-badge-green';
    case 'In Review': return 'gs-badge-blue';
    case 'Waiting': return 'gs-badge-amber';
    case 'Conflict': return 'gs-badge-red';
    default: return 'gs-badge-zinc';
  }
};

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<MockApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    if (user?.id) {
      mockDB.getApplicationsForCitizen(user.id).then(apps => {
        setApplications(apps);
        setLoading(false);
      });
    }
  }, [user]);

  const activeApps = applications.filter(a => a.status !== 'Completed' && a.status !== 'Rejected');
  const completedApps = applications.filter(a => a.status === 'Completed');
  const pendingActionCount = consentGranted ? 0 : 1;
  const completedCount = completedApps.length > 0 ? completedApps.length : 2;

  const displayName = user?.name.startsWith('Login as ')
    ? user.name.replace('Login as ', '')
    : user?.name.split(' ')[0];

  const kpis = [
    { value: activeApps.length, label: 'Active Applications', nav: '/citizen/applications', accent: '#6366f1' },
    { value: pendingActionCount, label: 'Pending Action', nav: '/citizen/permissions', accent: '#f59e0b' },
    { value: completedCount, label: 'Completed Services', nav: '/citizen/applications', accent: '#22c55e' },
    { value: 8, label: 'Verified Information', nav: '/citizen/permissions', accent: '#38bdf8' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-fg)' }}>Good morning, {displayName}</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>Manage your government services, applications and permissions from one place.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => navigate('/citizen/services')}
            className="px-4 py-2 text-sm font-medium rounded-md text-white transition-colors flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--color-accent)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}>
            <Plus className="w-4 h-4" /> Apply for a Service
          </button>
          <button onClick={() => navigate('/citizen/applications')}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-fg-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-fg)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--color-fg-muted)'; }}>
            <FileText className="w-4 h-4" /> Track My Applications
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {kpis.map(kpi => (
          <div key={kpi.label} onClick={() => navigate(kpi.nav)}
            style={{ ...card, cursor: 'pointer' }} className="p-4 transition-colors group"
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = kpi.accent + '66')}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)')}>
            <div className="text-2xl font-bold mb-0.5" style={{ color: kpi.accent }}>{kpi.value}</div>
            <div className="text-xs flex items-center justify-between" style={{ color: 'var(--color-fg-muted)' }}>
              <span>{kpi.label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Applications */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>My Active Applications</h2>
            {activeApps.length > 0 && (
              <button onClick={() => navigate('/citizen/applications')}
                className="text-xs font-medium flex items-center gap-1 transition-colors"
                style={{ color: 'var(--color-accent)' }}>
                View All ({applications.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : activeApps.length === 0 ? (
            <div style={{ ...card, borderStyle: 'dashed' }} className="p-8 text-center">
              <p className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>No active applications yet.</p>
              <button onClick={() => navigate('/citizen/services')}
                className="mt-3 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
                Apply for a Service
              </button>
            </div>
          ) : (
            activeApps.slice(0, 3).map(app => (
              <div key={app.id} onClick={() => navigate(`/citizen/applications/${app.id}`)}
                style={card} className="overflow-hidden transition-all cursor-pointer"
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f155'; (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface-2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-surface)'; }}>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>{app.service}</h3>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-fg-subtle)' }}>{app.id}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(app.status)}`}>{app.status}</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-md" style={{ backgroundColor: 'var(--color-surface-3)' }}>
                    {app.status === 'Waiting' ? <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--color-fg)' }}>Current: {app.current_step}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>
                        {app.status === 'Waiting' ? 'Being verified across authorized departments — no action needed.' : 'Inter-department verification in progress.'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 flex justify-end" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
                    Track Application <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action sidebar */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-fg)' }}>Your Action Required</h2>

          {!consentGranted ? (
            <div style={{ ...card, borderColor: '#92400e55' }} className="p-4">
              <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center mb-3">
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-fg)' }}>Consent required</h3>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>The Welfare Department needs your permission to access verified income data from Revenue.</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => setConsentGranted(true)}
                  className="w-full py-2 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: '#92400e', color: '#fbbf24' }}>
                  <Check className="w-3.5 h-3.5" /> Allow Permission
                </button>
                <button onClick={() => navigate('/citizen/permissions')}
                  className="w-full py-2 px-3 rounded-md text-xs font-medium transition-colors"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-fg-muted)' }}>
                  Review Details
                </button>
              </div>
            </div>
          ) : (
            <div style={{ ...card, borderColor: '#14532d55' }} className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: '#4ade80' }}>
                <CheckCircle2 className="w-4 h-4" /> Consent Granted!
              </div>
              <p className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>Permission granted to Welfare Department. Status updated across departments.</p>
            </div>
          )}

          <div style={card} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <HelpCircle className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>Need Assistance?</h3>
                <p className="text-[10px]" style={{ color: 'var(--color-fg-subtle)' }}>Nexus Citizen Helpdesk</p>
              </div>
            </div>
            <button onClick={() => navigate('/citizen/support')}
              className="w-full py-2 rounded-md text-xs font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-fg-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-fg)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}>
              Open Help & Support Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
