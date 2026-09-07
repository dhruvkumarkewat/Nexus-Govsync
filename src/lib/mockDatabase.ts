import { supabase } from './supabase';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface MockApplication {
  id: string;
  citizen_id: string;
  service: string;
  department: string;
  current_step: string;
  status: 'Pending' | 'In Review' | 'Waiting' | 'Completed' | 'Conflict' | 'Escalated' | 'Rejected';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  application_id: string;
  department: string;
  step_name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CONFLICT';
  started_at?: string;
  completed_at?: string;
  assigned_officer?: string;
  reason?: string;
  order_idx: number;
  // Keep legacy alias for components that still use `order`
  order?: number;
}

export interface DataConflict {
  id: string;
  application_id: string;
  field: string;
  source_a: string;
  source_b: string;
  value_a: string;
  value_b: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'RESOLVED' | 'ESCALATED';
  detected_at: string;
  // Legacy snake_case aliases
  sourceA?: string;
  sourceB?: string;
  valueA?: string;
  valueB?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapStep(s: Record<string, unknown>): WorkflowStep {
  return { ...s, order: s.order_idx as number } as WorkflowStep;
}

function mapConflict(c: Record<string, unknown>): DataConflict {
  return {
    ...c,
    sourceA: c.source_a as string,
    sourceB: c.source_b as string,
    valueA: c.value_a as string,
    valueB: c.value_b as string,
  } as DataConflict;
}

// ─── Database API ────────────────────────────────────────────────────────────

export const mockDB = {
  // Applications
  async getApplications(): Promise<MockApplication[]> {
    const { data, error } = await supabase.from('applications').select('*').order('updated_at', { ascending: false });
    if (error) { console.error('getApplications:', error); return []; }
    return data as MockApplication[];
  },

  async getApplicationsForDepartment(department: string): Promise<MockApplication[]> {
    // Get application IDs that have a pending/in-progress/conflict step for this department
    const { data: steps, error: stepError } = await supabase
      .from('workflow_steps')
      .select('application_id')
      .eq('department', department)
      .in('status', ['PENDING', 'IN_PROGRESS', 'CONFLICT']);

    if (stepError || !steps || steps.length === 0) return [];

    const ids = [...new Set(steps.map((s: { application_id: string }) => s.application_id))];

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .in('id', ids)
      .order('updated_at', { ascending: false });

    if (error) { console.error('getApplicationsForDepartment:', error); return []; }
    return data as MockApplication[];
  },

  async getApplicationsForCitizen(citizenId: string): Promise<MockApplication[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('citizen_id', citizenId)
      .order('updated_at', { ascending: false });
    if (error) { console.error('getApplicationsForCitizen:', error); return []; }
    return data as MockApplication[];
  },

  async getApplicationById(id: string): Promise<MockApplication | null> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.error('getApplicationById:', error); return null; }
    return data as MockApplication;
  },

  async createApplication(params: {
    citizen_id: string;
    service: string;
    department: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    steps: { department: string; step_name: string }[];
  }): Promise<MockApplication> {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `GS-${randomNum}`;
    const timestamp = new Date().toISOString();
    const firstStep = params.steps[0]?.step_name ?? 'Application Submitted';

    const newApp = {
      id: newId,
      citizen_id: params.citizen_id,
      service: params.service,
      department: params.department,
      current_step: firstStep,
      status: 'In Review' as const,
      priority: params.priority ?? 'MEDIUM',
      created_at: timestamp,
      updated_at: timestamp,
    };

    const { error: appErr } = await supabase.from('applications').insert([newApp]);
    if (appErr) console.error('createApplication insert:', appErr);

    const newSteps = params.steps.map((st, index) => ({
      id: `ws_${newId}_${index + 1}`,
      application_id: newId,
      department: st.department,
      step_name: st.step_name,
      status: index === 0 ? 'IN_PROGRESS' : 'PENDING',
      order_idx: index + 1,
    }));

    const { error: stepsErr } = await supabase.from('workflow_steps').insert(newSteps);
    if (stepsErr) console.error('createApplication steps insert:', stepsErr);

    return newApp;
  },

  // Workflow Steps
  async getWorkflowSteps(applicationId: string): Promise<WorkflowStep[]> {
    const { data, error } = await supabase
      .from('workflow_steps')
      .select('*')
      .eq('application_id', applicationId)
      .order('order_idx', { ascending: true });
    if (error) { console.error('getWorkflowSteps:', error); return []; }
    return (data as Record<string, unknown>[]).map(mapStep);
  },

  async updateWorkflowStep(
    stepId: string,
    status: WorkflowStep['status'],
    officerId: string
  ): Promise<void> {
    const updates: Record<string, unknown> = {
      status,
      assigned_officer: officerId,
      ...(status !== 'PENDING' ? { completed_at: new Date().toISOString() } : {})
    };

    const { data: stepData, error: stepErr } = await supabase
      .from('workflow_steps')
      .update(updates)
      .eq('id', stepId)
      .select()
      .single();

    if (stepErr || !stepData) { console.error('updateWorkflowStep:', stepErr); return; }
    const step = stepData as WorkflowStep;

    if (status === 'COMPLETED') {
      // Check if there's a next step
      const { data: nextSteps } = await supabase
        .from('workflow_steps')
        .select('*')
        .eq('application_id', step.application_id)
        .eq('order_idx', step.order_idx + 1)
        .single();

      if (nextSteps) {
        const next = nextSteps as WorkflowStep;
        // Activate next step
        await supabase.from('workflow_steps').update({ status: 'IN_PROGRESS' }).eq('id', next.id);
        // Update application current step and department
        await supabase.from('applications').update({
          current_step: next.step_name,
          department: next.department,
          status: 'In Review',
          updated_at: new Date().toISOString(),
        }).eq('id', step.application_id);
      } else {
        // All steps done — mark completed
        await supabase.from('applications').update({
          status: 'Completed',
          current_step: 'Completed',
          updated_at: new Date().toISOString(),
        }).eq('id', step.application_id);
      }
    }

    if (status === 'CONFLICT') {
      await supabase.from('applications').update({
        status: 'Conflict',
        updated_at: new Date().toISOString(),
      }).eq('id', step.application_id);
    }
  },

  // Conflicts
  async getConflictsForDepartment(department: string): Promise<DataConflict[]> {
    const { data, error } = await supabase
      .from('conflicts')
      .select('*')
      .or(`source_a.eq.${department},source_b.eq.${department}`);
    if (error) { console.error('getConflictsForDepartment:', error); return []; }
    return (data as Record<string, unknown>[]).map(mapConflict);
  },

  async getAllConflicts(): Promise<DataConflict[]> {
    const { data, error } = await supabase.from('conflicts').select('*');
    if (error) { console.error('getAllConflicts:', error); return []; }
    return (data as Record<string, unknown>[]).map(mapConflict);
  },

  async resolveConflict(conflictId: string): Promise<void> {
    await supabase.from('conflicts').update({ status: 'RESOLVED' }).eq('id', conflictId);
  },

  async escalateConflict(conflictId: string): Promise<void> {
    await supabase.from('conflicts').update({ status: 'ESCALATED' }).eq('id', conflictId);
  },

  async getStats(department: string): Promise<{
    pending: number;
    completed: number;
    conflicts: number;
    highPriority: number;
  }> {
    const [{ data: pending }, { data: completed }, { data: conflicts }, { data: highPriority }] =
      await Promise.all([
        supabase.from('workflow_steps').select('id', { count: 'exact' }).eq('department', department).in('status', ['PENDING', 'IN_PROGRESS']),
        supabase.from('workflow_steps').select('id', { count: 'exact' }).eq('department', department).eq('status', 'COMPLETED'),
        supabase.from('conflicts').select('id', { count: 'exact' }).or(`source_a.eq.${department},source_b.eq.${department}`).eq('status', 'OPEN'),
        supabase.from('applications').select('id', { count: 'exact' }).eq('department', department).eq('priority', 'HIGH'),
      ]);

    return {
      pending: (pending as unknown[])?.length ?? 0,
      completed: (completed as unknown[])?.length ?? 0,
      conflicts: (conflicts as unknown[])?.length ?? 0,
      highPriority: (highPriority as unknown[])?.length ?? 0,
    };
  },
};
