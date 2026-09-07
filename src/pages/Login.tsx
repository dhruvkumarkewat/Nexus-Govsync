import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '../lib/auth';
import { supabase } from '../lib/supabase';
import {
  User as UserIcon, Landmark, HeartHandshake, GraduationCap,
  Stethoscope, Building2, Bus, Wheat, HardHat, Shield
} from 'lucide-react';

const citizenProfile: User = {
  id: 'citizen_1',
  name: 'Citizen',
  role: 'Citizen',
  permissions: ['apply', 'view_history', 'manage_permissions']
};

const officerProfiles: { user: User; icon: React.ReactNode; color: string; description: string }[] = [
  {
    user: { id: 'officer_rev_1', name: 'Revenue Officer', role: 'Officer', department: 'Revenue', permissions: ['verify_income', 'verify_tax', 'resolve_conflicts'] },
    icon: <Landmark className="w-5 h-5" />, color: 'sky',
    description: 'Income & Tax Verification'
  },
  {
    user: { id: 'officer_wel_1', name: 'Welfare Officer', role: 'Officer', department: 'Welfare', permissions: ['verify_eligibility', 'review_benefits'] },
    icon: <HeartHandshake className="w-5 h-5" />, color: 'amber',
    description: 'Benefits & Social Schemes'
  },
  {
    user: { id: 'officer_edu_1', name: 'Education Officer', role: 'Officer', department: 'Education', permissions: ['verify_education', 'verify_enrollment'] },
    icon: <GraduationCap className="w-5 h-5" />, color: 'emerald',
    description: 'Scholarships & Enrollment'
  },
  {
    user: { id: 'officer_health_1', name: 'Health Officer', role: 'Officer', department: 'Health', permissions: ['verify_health', 'issue_certificates'] },
    icon: <Stethoscope className="w-5 h-5" />, color: 'rose',
    description: 'Health Insurance & Certificates'
  },
  {
    user: { id: 'officer_mun_1', name: 'Municipal Officer', role: 'Officer', department: 'Municipal', permissions: ['verify_identity', 'verify_residence', 'property'] },
    icon: <Building2 className="w-5 h-5" />, color: 'purple',
    description: 'Property, ID & Civic Services'
  },
  {
    user: { id: 'officer_transport_1', name: 'Transport Officer', role: 'Officer', department: 'Transport', permissions: ['verify_vehicle', 'issue_license'] },
    icon: <Bus className="w-5 h-5" />, color: 'orange',
    description: 'Licenses & Vehicle Registration'
  },
  {
    user: { id: 'officer_agri_1', name: 'Agriculture Officer', role: 'Officer', department: 'Agriculture', permissions: ['verify_land', 'process_subsidies'] },
    icon: <Wheat className="w-5 h-5" />, color: 'lime',
    description: 'Farm Subsidies & Crop Insurance'
  },
  {
    user: { id: 'officer_labour_1', name: 'Labour Officer', role: 'Officer', department: 'Labour', permissions: ['verify_employment', 'labour_registration'] },
    icon: <HardHat className="w-5 h-5" />, color: 'indigo',
    description: 'Employment & Labour Welfare'
  },
];

const colorMap: Record<string, string> = {
  sky: 'bg-sky-900/30 border-sky-700/50 text-sky-300 hover:border-sky-500/80',
  amber: 'bg-amber-900/30 border-amber-700/50 text-amber-300 hover:border-amber-500/80',
  emerald: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300 hover:border-emerald-500/80',
  rose: 'bg-rose-900/30 border-rose-700/50 text-rose-300 hover:border-rose-500/80',
  purple: 'bg-purple-900/30 border-purple-700/50 text-purple-300 hover:border-purple-500/80',
  orange: 'bg-orange-900/30 border-orange-700/50 text-orange-300 hover:border-orange-500/80',
  lime: 'bg-lime-900/30 border-lime-700/50 text-lime-300 hover:border-lime-500/80',
  indigo: 'bg-indigo-900/30 border-indigo-700/50 text-indigo-300 hover:border-indigo-500/80',
};

const iconBgMap: Record<string, string> = {
  sky: 'bg-sky-500/20 text-sky-300',
  amber: 'bg-amber-500/20 text-amber-300',
  emerald: 'bg-emerald-500/20 text-emerald-300',
  rose: 'bg-rose-500/20 text-rose-300',
  purple: 'bg-purple-500/20 text-purple-300',
  orange: 'bg-orange-500/20 text-orange-300',
  lime: 'bg-lime-500/20 text-lime-300',
  indigo: 'bg-indigo-500/20 text-indigo-300',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    login(user);
    if (user.role === 'Admin') navigate('/admin');
    else if (user.role === 'Officer') navigate('/officer');
    else navigate('/citizen');
  };

  return (
    <div className="min-h-screen gs-bg flex items-start justify-center p-6 pt-12 pb-20 font-sans">
      <div className="max-w-5xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-widest">GS</span>
            </div>
            <span className="font-semibold text-base" style={{ color: 'var(--color-fg)' }}>GovSync Nexus</span>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-fg)' }}>Select Your Portal</h1>
          <p className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>Choose your role to access the appropriate dashboard</p>
        </div>

        {/* Citizen Section */}
        <div className="mb-8">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--color-fg-subtle)' }}>Citizen / User</div>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/citizen` }
              });
              
              if (error) {
                console.error('Google Auth Error:', error.message);
                alert(`Authentication failed: ${error.message}`);
              }
            }}
            className="w-full rounded-lg p-4 text-left transition-all group flex items-center gap-4"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f155')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)')}
          >
            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-300 rounded-lg flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>Citizen Portal</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>Apply for government services, track your applications, manage data permissions & consents</div>
            </div>
            <div className="ml-auto shrink-0 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5">
              Login with Google
            </div>
          </button>
        </div>

        {/* Officer Section */}
        <div className="mb-8">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--color-fg-subtle)' }}>Government Officers — Select Department</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {officerProfiles.map(({ user, icon, color, description }) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className={`border rounded-xl p-5 text-left transition-all group flex flex-col gap-3 ${colorMap[color]}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconBgMap[color]}`}>
                  {icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{user.department} Dept.</div>
                  <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        <div className="mb-8">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--color-fg-subtle)' }}>Administration</div>
          <button
            onClick={() => handleLogin({ id: 'admin_1', name: 'Admin', role: 'Admin', permissions: ['manage_system'] })}
            className="w-full rounded-lg p-4 text-left transition-all group flex items-center gap-4"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f155')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)')}
          >
            <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-transform" style={{ backgroundColor: 'var(--color-surface-3)', color: '#eab308' }}>
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>System Administrator</div>
              <div className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>Full platform access — manage departments, users, audit logs</div>
            </div>
          </button>
        </div>

        <div className="text-center text-xs" style={{ color: 'var(--color-fg-subtle)' }}>
          This is a prototype using synthetic data. No real citizen information is used.
        </div>
      </div>
    </div>
  );
}
