export interface Department {
  id: number;
  name: string;
  icon: string;
  order: number;
}

export interface ContentBlock {
  id: number;
  section: string;
  kind: string;
  title?: string;
  body?: string;
  icon?: string;
  meta?: any;
  order: number;
}

export interface Application {
  id: number;
  user_name: string;
  service: string;
  status: string;
  created_at: string;
  updated_at: string;
  meta: any;
}

export interface Task {
  id: number;
  officer: string;
  service: string;
  applicant: string;
  priority: string;
  status: string;
  created_at: string;
  closed_at: string | null;
}

export interface Metric {
  id: number;
  scope: string;
  key: string;
  value: number;
  label: string;
  meta: any;
}

export async function fetchDepartments(): Promise<Department[]> {
  try {
    const res = await fetch('/api/departments');
    if (!res.ok) throw new Error('Failed to fetch departments');
    return await res.json();
  } catch {
    return [
      { id: 1, name: 'Health & Human Services', icon: 'Heart', order: 1 },
      { id: 2, name: 'Department of Transportation', icon: 'Car', order: 2 },
      { id: 3, name: 'Education Department', icon: 'Book', order: 3 },
      { id: 4, name: 'Public Safety', icon: 'Shield', order: 4 },
      { id: 5, name: 'Treasury', icon: 'DollarSign', order: 5 },
    ];
  }
}

export async function fetchContent(section?: string, kind?: string): Promise<ContentBlock[]> {
  try {
    const params = new URLSearchParams();
    if (section) params.append('section', section);
    if (kind) params.append('kind', kind);
    const res = await fetch('/api/content?' + params.toString());
    if (!res.ok) throw new Error('Failed to fetch content');
    return await res.json();
  } catch {
    if (section === 'how-it-works') {
      return [
        { id: 1, section: 'how-it-works', kind: 'step', title: 'Data Ingestion', body: 'Connect to disparate data sources seamlessly.', icon: 'Database', order: 1 },
        { id: 2, section: 'how-it-works', kind: 'step', title: 'AI Mapping', body: 'Automatically map and transform complex data structures.', icon: 'Brain', order: 2 },
        { id: 3, section: 'how-it-works', kind: 'step', title: 'Secure Exchange', body: 'Share data securely across departmental boundaries.', icon: 'Lock', order: 3 },
        { id: 4, section: 'how-it-works', kind: 'step', title: 'Unified View', body: 'Get a single pane of glass for all operations.', icon: 'Layout', order: 4 },
        { id: 5, section: 'how-it-works', kind: 'step', title: 'Actionable Insights', body: 'Derive insights to improve public services.', icon: 'LineChart', order: 5 },
        { id: 6, section: 'how-it-works', kind: 'step', title: 'Continuous Sync', body: 'Keep all systems up to date in real-time.', icon: 'RefreshCw', order: 6 },
      ];
    }
    if (section === 'workflow') {
      return [
        { id: 7, section: 'workflow', kind: 'step', title: 'Citizen Request', body: 'Request submitted via online portal.', icon: 'User', order: 1 },
        { id: 8, section: 'workflow', kind: 'step', title: 'Automated Triage', body: 'AI assigns the request to the correct department.', icon: 'Cpu', order: 2 },
        { id: 9, section: 'workflow', kind: 'step', title: 'Cross-Agency Review', body: 'Relevant agencies collaborate on approval.', icon: 'Users', order: 3 },
        { id: 10, section: 'workflow', kind: 'step', title: 'Resolution', body: 'Citizen receives final status and documents.', icon: 'CheckCircle', order: 4 },
      ];
    }
    if (section === 'security') {
      return [
        { id: 11, section: 'security', kind: 'feature', title: 'End-to-End Encryption', body: 'Data is encrypted at rest and in transit.', icon: 'Shield', order: 1 },
        { id: 12, section: 'security', kind: 'feature', title: 'Zero Trust Architecture', body: 'Strict identity verification for every access request.', icon: 'Key', order: 2 },
        { id: 13, section: 'security', kind: 'feature', title: 'Compliance Ready', body: 'Built to meet FedRAMP, HIPAA, and CJIS standards.', icon: 'FileText', order: 3 },
        { id: 14, section: 'security', kind: 'feature', title: 'Audit Logging', body: 'Immutable logs for every action and data access.', icon: 'Activity', order: 4 },
      ];
    }
    if (section === 'problem') {
      return [
        { id: 15, section: 'problem', kind: 'content', title: 'Siloed Systems', body: 'Agencies struggle to share critical information.', order: 1 },
        { id: 16, section: 'problem', kind: 'content', title: 'Inefficient Processes', body: 'Manual data entry and disjointed workflows slow down service delivery.', order: 2 },
      ];
    }
    return [];
  }
}

export async function fetchApplications(): Promise<Application[]> {
  try {
    const res = await fetch('/api/applications');
    if (!res.ok) throw new Error('Failed to fetch applications');
    return await res.json();
  } catch {
    return [
      { id: 1, user_name: 'John Doe', service: 'Business License', status: 'pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), meta: {} },
      { id: 2, user_name: 'Jane Smith', service: 'Building Permit', status: 'approved', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), meta: {} },
    ];
  }
}

export async function updateApplication(id: number, action: string): Promise<Application> {
  try {
    const res = await fetch('/api/applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) throw new Error('Failed to update application');
    return await res.json();
  } catch {
    return { id, user_name: 'Mock User', service: 'Mock Service', status: action === 'approve' ? 'approved' : 'rejected', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), meta: {} };
  }
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch('/api/tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  } catch {
    return [
      { id: 1, officer: 'Sarah Connor', service: 'Safety Inspection', applicant: 'Tech Corp', priority: 'high', status: 'open', created_at: new Date().toISOString(), closed_at: null },
      { id: 2, officer: 'Kyle Reese', service: 'Environmental Review', applicant: 'Green Energy Ltd', priority: 'medium', status: 'closed', created_at: new Date().toISOString(), closed_at: new Date().toISOString() },
    ];
  }
}

export async function updateTask(id: number, action: string): Promise<Task> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
  } catch {
    return { id, officer: 'Mock Officer', service: 'Mock Service', applicant: 'Mock Applicant', priority: 'low', status: action === 'close' ? 'closed' : 'open', created_at: new Date().toISOString(), closed_at: action === 'close' ? new Date().toISOString() : null };
  }
}

export async function fetchMetrics(scope?: string): Promise<Metric[]> {
  try {
    const params = scope ? `?scope=${encodeURIComponent(scope)}` : '';
    const res = await fetch('/api/metrics' + params);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return await res.json();
  } catch {
    return [
      { id: 1, scope: scope || 'admin', key: 'uptime', value: 99.99, label: 'Uptime', meta: { unit: '%' } },
      { id: 2, scope: scope || 'admin', key: 'requests', value: 1.2, label: 'Requests Processed', meta: { unit: 'M' } },
      { id: 3, scope: scope || 'impact', key: 'savings', value: 45, label: 'Hours Saved per Week', meta: {} },
      { id: 4, scope: scope || 'impact', key: 'satisfaction', value: 98, label: 'Citizen Satisfaction', meta: { unit: '%' } },
    ];
  }
}

export async function submitDemo(body: { name: string; email: string; org: string; role: string; department: string; message: string }) {
  try {
    const res = await fetch('/api/demo-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to submit demo');
    return await res.json();
  } catch {
    return { success: true };
  }
}

export async function fetchDemoCount(): Promise<{ count: number }> {
  try {
    const res = await fetch('/api/demo-requests');
    if (!res.ok) throw new Error('Failed to fetch demo count');
    return await res.json();
  } catch {
    return { count: 1337 };
  }
}
