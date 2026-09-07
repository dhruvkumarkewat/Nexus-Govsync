import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, ShieldAlert, Clock, CheckCircle2, XCircle, Search, 
  Trash2, AlertTriangle, Check
} from 'lucide-react';

interface ActivePermission {
  id: string;
  dept: string;
  purpose: string;
  status: string;
  color: string;
  grantedDate: string;
}

interface HistoryItem {
  id: number;
  time: string;
  date: string;
  dept: string;
  info: string;
  purpose: string;
  status: string;
}

export default function PermissionsAndHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'permissions' | 'history'>('permissions');

  useEffect(() => {
    if (location.pathname.includes('history')) {
      setTab('history');
    } else {
      setTab('permissions');
    }
  }, [location.pathname]);
  const [pendingRequest, setPendingRequest] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const [activePermissions, setActivePermissions] = useState<ActivePermission[]>([
    { id: 'perm_1', dept: 'Education Verification', purpose: 'General Services & Scholarships', status: 'Active', color: 'emerald', grantedDate: '12 Aug 2026' },
    { id: 'perm_2', dept: 'Residence Verification', purpose: 'Municipal Corporation Services', status: 'Active', color: 'sky', grantedDate: '20 Aug 2026' }
  ]);

  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, time: '09:42', date: 'Today', dept: 'Revenue Department', info: 'Income', purpose: 'Benefit Eligibility', status: 'Approved' },
    { id: 2, time: '09:38', date: 'Today', dept: 'Education Department', info: 'Education Status', purpose: 'Scholarship', status: 'Completed' },
    { id: 3, time: '14:20', date: 'Yesterday', dept: 'Municipal Corporation', info: 'Residence', purpose: 'Identity Verification', status: 'Approved' }
  ]);

  const [historySearch, setHistorySearch] = useState('');

  const handleAllow = (type: 'permanent' | 'once') => {
    setPendingRequest(false);
    const newPerm: ActivePermission = {
      id: `perm_${Date.now()}`,
      dept: 'Welfare Department',
      purpose: type === 'once' ? 'Income Verification (Single-Use)' : 'Benefit Eligibility & Income Verification',
      status: type === 'once' ? 'Active (Once)' : 'Active',
      color: 'amber',
      grantedDate: 'Today'
    };
    setActivePermissions(prev => [newPerm, ...prev]);

    const newHistory: HistoryItem = {
      id: Date.now(),
      time: 'Just now',
      date: 'Today',
      dept: 'Welfare Department',
      info: 'Annual Income, Certificate Status',
      purpose: 'Benefit Eligibility Verification',
      status: type === 'once' ? 'Allowed Once' : 'Approved'
    };
    setHistory(prev => [newHistory, ...prev]);

    setActionNotice(`Permission successfully granted to Welfare Department (${type === 'once' ? 'One-time access' : 'Full access'}).`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDeny = () => {
    setPendingRequest(false);
    setActionNotice('Access request denied for Welfare Department.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRevoke = (id: string, dept: string) => {
    setActivePermissions(prev => prev.filter(p => p.id !== id));
    const newHistory: HistoryItem = {
      id: Date.now(),
      time: 'Just now',
      date: 'Today',
      dept: dept,
      info: 'All Associated Records',
      purpose: 'Consent Revocation by Citizen',
      status: 'Revoked'
    };
    setHistory(prev => [newHistory, ...prev]);
    setActionNotice(`Successfully revoked active data sharing permissions for ${dept}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredHistory = history.filter(item => 
    item.dept.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.info.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.purpose.toLowerCase().includes(historySearch.toLowerCase()) ||
    item.status.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Consent & Permissions</h1>
        <p className="text-slate-600 mt-2 text-lg">You control what information is shared, why it is needed and who can use it.</p>
      </div>

      {actionNotice && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button 
          onClick={() => navigate('/citizen/permissions')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
            tab === 'permissions' 
              ? 'border-indigo-600 text-indigo-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Active Permissions ({activePermissions.length})
        </button>
        <button 
          onClick={() => navigate('/citizen/history')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
            tab === 'history' 
              ? 'border-indigo-600 text-indigo-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Data Sharing History ({history.length})
        </button>
      </div>

      {tab === 'permissions' && (
        <div className="space-y-8">
          {pendingRequest ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-amber-900">Pending Request: Welfare Department</h3>
                      <p className="text-sm text-amber-700 mt-0.5">Purpose: Benefit Eligibility Verification</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-200/60 text-amber-900 rounded text-xs font-bold uppercase tracking-wider">Action Needed</span>
                  </div>
                  
                  <div className="mt-4 bg-white/70 p-4 rounded-xl border border-amber-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Requested Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-amber-900 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Annual Income from Revenue Department
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-900 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Income Certificate Authenticity Status
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => handleAllow('permanent')}
                      className="px-5 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors cursor-pointer shadow-xs text-sm flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Allow Always
                    </button>
                    <button 
                      onClick={() => handleAllow('once')}
                      className="px-5 py-2.5 bg-white text-amber-800 border border-amber-300 rounded-xl font-semibold hover:bg-amber-100 transition-colors cursor-pointer text-sm"
                    >
                      Allow Once (Single Verification)
                    </button>
                    <button 
                      onClick={handleDeny}
                      className="px-4 py-2.5 text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer text-sm ml-auto"
                    >
                      Deny Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm text-slate-500">
              No pending permission requests. All current access is verified and recorded below.
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Active Consents & Permissions</h2>
            {activePermissions.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">
                You have no active data permissions granted.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activePermissions.map(p => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{p.dept}</h3>
                        <p className="text-sm text-slate-500 mt-1">{p.purpose}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold">
                        {p.status}
                      </span>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Granted: {p.grantedDate}</span>
                      <button 
                        onClick={() => handleRevoke(p.id, p.dept)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revoke Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Data Sharing History</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search history by department..." 
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Information Shared</th>
                  <th className="px-6 py-4 font-semibold">Purpose</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No data sharing logs match your search.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">
                        <div className="font-medium">{record.time}</div>
                        <div className="text-xs">{record.date}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{record.dept}</td>
                      <td className="px-6 py-4 text-slate-600">{record.info}</td>
                      <td className="px-6 py-4 text-slate-600">{record.purpose}</td>
                      <td className="px-6 py-4 text-right">
                        {record.status === 'Revoked' ? (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium bg-red-50 px-2.5 py-1 rounded-md text-xs">
                            <XCircle className="w-3 h-3" /> Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-md text-xs">
                            <CheckCircle2 className="w-3 h-3" /> {record.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
