-- ============================================================
-- OBSERVADORES — lista para autocompletar (proyecto atnnhefwyfjhwcudtlbe)
-- Correr una vez en SQL Editor
-- ============================================================

create table if not exists is_observadores (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null unique,   -- nombre canónico, como se muestra
  activo     boolean default true,
  created_at timestamptz default now()
);

alter table is_observadores enable row level security;
create policy "anon all obs" on is_observadores for all using (true) with check (true);

-- Cargar los observadores actuales ya unificados
insert into is_observadores (nombre) values
  ('Villegas, Karim'),
  ('Fleitas, Daniel'),
  ('Campobasso, Laura'),
  ('Puricelli, Dante'),
  ('Molina, Hugo')
on conflict (nombre) do nothing;
