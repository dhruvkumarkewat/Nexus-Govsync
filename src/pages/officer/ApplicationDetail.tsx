import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { mockDB, MockApplication, WorkflowStep } from '../../lib/mockDatabase';
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [application, setApplication] = useState<MockApplication | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      mockDB.getApplicationById(id).then(app => {
        if (app) {
          setApplication(app);
          mockDB.getWorkflowSteps(id).then(setWorkflow);
        }
      });
    }
  }, [id, loading]);

  if (!application) return <div className="p-8 text-center text-slate-500">Loading application...</div>;

  const currentTask = workflow.find(w => (w.status === 'PENDING' || w.status === 'IN_PROGRESS') && w.department === user?.department);

  const handleAction = async (status: 'COMPLETED' | 'CONFLICT') => {
    if (!currentTask || !user) return;
    setLoading(true);
    await mockDB.updateWorkflowStep(currentTask.id, status, user.id);
    setLoading(false);
    navigate('/officer/applications');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{application.id}</h1>
            <span className={`px-2.5 py-1 rounded text-xs font-bold bg-slate-200 text-slate-700 uppercase tracking-wider`}>
              {application.status}
            </span>
          </div>
          <p className="text-slate-500">{application.service}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {currentTask ? (
            <div className="bg-white border-2 border-indigo-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <h2 className="font-bold text-indigo-900 text-lg">Action Required: {currentTask.step_name}</h2>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Verify the information below. High confidence matches have been pre-validated by the system, but final authorization requires officer approval.
                </p>
                
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 mb-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Source Department</span>
                    <span className="text-slate-900 font-semibold">{currentTask.department} Database</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Citizen</span>
                    <span className="text-slate-900 font-semibold">Rahul Kumar (UID: **** **** 1234)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">AI Match Confidence</span>
                    <span className="flex items-center gap-2 px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">
                      <CheckCircle2 className="w-3 h-3" /> 98% (High Confidence)
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAction('COMPLETED')}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Clock className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Approve Verification
                  </button>
                  <button 
                    onClick={() => handleAction('CONFLICT')}
                    disabled={loading}
                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Raise Conflict
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-slate-900 mb-2">No Action Required</h2>
              <p className="text-slate-500">Your department has completed its required actions for this application.</p>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Application Data (Authorized Fields)</h2>
            </div>
            <div className="p-6 text-sm text-slate-600">
              <p className="mb-4">You are only seeing fields authorized for your department's current workflow step. Data minimization is strictly enforced.</p>
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 font-medium">Status</td>
                    <td className="py-3 text-slate-900">Valid</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 font-medium">Last Verified</td>
                    <td className="py-3 text-slate-900">12 Aug 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Workflow Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {workflow.map((step, idx) => (
                  <div key={step.id} className="relative pl-6">
                    {/* Vertical Line */}
                    {idx < workflow.length - 1 && (
                      <div className={`absolute left-[11px] top-6 bottom-[-24px] w-0.5 ${step.status === 'COMPLETED' ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    )}
                    
                    {/* Dot */}
                    <div className={`absolute left-0 top-1 w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 bg-white
                      ${step.status === 'COMPLETED' ? 'border-indigo-600' : step.status === 'PENDING' ? 'border-amber-400' : 'border-slate-300'}`}
                    >
                      {step.status === 'COMPLETED' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>}
                      {step.status === 'PENDING' && <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>}
                    </div>

                    <div>
                      <div className={`text-sm font-bold ${step.status === 'COMPLETED' ? 'text-indigo-900' : step.status === 'PENDING' ? 'text-amber-700' : 'text-slate-500'}`}>
                        {step.step_name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{step.department}</div>
                      {step.status === 'COMPLETED' && (
                        <div className="text-[10px] text-slate-400 mt-1">{new Date(step.completed_at!).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
