import { Database } from '@/types/db'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(  
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)