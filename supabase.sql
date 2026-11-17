-- Constellationdle: estadísticas globales.
-- Ejecutar una vez en Supabase → SQL Editor (mismo proyecto que Flag Challenge; todo usa el prefijo const_).
-- El navegador solo usa la publishable key: lee las tablas (RLS solo lectura) y escribe vía estas funciones.

-- Resultado por constelación (en diario y aleatorio). tries: 1–3 = intento en que acertó, 4 = no acertó.
create table if not exists public.const_stats (
  code      text primary key,
  plays     integer not null default 0,
  solved    integer not null default 0,
  tries_sum integer not null default 0
);

-- Resultado del desafío diario: intentos en cada una de las 4 constelaciones del día
-- (t1–t2 del zodiaco, t3–t4 de todo el cielo).
create table if not exists public.const_daily_results (
  day     date     not null,
  t1      smallint not null check (t1 between 1 and 4),
  t2      smallint not null check (t2 between 1 and 4),
  t3      smallint not null check (t3 between 1 and 4),
  t4      smallint not null check (t4 between 1 and 4),
  players integer  not null default 0,
  primary key (day, t1, t2, t3, t4)
);

alter table public.const_stats enable row level security;
alter table public.const_daily_results enable row level security;

drop policy if exists "lectura publica" on public.const_stats;
create policy "lectura publica" on public.const_stats for select to anon, authenticated using (true);
drop policy if exists "lectura publica" on public.const_daily_results;
create policy "lectura publica" on public.const_daily_results for select to anon, authenticated using (true);

create or replace function public.const_increment_stat(p_code text, p_tries integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_code is null or p_code !~ '^[a-z]{3}$' then
    raise exception 'código inválido';
  end if;
  if p_tries is null or p_tries < 1 or p_tries > 4 then
    raise exception 'intentos inválidos';
  end if;
  insert into const_stats (code, plays, solved, tries_sum)
  values (p_code, 1, case when p_tries < 4 then 1 else 0 end, p_tries)
  on conflict (code) do update
    set plays     = const_stats.plays + 1,
        solved    = const_stats.solved + excluded.solved,
        tries_sum = const_stats.tries_sum + excluded.tries_sum;
end;
$$;

create or replace function public.const_increment_daily_result(p_day date, p_t1 integer, p_t2 integer, p_t3 integer, p_t4 integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_day is null or p_day < current_date - 1 or p_day > current_date + 1 then
    raise exception 'día fuera de rango';
  end if;
  if p_t1 is null or p_t2 is null or p_t3 is null or p_t4 is null
     or p_t1 not between 1 and 4 or p_t2 not between 1 and 4
     or p_t3 not between 1 and 4 or p_t4 not between 1 and 4 then
    raise exception 'intentos inválidos';
  end if;
  insert into const_daily_results (day, t1, t2, t3, t4, players)
  values (p_day, p_t1, p_t2, p_t3, p_t4, 1)
  on conflict (day, t1, t2, t3, t4) do update
    set players = const_daily_results.players + 1;
end;
$$;

revoke all on function public.const_increment_stat(text, integer) from public;
revoke all on function public.const_increment_daily_result(date, integer, integer, integer, integer) from public;
grant execute on function public.const_increment_stat(text, integer) to anon, authenticated;
grant execute on function public.const_increment_daily_result(date, integer, integer, integer, integer) to anon, authenticated;
