// Supabase setup script - run via: node scripts/setup-supabase.mjs
// This uses the Management API to run SQL and seed data

const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYXp0Ymx1d25hY2xjYnZ5cm1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODUyMDQ3OCwiZXhwIjoyMTA0MDk2NDc4fQ.9ZED4kJSasOJnZWd9TXCebw54vxkDU0C-67lVLhANw0";
const PROJECT_REF = "ymaztbluwnaclcbvyrms";
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

const headers = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation,resolution=merge-duplicates"
};

async function runSQL(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`SQL failed: ${res.status} - ${text}`);
  }
  return JSON.parse(text);
}

async function insert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=minimal,resolution=ignore-duplicates" },
    body: JSON.stringify(rows)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Insert ${table} failed: ${res.status} - ${text}`);
  }
  return true;
}

// STEP 1: Create Tables
console.log("Creating tables...");
try {
  await runSQL(`
    CREATE TABLE IF NOT EXISTS public.applications (
      id TEXT PRIMARY KEY,
      citizen_id TEXT NOT NULL,
      service TEXT NOT NULL,
      department TEXT NOT NULL,
      current_step TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log("✅ applications table created");

  await runSQL(`
    CREATE TABLE IF NOT EXISTS public.workflow_steps (
      id TEXT PRIMARY KEY,
      application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE,
      department TEXT NOT NULL,
      step_name TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      assigned_officer TEXT,
      reason TEXT,
      order_idx INTEGER NOT NULL
    );
  `);
  console.log("✅ workflow_steps table created");

  await runSQL(`
    CREATE TABLE IF NOT EXISTS public.conflicts (
      id TEXT PRIMARY KEY,
      application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE,
      field TEXT NOT NULL,
      source_a TEXT NOT NULL,
      source_b TEXT NOT NULL,
      value_a TEXT,
      value_b TEXT,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      detected_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log("✅ conflicts table created");

  // Enable RLS
  await runSQL(`ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;`);
  await runSQL(`ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;`);
  await runSQL(`ALTER TABLE public.conflicts ENABLE ROW LEVEL SECURITY;`);
  console.log("✅ RLS enabled");

  // Create policies (drop first to avoid conflicts)
  await runSQL(`DROP POLICY IF EXISTS "allow_all_applications" ON public.applications;`);
  await runSQL(`CREATE POLICY "allow_all_applications" ON public.applications FOR ALL TO anon USING (true) WITH CHECK (true);`);
  await runSQL(`DROP POLICY IF EXISTS "allow_all_workflow_steps" ON public.workflow_steps;`);
  await runSQL(`CREATE POLICY "allow_all_workflow_steps" ON public.workflow_steps FOR ALL TO anon USING (true) WITH CHECK (true);`);
  await runSQL(`DROP POLICY IF EXISTS "allow_all_conflicts" ON public.conflicts;`);
  await runSQL(`CREATE POLICY "allow_all_conflicts" ON public.conflicts FOR ALL TO anon USING (true) WITH CHECK (true);`);
  console.log("✅ RLS policies created");

} catch(e) {
  console.error("Error creating tables:", e.message);
  process.exit(1);
}

// STEP 2: Seed Applications
console.log("\nSeeding applications...");
const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();

const applications = [
  { id: 'GS-10821', citizen_id: 'citizen_1', service: 'Scholarship Eligibility', department: 'Education', current_step: 'Income Verification', status: 'Waiting', priority: 'HIGH', created_at: yesterday, updated_at: now },
  { id: 'GS-10817', citizen_id: 'citizen_1', service: 'Social Welfare Benefits', department: 'Welfare', current_step: 'Eligibility Review', status: 'In Review', priority: 'MEDIUM', created_at: twoDaysAgo, updated_at: now },
  { id: 'GS-10834', citizen_id: 'citizen_2', service: 'Home Loan Subsidy', department: 'Revenue', current_step: 'Income Assessment', status: 'In Review', priority: 'HIGH', created_at: yesterday, updated_at: now },
  { id: 'GS-10842', citizen_id: 'citizen_3', service: 'Tax Exemption Certificate', department: 'Revenue', current_step: 'Document Verification', status: 'Pending', priority: 'MEDIUM', created_at: twoDaysAgo, updated_at: yesterday },
  { id: 'GS-10855', citizen_id: 'citizen_4', service: 'Ration Card Application', department: 'Welfare', current_step: 'Family Income Verification', status: 'Pending', priority: 'HIGH', created_at: now, updated_at: now },
  { id: 'GS-10858', citizen_id: 'citizen_5', service: 'Pension Scheme Enrollment', department: 'Welfare', current_step: 'Age & Eligibility Check', status: 'Conflict', priority: 'HIGH', created_at: yesterday, updated_at: now },
  { id: 'GS-10862', citizen_id: 'citizen_6', service: 'Merit Scholarship', department: 'Education', current_step: 'Academic Records Verification', status: 'Pending', priority: 'MEDIUM', created_at: twoDaysAgo, updated_at: yesterday },
  { id: 'GS-10878', citizen_id: 'citizen_8', service: 'State Health Insurance', department: 'Health', current_step: 'Health Records Verification', status: 'Pending', priority: 'HIGH', created_at: now, updated_at: now },
  { id: 'GS-10881', citizen_id: 'citizen_9', service: 'Disability Certificate', department: 'Health', current_step: 'Medical Board Review', status: 'In Review', priority: 'HIGH', created_at: yesterday, updated_at: now },
  { id: 'GS-10890', citizen_id: 'citizen_10', service: 'Property Registration', department: 'Municipal', current_step: 'Ownership Verification', status: 'Pending', priority: 'MEDIUM', created_at: twoDaysAgo, updated_at: yesterday },
  { id: 'GS-10901', citizen_id: 'citizen_12', service: 'Driving License', department: 'Transport', current_step: 'Background Verification', status: 'Pending', priority: 'MEDIUM', created_at: yesterday, updated_at: now },
  { id: 'GS-10910', citizen_id: 'citizen_14', service: 'Farmer Subsidy Scheme', department: 'Agriculture', current_step: 'Land Records Verification', status: 'Pending', priority: 'HIGH', created_at: now, updated_at: now },
  { id: 'GS-10920', citizen_id: 'citizen_16', service: 'Labour Welfare Card', department: 'Labour', current_step: 'Employment Verification', status: 'Pending', priority: 'MEDIUM', created_at: yesterday, updated_at: now },
  { id: 'GS-10923', citizen_id: 'citizen_17', service: 'ESIC Registration', department: 'Labour', current_step: 'Employer Verification', status: 'Conflict', priority: 'HIGH', created_at: twoDaysAgo, updated_at: now },
  { id: 'GS-10790', citizen_id: 'citizen_1', service: 'Property Tax Assessment', department: 'Municipal', current_step: 'Completed', status: 'Completed', priority: 'LOW', created_at: twoDaysAgo, updated_at: yesterday },
  { id: 'GS-10744', citizen_id: 'citizen_1', service: 'Driving License Renewal', department: 'Transport', current_step: 'Completed', status: 'Completed', priority: 'MEDIUM', created_at: twoDaysAgo, updated_at: yesterday },
];
try {
  await insert('applications', applications);
  console.log(`✅ Seeded ${applications.length} applications`);
} catch(e) {
  console.error("Applications seed error:", e.message);
}

// STEP 3: Seed Workflow Steps
console.log("Seeding workflow steps...");
const steps = [
  { id: 'ws_1', application_id: 'GS-10821', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: twoDaysAgo },
  { id: 'ws_2', application_id: 'GS-10821', department: 'Municipal', step_name: 'Residence Verified', status: 'COMPLETED', order_idx: 2, completed_at: yesterday },
  { id: 'ws_3', application_id: 'GS-10821', department: 'Education', step_name: 'Academic Records Verified', status: 'COMPLETED', order_idx: 3, completed_at: yesterday },
  { id: 'ws_4', application_id: 'GS-10821', department: 'Revenue', step_name: 'Income Verification', status: 'PENDING', order_idx: 4 },
  { id: 'ws_5', application_id: 'GS-10821', department: 'Education', step_name: 'Eligibility Review & Final Decision', status: 'PENDING', order_idx: 5 },
  { id: 'ws_11', application_id: 'GS-10817', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: twoDaysAgo },
  { id: 'ws_12', application_id: 'GS-10817', department: 'Revenue', step_name: 'Income Verification', status: 'COMPLETED', order_idx: 2, completed_at: yesterday },
  { id: 'ws_13', application_id: 'GS-10817', department: 'Welfare', step_name: 'Eligibility Review', status: 'IN_PROGRESS', order_idx: 3 },
  { id: 'ws_14', application_id: 'GS-10817', department: 'Welfare', step_name: 'Benefit Calculation & Sanction', status: 'PENDING', order_idx: 4 },
  { id: 'ws_21', application_id: 'GS-10834', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: yesterday },
  { id: 'ws_22', application_id: 'GS-10834', department: 'Revenue', step_name: 'Income Assessment', status: 'IN_PROGRESS', order_idx: 2 },
  { id: 'ws_23', application_id: 'GS-10834', department: 'Municipal', step_name: 'Property Valuation', status: 'PENDING', order_idx: 3 },
  { id: 'ws_31', application_id: 'GS-10842', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: twoDaysAgo },
  { id: 'ws_32', application_id: 'GS-10842', department: 'Revenue', step_name: 'Document Verification', status: 'PENDING', order_idx: 2 },
  { id: 'ws_51', application_id: 'GS-10858', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: yesterday },
  { id: 'ws_52', application_id: 'GS-10858', department: 'Revenue', step_name: 'Income Verification', status: 'COMPLETED', order_idx: 2, completed_at: yesterday },
  { id: 'ws_53', application_id: 'GS-10858', department: 'Welfare', step_name: 'Age & Eligibility Check', status: 'CONFLICT', order_idx: 3 },
  { id: 'ws_61', application_id: 'GS-10878', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: now },
  { id: 'ws_62', application_id: 'GS-10878', department: 'Revenue', step_name: 'Income Verification', status: 'COMPLETED', order_idx: 2, completed_at: now },
  { id: 'ws_63', application_id: 'GS-10878', department: 'Health', step_name: 'Health Records Verification', status: 'PENDING', order_idx: 3 },
  { id: 'ws_71', application_id: 'GS-10881', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: yesterday },
  { id: 'ws_72', application_id: 'GS-10881', department: 'Health', step_name: 'Medical Board Review', status: 'IN_PROGRESS', order_idx: 2 },
  { id: 'ws_73', application_id: 'GS-10881', department: 'Health', step_name: 'Certificate Issuance', status: 'PENDING', order_idx: 3 },
  { id: 'ws_81', application_id: 'GS-10890', department: 'Municipal', step_name: 'Ownership Verification', status: 'PENDING', order_idx: 1 },
  { id: 'ws_82', application_id: 'GS-10890', department: 'Revenue', step_name: 'Tax Clearance Check', status: 'PENDING', order_idx: 2 },
  { id: 'ws_91', application_id: 'GS-10901', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: yesterday },
  { id: 'ws_92', application_id: 'GS-10901', department: 'Transport', step_name: 'Background Verification', status: 'PENDING', order_idx: 2 },
  { id: 'ws_101', application_id: 'GS-10910', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: now },
  { id: 'ws_102', application_id: 'GS-10910', department: 'Revenue', step_name: 'Income Verification', status: 'COMPLETED', order_idx: 2, completed_at: now },
  { id: 'ws_103', application_id: 'GS-10910', department: 'Agriculture', step_name: 'Land Records Verification', status: 'PENDING', order_idx: 3 },
  { id: 'ws_111', application_id: 'GS-10920', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: yesterday },
  { id: 'ws_112', application_id: 'GS-10920', department: 'Labour', step_name: 'Employment Verification', status: 'PENDING', order_idx: 2 },
  { id: 'ws_121', application_id: 'GS-10923', department: 'Municipal', step_name: 'Identity Verified', status: 'COMPLETED', order_idx: 1, completed_at: twoDaysAgo },
  { id: 'ws_122', application_id: 'GS-10923', department: 'Labour', step_name: 'Employer Verification', status: 'CONFLICT', order_idx: 2 },
  { id: 'ws_791', application_id: 'GS-10790', department: 'Municipal', step_name: 'Ownership Records Checked', status: 'COMPLETED', order_idx: 1, completed_at: twoDaysAgo },
  { id: 'ws_792', application_id: 'GS-10790', department: 'Revenue', step_name: 'Tax Assessment Calculation', status: 'COMPLETED', order_idx: 2, completed_at: yesterday },
  { id: 'ws_793', application_id: 'GS-10790', department: 'Municipal', step_name: 'Challan Receipt Generated', status: 'COMPLETED', order_idx: 3, completed_at: yesterday },
  { id: 'ws_741', application_id: 'GS-10744', department: 'Municipal', step_name: 'Identity & Address Verified', status: 'COMPLETED', order_idx: 1, completed_at: twoDaysAgo },
  { id: 'ws_742', application_id: 'GS-10744', department: 'Health', step_name: 'Medical Fitness Certificate', status: 'COMPLETED', order_idx: 2, completed_at: yesterday },
  { id: 'ws_743', application_id: 'GS-10744', department: 'Transport', step_name: 'Smart Card Dispatched', status: 'COMPLETED', order_idx: 3, completed_at: yesterday },
];
try {
  await insert('workflow_steps', steps);
  console.log(`✅ Seeded ${steps.length} workflow steps`);
} catch(e) {
  console.error("Workflow steps seed error:", e.message);
}

// STEP 4: Seed Conflicts
console.log("Seeding conflicts...");
const conflicts = [
  { id: 'conf_1', application_id: 'GS-10817', field: 'Annual Income', source_a: 'Revenue', source_b: 'Welfare', value_a: '₹1,80,000', value_b: '₹2,50,000', severity: 'HIGH', status: 'OPEN', detected_at: yesterday },
  { id: 'conf_2', application_id: 'GS-10858', field: 'Date of Birth', source_a: 'Municipal', source_b: 'Health', value_a: '15 Jan 1958', value_b: '15 Jan 1963', severity: 'HIGH', status: 'OPEN', detected_at: now },
  { id: 'conf_3', application_id: 'GS-10923', field: 'Employer Name', source_a: 'Labour', source_b: 'Revenue', value_a: 'Sharma Enterprises Pvt Ltd', value_b: 'Sharma Enterprises', severity: 'MEDIUM', status: 'OPEN', detected_at: twoDaysAgo },
];
try {
  await insert('conflicts', conflicts);
  console.log(`✅ Seeded ${conflicts.length} conflicts`);
} catch(e) {
  console.error("Conflicts seed error:", e.message);
}

console.log("\n🎉 Supabase setup complete!");
