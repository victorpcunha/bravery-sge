// Cliente Supabase EXCLUSIVO do Portal do Responsável (browser).
// Usa `storageKey` própria para que a sessão do portal seja independente
// da sessão interna (spec 023, Assumptions) — mesmo projeto Auth, storages separados.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let portalClient: SupabaseClient | null = null

function noopLock<R>(_name: string, _acquireTimeout: number, fn: () => Promise<R>): Promise<R> {
  return fn()
}

export function getPortalSupabase(): SupabaseClient {
  if (!portalClient) {
    portalClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storageKey: 'sb-portal-auth',
          lock: noopLock,
        },
      }
    )
  }
  return portalClient
}
