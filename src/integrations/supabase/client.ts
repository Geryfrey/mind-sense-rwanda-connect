
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://bxownsyanecfszaktxis.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4b3duc3lhbmVjZnN6YWt0eGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzA1MTksImV4cCI6MjA2MjkwNjUxOX0.4hiEIma-HhZr0lTy2glyB32Hzye5LgtzVpXih6zMJ1g"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
