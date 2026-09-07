import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { mockDB, MockApplication } from '../../lib/mockDatabase';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const priorityBadge = (p: string) => {
  if (p === 'HIGH') return 'gs-badge-red';
  if (p === 'MEDIUM') return 'gs-badge-amber';
  return 'gs-badge-zinc';
};

export default function ApplicationsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<MockApplication[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (user?.department) {
      mockDB.getApplicationsForDepartment(user.department).then(setApplications);
    }
  }, [user]);

  const filteredApps = filter === 'ALL' ? applications : applications.filter(a => a.priority === filter);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <h1 className="text-lg font-semibold" style={{ color: 'var(--color-fg)' }}>Application Work Queue</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>Applications requiring {user?.department} verification.</p>
      </div>

      <div className="gs-card overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 flex gap-3 items-center" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--color-fg-subtle)' }} />
            <input
              type="text"
              placeholder="Search by ID or service..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md outline-none"
              style={{ backgroundColor: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-fg)' }}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-md outline-none"
            style={{ backgroundColor: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-fg)' }}
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
          <button className="p-1.5 rounded-md" style={{ border: '1px solid var(--color-border)', color: 'var(--color-fg-muted)' }}>
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
                {['Application ID', 'Service', 'Required Task', 'Priority', 'Submitted', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-fg-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--color-fg-muted)' }}>
                    No applications currently require your attention.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: 'var(--color-accent)' }}>{app.id}</td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-fg)' }}>{app.service}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-fg-muted)' }}>{app.current_step}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityBadge(app.priority)}`}>{app.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-fg-muted)' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/officer/applications/${app.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors"
                        style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#6366f133')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-subtle)')}>
                        Review <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
