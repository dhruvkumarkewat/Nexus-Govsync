-- =============================================
-- GovSync Nexus — Complete Database Schema
-- Run this ONCE in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ymaztbluwnaclcbvyrms/sql/new
-- =============================================

-- Applications Table
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

-- Workflow Steps Table
CREATE TABLE IF NOT EXISTS public.workflow_steps (
  id TEXT PRIMARY KEY,
  application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  step_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CONFLICT')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  assigned_officer TEXT,
  reason TEXT,
  order_idx INTEGER NOT NULL
);

-- Conflicts Table
CREATE TABLE IF NOT EXISTS public.conflicts (
  id TEXT PRIMARY KEY,
  application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  source_a TEXT NOT NULL,
  source_b TEXT NOT NULL,
  value_a TEXT,
  value_b TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('HIGH', 'MEDIUM', 'LOW')),
  status TEXT NOT NULL CHECK (status IN ('OPEN', 'RESOLVED', 'ESCALATED')),
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conflicts ENABLE ROW LEVEL SECURITY;

-- Allow both anonymous and authenticated access (for development/prototype)
DROP POLICY IF EXISTS "allow_all_applications" ON public.applications;
CREATE POLICY "allow_all_applications" ON public.applications FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_workflow_steps" ON public.workflow_steps;
CREATE POLICY "allow_all_workflow_steps" ON public.workflow_steps FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_conflicts" ON public.conflicts;
CREATE POLICY "allow_all_conflicts" ON public.conflicts FOR ALL TO public USING (true) WITH CHECK (true);

-- Seed: Applications
INSERT INTO public.applications (id, citizen_id, service, department, current_step, status, priority, created_at, updated_at) VALUES
('GS-10821', 'citizen_1', 'Scholarship Eligibility', 'Education', 'Income Verification', 'Waiting', 'HIGH', NOW() - INTERVAL '1 day', NOW()),
('GS-10817', 'citizen_1', 'Social Welfare Benefits', 'Welfare', 'Eligibility Review', 'In Review', 'MEDIUM', NOW() - INTERVAL '2 days', NOW()),
('GS-10790', 'citizen_1', 'Property Tax Assessment', 'Municipal', 'Completed', 'Completed', 'LOW', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('GS-10744', 'citizen_1', 'Driving License Renewal', 'Transport', 'Completed', 'Completed', 'MEDIUM', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('GS-10834', 'citizen_2', 'Home Loan Subsidy', 'Revenue', 'Income Assessment', 'In Review', 'HIGH', NOW() - INTERVAL '1 day', NOW()),
('GS-10842', 'citizen_3', 'Tax Exemption Certificate', 'Revenue', 'Document Verification', 'Pending', 'MEDIUM', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('GS-10855', 'citizen_4', 'Ration Card Application', 'Welfare', 'Family Income Verification', 'Pending', 'HIGH', NOW(), NOW()),
('GS-10858', 'citizen_5', 'Pension Scheme Enrollment', 'Welfare', 'Age & Eligibility Check', 'Conflict', 'HIGH', NOW() - INTERVAL '1 day', NOW()),
('GS-10862', 'citizen_6', 'Merit Scholarship', 'Education', 'Academic Records Verification', 'Pending', 'MEDIUM', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('GS-10878', 'citizen_8', 'State Health Insurance', 'Health', 'Health Records Verification', 'Pending', 'HIGH', NOW(), NOW()),
('GS-10881', 'citizen_9', 'Disability Certificate', 'Health', 'Medical Board Review', 'In Review', 'HIGH', NOW() - INTERVAL '1 day', NOW()),
('GS-10890', 'citizen_10', 'Property Registration', 'Municipal', 'Ownership Verification', 'Pending', 'MEDIUM', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('GS-10901', 'citizen_12', 'Driving License', 'Transport', 'Background Verification', 'Pending', 'MEDIUM', NOW() - INTERVAL '1 day', NOW()),
('GS-10910', 'citizen_14', 'Farmer Subsidy Scheme', 'Agriculture', 'Land Records Verification', 'Pending', 'HIGH', NOW(), NOW()),
('GS-10920', 'citizen_16', 'Labour Welfare Card', 'Labour', 'Employment Verification', 'Pending', 'MEDIUM', NOW() - INTERVAL '1 day', NOW()),
('GS-10923', 'citizen_17', 'ESIC Registration', 'Labour', 'Employer Verification', 'Conflict', 'HIGH', NOW() - INTERVAL '2 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed: Workflow Steps
INSERT INTO public.workflow_steps (id, application_id, department, step_name, status, order_idx, completed_at) VALUES
('ws_1', 'GS-10821', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '2 days'),
('ws_2', 'GS-10821', 'Municipal', 'Residence Verified', 'COMPLETED', 2, NOW() - INTERVAL '1 day'),
('ws_3', 'GS-10821', 'Education', 'Academic Records Verified', 'COMPLETED', 3, NOW() - INTERVAL '1 day'),
('ws_4', 'GS-10821', 'Revenue', 'Income Verification', 'PENDING', 4, NULL),
('ws_5', 'GS-10821', 'Education', 'Eligibility Review & Final Decision', 'PENDING', 5, NULL),
('ws_11', 'GS-10817', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '2 days'),
('ws_12', 'GS-10817', 'Revenue', 'Income Verification', 'COMPLETED', 2, NOW() - INTERVAL '1 day'),
('ws_13', 'GS-10817', 'Welfare', 'Eligibility Review', 'IN_PROGRESS', 3, NULL),
('ws_14', 'GS-10817', 'Welfare', 'Benefit Calculation & Sanction', 'PENDING', 4, NULL),
('ws_791', 'GS-10790', 'Municipal', 'Ownership Records Checked', 'COMPLETED', 1, NOW() - INTERVAL '2 days'),
('ws_792', 'GS-10790', 'Revenue', 'Tax Assessment Calculation', 'COMPLETED', 2, NOW() - INTERVAL '1 day'),
('ws_793', 'GS-10790', 'Municipal', 'Challan Receipt Generated', 'COMPLETED', 3, NOW() - INTERVAL '1 day'),
('ws_741', 'GS-10744', 'Municipal', 'Identity & Address Verified', 'COMPLETED', 1, NOW() - INTERVAL '2 days'),
('ws_742', 'GS-10744', 'Health', 'Medical Fitness Certificate', 'COMPLETED', 2, NOW() - INTERVAL '1 day'),
('ws_743', 'GS-10744', 'Transport', 'Smart Card Dispatched', 'COMPLETED', 3, NOW() - INTERVAL '1 day'),
('ws_21', 'GS-10834', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '1 day'),
('ws_22', 'GS-10834', 'Revenue', 'Income Assessment', 'IN_PROGRESS', 2, NULL),
('ws_31', 'GS-10842', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '2 days'),
('ws_32', 'GS-10842', 'Revenue', 'Document Verification', 'PENDING', 2, NULL),
('ws_51', 'GS-10858', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '1 day'),
('ws_52', 'GS-10858', 'Revenue', 'Income Verification', 'COMPLETED', 2, NOW() - INTERVAL '1 day'),
('ws_53', 'GS-10858', 'Welfare', 'Age & Eligibility Check', 'CONFLICT', 3, NULL),
('ws_71', 'GS-10881', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '1 day'),
('ws_72', 'GS-10881', 'Health', 'Medical Board Review', 'IN_PROGRESS', 2, NULL),
('ws_73', 'GS-10881', 'Health', 'Certificate Issuance', 'PENDING', 3, NULL),
('ws_81', 'GS-10890', 'Municipal', 'Ownership Verification', 'PENDING', 1, NULL),
('ws_82', 'GS-10890', 'Revenue', 'Tax Clearance Check', 'PENDING', 2, NULL),
('ws_91', 'GS-10901', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '1 day'),
('ws_92', 'GS-10901', 'Transport', 'Background Verification', 'PENDING', 2, NULL),
('ws_101', 'GS-10910', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW()),
('ws_102', 'GS-10910', 'Revenue', 'Income Verification', 'COMPLETED', 2, NOW()),
('ws_103', 'GS-10910', 'Agriculture', 'Land Records Verification', 'PENDING', 3, NULL),
('ws_111', 'GS-10920', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '1 day'),
('ws_112', 'GS-10920', 'Labour', 'Employment Verification', 'PENDING', 2, NULL),
('ws_121', 'GS-10923', 'Municipal', 'Identity Verified', 'COMPLETED', 1, NOW() - INTERVAL '2 days'),
('ws_122', 'GS-10923', 'Labour', 'Employer Verification', 'CONFLICT', 2, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed: Conflicts
INSERT INTO public.conflicts (id, application_id, field, source_a, source_b, value_a, value_b, severity, status, detected_at) VALUES
('conf_1', 'GS-10817', 'Annual Income', 'Revenue', 'Welfare', '₹1,80,000', '₹2,50,000', 'HIGH', 'OPEN', NOW() - INTERVAL '1 day'),
('conf_2', 'GS-10858', 'Date of Birth', 'Municipal', 'Health', '15 Jan 1958', '15 Jan 1963', 'HIGH', 'OPEN', NOW()),
('conf_3', 'GS-10923', 'Employer Name', 'Labour', 'Revenue', 'Sharma Enterprises Pvt Ltd', 'Sharma Enterprises', 'MEDIUM', 'OPEN', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;
