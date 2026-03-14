import { supabase } from '~/lib/supabaseClient'

export default defineNuxtPlugin(() => {
  // Set up auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      console.log('User signed in:', session.user.email)
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed')
    }
  })

  // Check for existing session on app load
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      console.log('Existing session found:', session.user.email)
    }
  })
})
