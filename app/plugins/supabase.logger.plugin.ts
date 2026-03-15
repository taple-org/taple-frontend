import type {AuthChangeEvent, Session, SupabaseClient} from "@supabase/supabase-js";

const AuthEventLabels: Partial<Record<AuthChangeEvent, string>> = {
  SIGNED_IN: 'User signed in',
  SIGNED_OUT: 'User signed out',
  TOKEN_REFRESHED: 'Token refreshed',
  USER_UPDATED: 'User updated',
  PASSWORD_RECOVERY: 'Password recovery',
}

export default defineNuxtPlugin({
  name: 'supabase-logger',
  dependsOn: ['supabase'],
  setup: ({ $supabase }) => {
    ($supabase as SupabaseClient).auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      const label = AuthEventLabels[event] ?? { event };
      console.log(`[Supabase Auth] ${label}`,session?.user?.email ?? '');
      if (event === 'PASSWORD_RECOVERY') {
        const authModal = useAuthModal();
        authModal.open('new-password');
      }
    });
    ($supabase as SupabaseClient).auth.getSession().then(({data: {session}}: { data: { session: Session | null } }) => {
      if (session) {
        console.log('[Supabase Auth] Existing session:', session.user.email);
      }
    });
  }
})