import { createClient, SupabaseClient, User } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null
let supabaseAdmin: SupabaseClient | null = null

// Desativa o Web Locks API do auth-js: evita "LockAcquireTimeoutError"
// quando múltiplas instâncias/HMR disputam o mesmo navigator lock (supabase#936)
function noopLock<R>(_name: string, _acquireTimeout: number, fn: () => Promise<R>): Promise<R> {
  return fn()
}

// Cliente para browser (usar no client) — singleton
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          lock: noopLock,
        },
      }
    )
  }
  return supabaseClient
}

// Admin client (só usar em server actions)
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          lock: noopLock,
        },
      }
    )
  }
  return supabaseAdmin
}

// Tipos
export type Session = {
  user: User
  expires_at: number
}

export type AuthState = {
  user: User | null
  loading: boolean
}