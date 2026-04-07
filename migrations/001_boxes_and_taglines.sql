-- Add tagline and box_id columns to captures
alter table captures add column if not exists tagline text;
alter table captures add column if not exists box_id uuid;

-- Create memento_boxes table
create table if not exists memento_boxes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#3b82f6',
  created_at timestamptz default now()
);

-- Add foreign key from captures to memento_boxes
alter table captures
  add constraint captures_box_id_fkey
  foreign key (box_id) references memento_boxes(id) on delete set null;

-- Enable RLS on memento_boxes
alter table memento_boxes enable row level security;

create policy "insert own boxes"
  on memento_boxes for insert
  with check (auth.uid() = user_id);

create policy "read own boxes"
  on memento_boxes for select
  using (auth.uid() = user_id);

create policy "update own boxes"
  on memento_boxes for update
  using (auth.uid() = user_id);

create policy "delete own boxes"
  on memento_boxes for delete
  using (auth.uid() = user_id);

-- Allow users to update their own captures (for tagline + box_id)
create policy "update own captures"
  on captures for update
  using (auth.uid() = user_id);

-- Allow users to delete their own captures
create policy "delete own captures"
  on captures for delete
  using (auth.uid() = user_id);
