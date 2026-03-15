import type { SupabaseClient } from '@supabase/supabase-js'

export function buildAuthRepository(supabase: SupabaseClient) {
    return {
      async login(email: string, password: string) {
        return supabase.auth.signInWithPassword({ email, password });
      },
      async register(email: string, password: string) {
        return supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
      },
      async verifyOtp(email: string, token: string) {
        return supabase.auth.verifyOtp({ email, token, type: "signup" });
      },
      async resendOtp(email: string) {
        return supabase.auth.resend({ type: "signup", email });
      },
      async forgotPassword(email: string) {
        return supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`,
        });
      },
      async resetPassword(newPassword: string) {
        return supabase.auth.updateUser({ password: newPassword });
      },
      async getSession() {
        return supabase.auth.getSession();
      },
      async signOut() {
        return supabase.auth.signOut();
      },
      onAuthStateChange: supabase.auth.onAuthStateChange.bind(supabase.auth),
    };
}
