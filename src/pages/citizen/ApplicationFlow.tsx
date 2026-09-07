import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { mockDB } from '../../lib/mockDatabase';
import { 
  CheckCircle2, ShieldAlert, ArrowRight, ArrowLeft, Loader2, 
  Building2, Lock, ShieldCheck, FileCheck
} from 'lucide-react';

interface ServiceDef {
  title: string;
  department: string;
  overview: string;
  dataSources: { name: string; source: string; status: 'Verified' | 'Permission Required' }[];
  requestingDept: string;
  purpose: string;
  requestedFields: string[];
  workflowSteps: { department: string; step_name: string }[];
}

const SERVICE_REGISTRY: Record<string, ServiceDef> = {
  'scholarship': {
    title: 'State Scholarship Eligibility',
    department: 'Education',
    overview: 'Verifies academic records and family income automatically across departments without physical documents.',
    dataSources: [
      { name: 'Identity & Address', source: 'National Citizen Registry (Municipal)', status: 'Verified' },
      { name: 'Academic Transcript', source: 'State Board of Education', status: 'Verified' },
      { name: 'Annual Income', source: 'Revenue Department', status: 'Permission Required' },
    ],
    requestingDept: 'Education Department',
    purpose: 'Scholarship Eligibility & Income Bracket Verification',
    requestedFields: ['Annual Family Income', 'Income Certificate Authenticity'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Identity & Residence Verified' },
      { department: 'Education', step_name: 'Academic Record Check' },
      { department: 'Revenue', step_name: 'Income Bracket Verification' },
      { department: 'Education', step_name: 'Scholarship Award Grant' }
    ]
  },
  'welfare-benefits': {
    title: 'Social Welfare & Pension Support',
    department: 'Welfare',
    overview: 'Automated pension & monthly benefit enrolment through synchronized municipal and revenue records.',
    dataSources: [
      { name: 'Identity & Age Proof', source: 'Municipal Corporation', status: 'Verified' },
      { name: 'Income Assessment', source: 'Revenue Department', status: 'Permission Required' },
    ],
    requestingDept: 'Welfare Department',
    purpose: 'Social Benefit Calculation & Eligibility',
    requestedFields: ['Household Income Assessment', 'Bank Account Verification'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Identity & Age Verification' },
      { department: 'Revenue', step_name: 'Household Income Check' },
      { department: 'Welfare', step_name: 'Benefit Sanction & Enrollment' }
    ]
  },
  'property-registration': {
    title: 'Property Title & Mutation',
    department: 'Municipal',
    overview: 'Seamless municipal deed registration with instantaneous revenue stamp clearance.',
    dataSources: [
      { name: 'Owner Identity', source: 'Municipal Registry', status: 'Verified' },
      { name: 'Tax Clearance Record', source: 'Revenue Department', status: 'Permission Required' },
    ],
    requestingDept: 'Municipal Corporation',
    purpose: 'Property Title Mutation & Tax Clearance',
    requestedFields: ['Property Tax Dues Clearance', 'Land Valuation'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Title Deed Verification' },
      { department: 'Revenue', step_name: 'Tax Assessment & Clearance' },
      { department: 'Municipal', step_name: 'Digital Mutation Certificate' }
    ]
  },
  'health-insurance': {
    title: 'Universal Health Coverage Scheme',
    department: 'Health',
    overview: 'Cashless health insurance card with automated income tier bracket check.',
    dataSources: [
      { name: 'Family ID & Aadhaar', source: 'Municipal Registry', status: 'Verified' },
      { name: 'Income Tier', source: 'Revenue Department', status: 'Permission Required' },
    ],
    requestingDept: 'Health Department',
    purpose: 'Insurance Premium Subsidy Tier Determination',
    requestedFields: ['Annual Taxable Income Tier', 'Dependent Demographics'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Family Demographics Check' },
      { department: 'Revenue', step_name: 'Income Tier Validation' },
      { department: 'Health', step_name: 'Health Card Issuance' }
    ]
  },
  'driving-license': {
    title: 'Driver License & Smart Card',
    department: 'Transport',
    overview: 'Fast-track driving permit issuance with connected medical certificate checks.',
    dataSources: [
      { name: 'Identity & Address', source: 'Municipal Registry', status: 'Verified' },
      { name: 'Medical Fitness Certificate', source: 'Health Department', status: 'Permission Required' },
    ],
    requestingDept: 'Transport Department',
    purpose: 'License Issue & Medical Fitness Verification',
    requestedFields: ['Medical Fitness Report', 'Vision Certification'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Identity & Address Confirmation' },
      { department: 'Health', step_name: 'Medical Fitness Check' },
      { department: 'Transport', step_name: 'License Dispatch' }
    ]
  },
  'farmer-subsidy': {
    title: 'Agricultural Subsidy & Seed Grant',
    department: 'Agriculture',
    overview: 'Direct benefit transfer for agricultural grants verified against land revenue records.',
    dataSources: [
      { name: 'Farmer Identity', source: 'Municipal Records', status: 'Verified' },
      { name: 'Land Ownership Records', source: 'Revenue Department', status: 'Permission Required' },
    ],
    requestingDept: 'Agriculture Department',
    purpose: 'Farmland Parcel Ownership & Subsidy Computation',
    requestedFields: ['Farmland Khata Record', 'Cultivation Category'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Farmer ID Check' },
      { department: 'Revenue', step_name: 'Land Record Cross-Reference' },
      { department: 'Agriculture', step_name: 'Subsidy Disbursement' }
    ]
  },
  'labour-welfare': {
    title: 'Unorganized Worker ESIC Card',
    department: 'Labour',
    overview: 'Social security enrollment and insurance coverage with cross-verified employer data.',
    dataSources: [
      { name: 'Worker Identity', source: 'Municipal Registry', status: 'Verified' },
      { name: 'Employment Records', source: 'Labour Department', status: 'Permission Required' },
    ],
    requestingDept: 'Labour Department',
    purpose: 'Worker Social Security & ESIC Enrollment',
    requestedFields: ['Contractor Registration Code', 'Wage Bracket'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Worker Identity Verification' },
      { department: 'Labour', step_name: 'Employer Registry Check' },
      { department: 'Labour', step_name: 'Smart ESIC Card Issuance' }
    ]
  },
  'tax-clearance': {
    title: 'Revenue Tax Exemption Certificate',
    department: 'Revenue',
    overview: 'Instant digital certificate for exempted earnings brackets.',
    dataSources: [
      { name: 'Identity Records', source: 'Municipal Registry', status: 'Verified' },
      { name: 'Prior Year Filing', source: 'Revenue Department', status: 'Permission Required' },
    ],
    requestingDept: 'Revenue Department',
    purpose: 'Tax Exemption Certification',
    requestedFields: ['Gross Tax Assessment', 'Exemption Eligibility'],
    workflowSteps: [
      { department: 'Municipal', step_name: 'Identity Verification' },
      { department: 'Revenue', step_name: 'Tax Assessment Review' },
      { department: 'Revenue', step_name: 'Certificate Generation' }
    ]
  }
};

export default function ApplicationFlow() {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const service = (serviceId && SERVICE_REGISTRY[serviceId]) || SERVICE_REGISTRY['scholarship'];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    const newApp = await mockDB.createApplication({
      citizen_id: user?.id || 'citizen_1',
      service: service.title,
      department: service.department,
      priority: 'MEDIUM',
      steps: service.workflowSteps
    });
    setLoading(false);
    navigate(`/citizen/applications/${newApp.id}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      {/* Back button */}
      <button 
        onClick={() => navigate('/citizen/services')}
        className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1.5 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">{service.title}</h1>
        <p className="text-slate-600 mt-1 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Managing Department: <strong className="text-slate-800">{service.department} Department</strong></span>
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-10 transition-all duration-500" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        
        {['Overview', 'Available Data', 'Data Consent', 'Submit'].map((label, i) => (
          <div key={label} className="flex flex-col items-center bg-[#f8fafc] px-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors
              ${step > i + 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 
                step === i + 1 ? 'bg-white border-indigo-600 text-indigo-600' : 'bg-white border-slate-300 text-slate-400'}`}
            >
              {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
            </div>
            <div className={`text-xs font-semibold mt-2 ${step >= i + 1 ? 'text-indigo-900 font-bold' : 'text-slate-400'}`}>{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Step 1: Overview */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Overview</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {service.overview} By applying through GovSync Nexus, verified information will be fetched directly from official departmental databases, eliminating physical photocopies and manual attestations.
            </p>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>GovSync Nexus Interoperability Promise:</span>
              </h3>
              <ul className="list-disc pl-5 text-indigo-800 space-y-1.5 text-sm">
                <li>Authorized data is fetched in real-time under your explicit consent.</li>
                <li>No duplicate documents or in-person visits required.</li>
                <li>You can track each department's review progress in your live timeline.</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleNext} 
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Available Information */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Available Information</h2>
            <p className="text-slate-600 mb-6 text-sm">
              GovSync has located your records across government systems. Only unverified or missing data will require cross-department consent.
            </p>
            
            <div className="space-y-4 mb-8">
              {service.dataSources.map((ds, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    ds.status === 'Verified' ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div>
                    <div className={`font-bold ${ds.status === 'Verified' ? 'text-emerald-900' : 'text-amber-900'}`}>
                      {ds.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${ds.status === 'Verified' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      Source: {ds.source}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                    ds.status === 'Verified' 
                      ? 'bg-white text-emerald-700 border-emerald-300' 
                      : 'bg-white text-amber-700 border-amber-300'
                  }`}>
                    {ds.status === 'Verified' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-amber-600" />}
                    <span>{ds.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button 
                onClick={handleBack} 
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={handleNext} 
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Consent & Permissions */}
        {step === 3 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Consent & Permissions</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Under the Data Protection Framework, you control which department can access specific attributes.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{service.requestingDept} requests access</h3>
                  <div className="text-xs text-slate-500">Purpose: {service.purpose}</div>
                </div>
              </div>
              
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Requested Information Attributes:</h4>
              <ul className="space-y-2 mb-6">
                {service.requestedFields.map((field, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
              
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Protected Data (Not Shared):</h4>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                Unrelated personal history, unrequested financial assets or non-pertinent departmental records remain private.
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={handleBack} 
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={handleNext} 
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5" /> Grant Consent & Proceed
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Final Submission */}
        {step === 4 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Review & Submit</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Your application is ready to be dispatched to the GovSync automated workflow engine.
            </p>
            
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8 space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-slate-900">{service.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500">Lead Department</span>
                <span className="font-bold text-slate-900">{service.department} Department</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500">Verification Engine</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Inter-Department Sync
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Scheduled Workflow</span>
                <span className="font-semibold text-slate-700">{service.workflowSteps.length} Verification Steps</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={handleBack} 
                disabled={loading}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70 transition-all cursor-pointer shadow-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileCheck className="w-5 h-5" />}
                <span>{loading ? 'Transmitting to Nexus...' : 'Submit Application'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
