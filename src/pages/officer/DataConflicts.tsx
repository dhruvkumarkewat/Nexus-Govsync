import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { mockDB, DataConflict } from '../../lib/mockDatabase';
import { AlertTriangle, CheckCircle2, ArrowUpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function DataConflicts() {
  const { user } = useAuth();
  const [conflicts, setConflicts] = useState<DataConflict[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const load = () => {
    if (user?.department) {
      mockDB.getConflictsForDepartment(user.department).then(setConflicts);
    }
  };

  useEffect(() => { load(); }, [user]);

  const handleResolve = async (id: string) => {
    setLoading(id);
    await mockDB.resolveConflict(id);
    load();
    setLoading(null);
  };

  const handleEscalate = async (id: string) => {
    setLoading(id);
    await mockDB.escalateConflict(id);
    load();
    setLoading(null);
  };

  const openConflicts = conflicts.filter(c => c.status === 'OPEN');
  const resolvedConflicts = conflicts.filter(c => c.status !== 'OPEN');

  const severityColors: Record<string, string> = {
    HIGH: 'bg-red-100 text-red-700 border-red-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Data Conflicts</h1>
        <p className="text-slate-500 text-sm mt-1">
          Discrepancies detected during cross-department verification that require resolution.
        </p>
      </div>

      {openConflicts.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center mb-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <p className="text-emerald-800 font-semibold">No open data conflicts</p>
          <p className="text-emerald-600 text-sm mt-1">All discrepancies for {user?.department} have been resolved.</p>
        </div>
      )}

      {openConflicts.length > 0 && (
        <div className="space-y-4 mb-10">
          {openConflicts.map(conflict => (
            <div key={conflict.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === conflict.id ? null : conflict.id)}
                className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-slate-900">{conflict.field} Mismatch</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${severityColors[conflict.severity]}`}>
                      {conflict.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-600 border border-red-200">OPEN</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Application {conflict.application_id} · Conflict between {conflict.sourceA} and {conflict.sourceB}
                  </p>
                </div>
                <div className="text-slate-400 shrink-0">
                  {expanded === conflict.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {expanded === conflict.id && (
                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Source: {conflict.sourceA} Department
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{conflict.valueA}</div>
                      <div className="text-sm text-slate-500 mt-1">{conflict.field}</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">
                        Source: {conflict.sourceB} Department
                      </div>
                      <div className="text-2xl font-bold text-red-700">{conflict.valueB}</div>
                      <div className="text-sm text-red-500 mt-1">{conflict.field} (differs)</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <strong>Action Required:</strong> The values above differ between two authorized government data sources. 
                    Verify against primary documents and mark the authoritative value before approving.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleResolve(conflict.id)}
                      disabled={loading === conflict.id}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {loading === conflict.id ? 'Processing...' : 'Mark Resolved'}
                    </button>
                    <button
                      onClick={() => handleEscalate(conflict.id)}
                      disabled={loading === conflict.id}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-400 text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-colors disabled:opacity-50"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      Escalate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {resolvedConflicts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Resolved & Escalated</h2>
          <div className="space-y-3">
            {resolvedConflicts.map(conflict => (
              <div key={conflict.id} className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${conflict.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {conflict.status === 'RESOLVED' ? <CheckCircle2 className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-700">{conflict.field} Mismatch — {conflict.application_id}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{conflict.sourceA} vs {conflict.sourceB}</div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${conflict.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {conflict.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
