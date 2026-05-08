
-- Fix function search_path
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- Restrict insert policies to authenticated
drop policy if exists "anyone can submit company" on public.companies;
create policy "authenticated submit company" on public.companies for insert to authenticated with check (auth.uid() = submitted_by);

drop policy if exists "anyone insert navigator sessions" on public.navigator_sessions;
create policy "authenticated insert navigator sessions" on public.navigator_sessions for insert to authenticated with check (user_id is null or auth.uid() = user_id);

-- Lock down has_role: only callable by authenticated (used inside RLS); revoke from anon/public
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
