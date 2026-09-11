create extension if not exists pgcrypto;

create table if not exists employees (
  id text primary key,
  name text not null,
  department text not null,
  role text not null,
  status text not null default 'available',
  capabilities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  external_key text unique,
  title text not null,
  client text,
  status text not null default 'open',
  priority text not null default 'normal',
  owner_employee_id text references employees(id),
  summary text,
  next_action text,
  due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  parent_task_id uuid references tasks(id),
  assigned_employee_id text references employees(id),
  title text not null,
  instructions text not null,
  status text not null default 'queued',
  approval_required boolean not null default false,
  approval_status text,
  scheduled_for timestamptz,
  claimed_at timestamptz,
  completed_at timestamptz,
  result jsonb,
  error text,
  created_by text not null default 'chatgpt',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists office_events (
  id bigserial primary key,
  event_id uuid not null default gen_random_uuid() unique,
  source text not null,
  actor text not null,
  event_type text not null,
  case_id uuid references cases(id) on delete set null,
  task_id uuid references tasks(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_tasks_worker_queue on tasks(status, scheduled_for, approval_required);
create index if not exists idx_events_case_created on office_events(case_id, created_at desc);
create index if not exists idx_cases_status_due on cases(status, due_at);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  action_type text not null,
  preview jsonb not null,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by text
);

-- Idempotency table prevents chat/web/worker retries from duplicating actions.
create table if not exists idempotency_keys (
  key text primary key,
  response jsonb,
  created_at timestamptz not null default now()
);
