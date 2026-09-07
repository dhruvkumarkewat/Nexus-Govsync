import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { mockDB, MockApplication } from '../../lib/mockDatabase';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Plus, ArrowRight, CheckCircle2, Clock, AlertCircle, ChevronRight, Filter, Building2, Calendar, Loader2 } from 'lucide-react';

export default function CitizenApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<MockApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    if (user?.id) {
      mockDB.getApplicationsForCitizen(user.id).then(apps => {
        setApplications(apps);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.current_step.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return app.status !== 'Completed' && app.status !== 'Rejected';
    if (statusFilter === 'COMPLETED') return app.status === 'Completed';
    if (statusFilter === 'WAITING') return app.status === 'Waiting';
    if (statusFilter === 'IN_REVIEW') return app.status === 'In Review';
    if (statusFilter === 'CONFLICT') return app.status === 'Conflict';
    return true;
  });

  const getStatusBadge = (status: MockApplication['status']) => {
    switch (status) {
      case 'Completed': return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'In Review': return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold"><Clock className="w-3.5 h-3.5" /> In Review</span>;
      case 'Waiting': return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Waiting</span>;
      case 'Conflict': return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold"><AlertCircle className="w-3.5 h-3.5" /> Data Discrepancy</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getDeptColor = (dept: string) => {
    const m: Record<string, string> = { Revenue: 'bg-sky-50 text-sky-700 border-sky-200', Welfare: 'bg-amber-50 text-amber-700 border-amber-200', Education: 'bg-emerald-50 text-emerald-700 border-emerald-200', Health: 'bg-rose-50 text-rose-700 border-rose-200', Municipal: 'bg-purple-50 text-purple-700 border-purple-200', Transport: 'bg-orange-50 text-orange-700 border-orange-200', Agriculture: 'bg-lime-50 text-lime-700 border-lime-200', Labour: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    return m[dept] ?? 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-fg)' }}>My Applications</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>Track all your government service verifications in real-time.</p>
        </div>
        <button onClick={() => navigate('/citizen/services')} className="px-4 py-2 text-sm font-medium rounded-md text-white flex items-center gap-1.5 shrink-0 transition-colors" style={{ backgroundColor: 'var(--color-accent)' }}>
          <Plus className="w-4 h-4" /> Apply for New Service
        </button>
      </div>

      {/* Search & Filters */}
      <div className="rounded-md overflow-hidden mb-4 flex flex-col md:flex-row gap-3 items-center justify-between p-3" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--color-fg-subtle)' }} />
            <input type="text" placeholder="Search applications..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md outline-none" style={{ backgroundColor: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-fg)' }} />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            {[{ label: 'All', value: 'ALL' }, { label: 'Active', value: 'ACTIVE' }, { label: 'In Review', value: 'IN_REVIEW' }, { label: 'Waiting', value: 'WAITING' }, { label: 'Completed', value: 'COMPLETED' }].map(tab => (
              <button key={tab.value} onClick={() => setStatusFilter(tab.value)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${statusFilter === tab.value ? 'bg-indigo-600 text-white' : ''}`}
                style={statusFilter !== tab.value ? { backgroundColor: 'var(--color-surface-3)', color: 'var(--color-fg-muted)' } : {}}>
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="rounded-md p-8 text-center" style={{ border: '1px dashed var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-fg-subtle)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>No applications found</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--color-fg-muted)' }}>{searchTerm || statusFilter !== 'ALL' ? 'Try clearing your filters.' : 'You have no service applications yet.'}</p>
            <div className="mt-4 flex justify-center gap-2">
              {(searchTerm || statusFilter !== 'ALL') && (
                <button onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }} className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors" style={{ border: '1px solid var(--color-border)', color: 'var(--color-fg-muted)' }}>Clear Filters</button>
              )}
              <button onClick={() => navigate('/citizen/services')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-500">Browse Services</button>
            </div>
          </div>
        ) : (
          filteredApps.map(app => (
            <div key={app.id} onClick={() => navigate(`/citizen/applications/${app.id}`)} className="rounded-md overflow-hidden cursor-pointer transition-all" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f155'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>{app.service}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getDeptColor(app.department)}`}>{app.department}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px]" style={{ color: 'var(--color-fg-subtle)' }}>
                    <span className="font-mono font-semibold" style={{ color: 'var(--color-fg-muted)' }}>ID: {app.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(app.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>
              <div className="p-3 flex justify-between items-center rounded-md mx-4 mb-4" style={{ backgroundColor: 'var(--color-surface-3)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}><Building2 className="w-3.5 h-3.5" /></div>
                  <div>
                    <div className="text-[10px]" style={{ color: 'var(--color-fg-subtle)' }}>Current Step</div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--color-fg)' }}>{app.current_step}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>Track <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
