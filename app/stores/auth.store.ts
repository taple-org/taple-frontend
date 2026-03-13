import { defineStore } from "pinia"
import { supabase } from '~/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null)
    const session = ref<Session | null>(null)
    const isAuthenticated = computed(() => !!session.value)

    // Initialize session from Supabase
    const initSession = async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession) {
            session.value = currentSession
            user.value = currentSession.user
        }
    }

    // Set session
    const setSession = (newSession: Session | null) => {
        session.value = newSession
        user.value = newSession?.user || null
    }

    // Sign out
    const signOut = async () => {
        await supabase.auth.signOut()
        session.value = null
        user.value = null
    }

    return {
        user,
        session,
        isAuthenticated,
        initSession,
        setSession,
        signOut
    }
})