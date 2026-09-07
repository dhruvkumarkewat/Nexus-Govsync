// Direct table creation via Supabase DB REST layer
// This uses the pg_catalog RPC to execute DDL through the service role

const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYXp0Ymx1d25hY2xjYnZ5cm1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODUyMDQ3OCwiZXhwIjoyMTA0MDk2NDc4fQ.9ZED4kJSasOJnZWd9TXCebw54vxkDU0C-67lVLhANw0";
const REST = "https://ymaztbluwnaclcbvyrms.supabase.co/rest/v1";

const H = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

async function tryInsert(table, rows) {
  const r = await fetch(`${REST}/${table}`, {
    method: "POST",
    headers: { ...H, "Prefer": "return=minimal,resolution=ignore-duplicates" },
    body: JSON.stringify(rows)
  });
  const txt = await r.text();
  if (r.ok || r.status === 204) {
    console.log(`✅ ${table}: seeded ${rows.length} rows`);
    return true;
  }
  const err = JSON.parse(txt);
  // Table not found
  if (err.code === '42P01' || (err.message && err.message.includes('does not exist'))) {
    console.log(`⚠️  ${table}: Table does not exist yet — need to create via SQL Editor`);
    return false;
  }
  console.error(`❌ ${table}: ${r.status} — ${txt}`);
  return false;
}

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 2*86400000).toISOString();

const appsOk = await tryInsert("applications", [
  { id: "GS-10821", citizen_id: "citizen_1", service: "Scholarship Eligibility", department: "Education", current_step: "Income Verification", status: "Waiting", priority: "HIGH", created_at: yesterday, updated_at: now },
  { id: "GS-10817", citizen_id: "citizen_1", service: "Social Welfare Benefits", department: "Welfare", current_step: "Eligibility Review", status: "In Review", priority: "MEDIUM", created_at: twoDaysAgo, updated_at: now },
]);

if (!appsOk) {
  console.log(`
==========================================
  ACTION REQUIRED — Tables Not Found
==========================================

Please open your Supabase Dashboard and run the SQL in:
  c:\\Users\\dhruv\\Downloads\\agon-agent_1-7920090c\\supabase_schema.sql

Steps:
  1. Go to: https://supabase.com/dashboard/project/ymaztbluwnaclcbvyrms/sql/new
  2. Log in to Supabase
  3. Copy & paste the contents of supabase_schema.sql
  4. Click Run
  5. Then run: node scripts/seed.mjs

==========================================
`);
  process.exit(1);
}

// Tables exist, seed the rest
await tryInsert("applications", [
  { id: "GS-10790", citizen_id: "citizen_1", service: "Property Tax Assessment", department: "Municipal", current_step: "Completed", status: "Completed", priority: "LOW", created_at: twoDaysAgo, updated_at: yesterday },
  { id: "GS-10744", citizen_id: "citizen_1", service: "Driving License Renewal", department: "Transport", current_step: "Completed", status: "Completed", priority: "MEDIUM", created_at: twoDaysAgo, updated_at: yesterday },
  { id: "GS-10834", citizen_id: "citizen_2", service: "Home Loan Subsidy", department: "Revenue", current_step: "Income Assessment", status: "In Review", priority: "HIGH", created_at: yesterday, updated_at: now },
  { id: "GS-10855", citizen_id: "citizen_4", service: "Ration Card Application", department: "Welfare", current_step: "Family Income Verification", status: "Pending", priority: "HIGH", created_at: now, updated_at: now },
  { id: "GS-10858", citizen_id: "citizen_5", service: "Pension Scheme Enrollment", department: "Welfare", current_step: "Age & Eligibility Check", status: "Conflict", priority: "HIGH", created_at: yesterday, updated_at: now },
  { id: "GS-10878", citizen_id: "citizen_8", service: "State Health Insurance", department: "Health", current_step: "Health Records Verification", status: "Pending", priority: "HIGH", created_at: now, updated_at: now },
  { id: "GS-10881", citizen_id: "citizen_9", service: "Disability Certificate", department: "Health", current_step: "Medical Board Review", status: "In Review", priority: "HIGH", created_at: yesterday, updated_at: now },
  { id: "GS-10890", citizen_id: "citizen_10", service: "Property Registration", department: "Municipal", current_step: "Ownership Verification", status: "Pending", priority: "MEDIUM", created_at: twoDaysAgo, updated_at: yesterday },
  { id: "GS-10901", citizen_id: "citizen_12", service: "Driving License", department: "Transport", current_step: "Background Verification", status: "Pending", priority: "MEDIUM", created_at: yesterday, updated_at: now },
  { id: "GS-10910", citizen_id: "citizen_14", service: "Farmer Subsidy Scheme", department: "Agriculture", current_step: "Land Records Verification", status: "Pending", priority: "HIGH", created_at: now, updated_at: now },
  { id: "GS-10920", citizen_id: "citizen_16", service: "Labour Welfare Card", department: "Labour", current_step: "Employment Verification", status: "Pending", priority: "MEDIUM", created_at: yesterday, updated_at: now },
  { id: "GS-10923", citizen_id: "citizen_17", service: "ESIC Registration", department: "Labour", current_step: "Employer Verification", status: "Conflict", priority: "HIGH", created_at: twoDaysAgo, updated_at: now },
]);

await tryInsert("workflow_steps", [
  { id: "ws_1", application_id: "GS-10821", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: twoDaysAgo },
  { id: "ws_2", application_id: "GS-10821", department: "Municipal", step_name: "Residence Verified", status: "COMPLETED", order_idx: 2, completed_at: yesterday },
  { id: "ws_3", application_id: "GS-10821", department: "Education", step_name: "Academic Records Verified", status: "COMPLETED", order_idx: 3, completed_at: yesterday },
  { id: "ws_4", application_id: "GS-10821", department: "Revenue", step_name: "Income Verification", status: "PENDING", order_idx: 4 },
  { id: "ws_5", application_id: "GS-10821", department: "Education", step_name: "Eligibility Review & Final Decision", status: "PENDING", order_idx: 5 },
  { id: "ws_11", application_id: "GS-10817", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: twoDaysAgo },
  { id: "ws_12", application_id: "GS-10817", department: "Revenue", step_name: "Income Verification", status: "COMPLETED", order_idx: 2, completed_at: yesterday },
  { id: "ws_13", application_id: "GS-10817", department: "Welfare", step_name: "Eligibility Review", status: "IN_PROGRESS", order_idx: 3 },
  { id: "ws_14", application_id: "GS-10817", department: "Welfare", step_name: "Benefit Calculation & Sanction", status: "PENDING", order_idx: 4 },
  { id: "ws_791", application_id: "GS-10790", department: "Municipal", step_name: "Ownership Records Checked", status: "COMPLETED", order_idx: 1, completed_at: twoDaysAgo },
  { id: "ws_792", application_id: "GS-10790", department: "Revenue", step_name: "Tax Assessment Calculation", status: "COMPLETED", order_idx: 2, completed_at: yesterday },
  { id: "ws_793", application_id: "GS-10790", department: "Municipal", step_name: "Challan Receipt Generated", status: "COMPLETED", order_idx: 3, completed_at: yesterday },
  { id: "ws_741", application_id: "GS-10744", department: "Municipal", step_name: "Identity & Address Verified", status: "COMPLETED", order_idx: 1, completed_at: twoDaysAgo },
  { id: "ws_742", application_id: "GS-10744", department: "Health", step_name: "Medical Fitness Certificate", status: "COMPLETED", order_idx: 2, completed_at: yesterday },
  { id: "ws_743", application_id: "GS-10744", department: "Transport", step_name: "Smart Card Dispatched", status: "COMPLETED", order_idx: 3, completed_at: yesterday },
  { id: "ws_51", application_id: "GS-10858", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: yesterday },
  { id: "ws_52", application_id: "GS-10858", department: "Revenue", step_name: "Income Verification", status: "COMPLETED", order_idx: 2, completed_at: yesterday },
  { id: "ws_53", application_id: "GS-10858", department: "Welfare", step_name: "Age & Eligibility Check", status: "CONFLICT", order_idx: 3 },
  { id: "ws_71", application_id: "GS-10881", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: yesterday },
  { id: "ws_72", application_id: "GS-10881", department: "Health", step_name: "Medical Board Review", status: "IN_PROGRESS", order_idx: 2 },
  { id: "ws_73", application_id: "GS-10881", department: "Health", step_name: "Certificate Issuance", status: "PENDING", order_idx: 3 },
  { id: "ws_81", application_id: "GS-10890", department: "Municipal", step_name: "Ownership Verification", status: "PENDING", order_idx: 1 },
  { id: "ws_91", application_id: "GS-10901", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: yesterday },
  { id: "ws_92", application_id: "GS-10901", department: "Transport", step_name: "Background Verification", status: "PENDING", order_idx: 2 },
  { id: "ws_101", application_id: "GS-10910", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: now },
  { id: "ws_103", application_id: "GS-10910", department: "Agriculture", step_name: "Land Records Verification", status: "PENDING", order_idx: 3 },
  { id: "ws_111", application_id: "GS-10920", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: yesterday },
  { id: "ws_112", application_id: "GS-10920", department: "Labour", step_name: "Employment Verification", status: "PENDING", order_idx: 2 },
  { id: "ws_121", application_id: "GS-10923", department: "Municipal", step_name: "Identity Verified", status: "COMPLETED", order_idx: 1, completed_at: twoDaysAgo },
  { id: "ws_122", application_id: "GS-10923", department: "Labour", step_name: "Employer Verification", status: "CONFLICT", order_idx: 2 },
]);

await tryInsert("conflicts", [
  { id: "conf_1", application_id: "GS-10817", field: "Annual Income", source_a: "Revenue", source_b: "Welfare", value_a: "₹1,80,000", value_b: "₹2,50,000", severity: "HIGH", status: "OPEN", detected_at: yesterday },
  { id: "conf_2", application_id: "GS-10858", field: "Date of Birth", source_a: "Municipal", source_b: "Health", value_a: "15 Jan 1958", value_b: "15 Jan 1963", severity: "HIGH", status: "OPEN", detected_at: now },
  { id: "conf_3", application_id: "GS-10923", field: "Employer Name", source_a: "Labour", source_b: "Revenue", value_a: "Sharma Enterprises Pvt Ltd", value_b: "Sharma Enterprises", severity: "MEDIUM", status: "OPEN", detected_at: twoDaysAgo },
]);

console.log("\n🎉 All done!");
