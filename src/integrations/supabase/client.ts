
// This file is a placeholder for the removed Supabase client
// It exists only to prevent import errors in existing code

export const supabase = {
  // Mock methods to prevent errors when called
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: {}, error: { message: 'Supabase auth removed' } }),
    signUp: async () => ({ data: {}, error: { message: 'Supabase auth removed' } }),
    signOut: async () => {}
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: 'Supabase removed' } }),
        maybeSingle: async () => ({ data: null, error: { message: 'Supabase removed' } }),
        ilike: () => ({})
      })
    })
  })
};
