import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, GraduationCap, HeartHandshake, Building2, 
  Stethoscope, Bus, Wheat, HardHat, Landmark, ArrowRight, Filter
} from 'lucide-react';

export default function ServiceDiscovery() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const services = [
    {
      id: 'scholarship',
      title: 'State Scholarship Eligibility',
      department: 'Education',
      desc: 'Check scholarship eligibility and auto-verify income & academic credentials.',
      reqs: ['Identity', 'Education Records', 'Income'],
      icon: GraduationCap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 'welfare-benefits',
      title: 'Social Welfare & Pension Support',
      department: 'Welfare',
      desc: 'Apply for monthly welfare assistance, social allowances, and direct cash benefits.',
      reqs: ['Identity', 'Income', 'Age Verification'],
      icon: HeartHandshake,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'property-registration',
      title: 'Property Title & Mutation',
      department: 'Municipal',
      desc: 'Register real estate property, transfer deed titles, and clear civic taxes.',
      reqs: ['Identity', 'Property Deed', 'Tax Clearance'],
      icon: Building2,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'health-insurance',
      title: 'Universal Health Coverage Scheme',
      department: 'Health',
      desc: 'Enroll your family in cashless state medical coverage and hospital network.',
      reqs: ['Identity', 'Income Bracket', 'Family Demographics'],
      icon: Stethoscope,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200'
    },
    {
      id: 'driving-license',
      title: 'Driver License & Smart Card',
      department: 'Transport',
      desc: 'Apply for fresh or renewal driving permit with auto-verified medical fitness.',
      reqs: ['Identity', 'Residence Proof', 'Medical Check'],
      icon: Bus,
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'farmer-subsidy',
      title: 'Agricultural Subsidy & Seed Grant',
      department: 'Agriculture',
      desc: 'Direct fertilizer subsidy, modern machinery grants, and seed loan assistance.',
      reqs: ['Identity', 'Land Ownership Records', 'Bank Account'],
      icon: Wheat,
      color: 'text-lime-600',
      bg: 'bg-lime-50 border-lime-200'
    },
    {
      id: 'labour-welfare',
      title: 'Unorganized Worker ESIC Card',
      department: 'Labour',
      desc: 'Social safety net, accident insurance, and stipend for registered workforce.',
      reqs: ['Identity', 'Employer/Contractor Details', 'Bank Account'],
      icon: HardHat,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'tax-clearance',
      title: 'Revenue Tax Exemption Certificate',
      department: 'Revenue',
      desc: 'Obtain digital exemption certification for eligible non-taxable income brackets.',
      reqs: ['Identity', 'ITR/Annual Returns', 'Bank Statements'],
      icon: Landmark,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-200'
    }
  ];

  const filteredServices = services.filter(svc => {
    const matchesSearch = 
      svc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || svc.department.toLowerCase() === selectedDept.toLowerCase();

    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Government Service Discovery</h1>
        <p className="text-slate-600 mt-2 text-lg">
          Zero paperwork application process powered by GovSync Nexus inter-department data verification.
        </p>
        
        {/* Search Bar */}
        <div className="mt-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by service name, department, or keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-base"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {[
            { label: 'All Departments', value: 'ALL' },
            { label: 'Education', value: 'Education' },
            { label: 'Welfare', value: 'Welfare' },
            { label: 'Health', value: 'Health' },
            { label: 'Municipal', value: 'Municipal' },
            { label: 'Transport', value: 'Transport' },
            { label: 'Agriculture', value: 'Agriculture' },
            { label: 'Labour', value: 'Labour' },
            { label: 'Revenue', value: 'Revenue' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setSelectedDept(f.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedDept === f.value
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500">No services match your current search.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedDept('ALL'); }}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-sm hover:bg-indigo-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map(svc => (
            <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${svc.bg} ${svc.color}`}>
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{svc.title}</h2>
                    <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{svc.department} Department</div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-6">{svc.desc}</p>
                
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Auto-Verified Records</div>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.reqs.map(req => (
                      <span key={req} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/citizen/apply/${svc.id}`)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Apply with GovSync</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
