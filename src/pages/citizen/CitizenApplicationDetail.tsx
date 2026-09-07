import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDB, MockApplication, WorkflowStep } from '../../lib/mockDatabase';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Building2, ShieldCheck, Download, HelpCircle, Check, Loader2 } from 'lucide-react';

export default function CitizenApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<MockApplication | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([mockDB.getApplicationById(id), mockDB.getWorkflowSteps(id)]).then(([app, wfSteps]) => {
      setApplication(app);
      setSteps(wfSteps);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="w-9 h-9 text-indigo-500 animate-spin" /></div>;
  }

  if (!application) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Application Not Found</h2>
          <p className="text-slate-500 mt-2 mb-6">Could not find details for application ID: {id}</p>
          <button onClick={() => navigate('/citizen/applications')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to My Applications
          </button>
        </div>
      </div>
    );
  }

  const completedSteps = steps.filter(s => s.status === 'COMPLETED').length;
  const progressPercent = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

  const handleDownloadReceipt = () => {
    setDownloadSuccess(true);
    const text = `GOVSYNC NEXUS — CITIZEN APPLICATION RECEIPT\n--------------------------------------------\nApplication ID: ${application.id}\nService: ${application.service}\nDepartment: ${application.department}\nStatus: ${application.status}\nSubmitted: ${new Date(application.created_at).toLocaleString()}\nLast Updated: ${new Date(application.updated_at).toLocaleString()}\n--------------------------------------------\nVerified through GovSync Interoperable Government Network.`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `GovSync_Receipt_${application.id}.txt`; a.click();
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <button onClick={() => navigate('/citizen/applications')} className="text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-2 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs rounded-lg border border-indigo-200">{application.id}</span>
              <span className="text-xs text-slate-500 font-medium">Submitted on {new Date(application.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">{application.service}</h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Managing: <span className="font-semibold text-slate-700">{application.department} Department</span></p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleDownloadReceipt} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
              {downloadSuccess ? <><Check className="w-4 h-4 text-emerald-600" /><span className="text-emerald-700">Downloaded!</span></> : <><Download className="w-4 h-4" />Download Receipt</>}
            </button>
            <button onClick={() => navigate('/citizen/support')} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Need Help?
            </button>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700">Overall Verification Progress</span>
            <span className="font-bold text-indigo-700">{progressPercent}% ({completedSteps}/{steps.length} Steps)</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 rounded-full ${application.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-600" /> Inter-Department Verification Timeline</h2>
            <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 ml-4">
              {steps.map(step => {
                const isCompleted = step.status === 'COMPLETED';
                const isInProgress = step.status === 'IN_PROGRESS';
                const isConflict = step.status === 'CONFLICT';
                return (
                  <div key={step.id} className="relative">
                    <div className={`absolute -left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${isCompleted ? 'bg-emerald-500 text-white' : isInProgress ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse' : isConflict ? 'bg-red-500 text-white' : 'bg-white border-2 border-slate-300 text-slate-400'}`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isConflict ? <AlertCircle className="w-4 h-4" /> : (step.order_idx || step.order || 0)}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{step.step_name}</span>
                          <span className="px-2 py-0.5 bg-white text-slate-600 rounded text-xs font-medium border border-slate-200">{step.department}</span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit ${isCompleted ? 'bg-emerald-100 text-emerald-700' : isInProgress ? 'bg-indigo-100 text-indigo-700' : isConflict ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {isCompleted && step.completed_at ? `Completed on ${new Date(step.completed_at).toLocaleString()}` : isInProgress ? 'Verification in progress by authorized department officer.' : isConflict ? 'Data discrepancy detected. Under officer review.' : 'Queued for automated inter-department data exchange.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><ShieldCheck className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Zero-Paperwork Interoperability</h3>
            <p className="text-sm text-slate-600 leading-relaxed">All documents are verified directly with the source department. No duplicate physical submissions required.</p>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              {['End-to-end audit logged', 'Consent-bounded data sharing', 'Encrypted inter-department API'].map(t => (
                <div key={t} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}</div>
              ))}
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h3 className="font-bold text-indigo-900 mb-2">Manage Data Permissions</h3>
            <p className="text-sm text-indigo-700 mb-4">View or revoke active data sharing permissions for this service at any time.</p>
            <button onClick={() => navigate('/citizen/permissions')} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
              View Data Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
