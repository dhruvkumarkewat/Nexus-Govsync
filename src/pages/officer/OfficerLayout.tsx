import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { ThemeToggle } from '../../lib/ThemeProvider';
import { LayoutDashboard, FileText, CheckSquare, AlertTriangle, LogOut } from 'lucide-react';

export default function OfficerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'Officer') {
    return (
      <div className="min-h-screen flex items-center justify-center gs-bg">
        <div className="gs-card p-8 text-center max-w-sm w-full">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h1 className="text-lg font-semibold gs-text mb-1">Unauthorized Access</h1>
          <p className="text-sm gs-text-muted mb-5">You must be logged in as an Officer to view this page.</p>
          <button onClick={() => navigate('/login')} className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/officer', icon: LayoutDashboard },
    { name: 'Applications Queue', path: '/officer/applications', icon: FileText },
    { name: 'Verification Tasks', path: '/officer/tasks', icon: CheckSquare },
    { name: 'Data Conflicts', path: '/officer/conflicts', icon: AlertTriangle },
  ];

  const displayName = user?.name.startsWith('Login as ') ? user.name.replace('Login as ', '') : user?.name;
  const initials = displayName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen font-sans" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-fg)' }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col shrink-0" style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
        {/* Logo */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold tracking-wider">GS</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--color-fg)' }}>GovSync Nexus</span>
          </div>
          <div className="text-[10px] font-medium mt-1.5 tracking-widest uppercase" style={{ color: 'var(--color-fg-subtle)' }}>{user.department} Portal</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/officer'}
              className={({ isActive }) => `gs-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-2 py-3 space-y-1" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 px-2 py-2 rounded-md" style={{ backgroundColor: 'var(--color-surface-3)' }}>
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium truncate" style={{ color: 'var(--color-fg)' }}>{displayName?.split(' ')[0]}</div>
              <div className="text-[10px]" style={{ color: 'var(--color-fg-subtle)' }}>{user.department} Officer</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
            style={{ color: 'var(--color-fg-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 flex items-center px-6 justify-between shrink-0" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="text-xs font-medium" style={{ color: 'var(--color-fg-muted)' }}>{user.department} Department Portal</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-fg-subtle)' }}>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              GovSync Nexus — Secure Interoperability Layer
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
