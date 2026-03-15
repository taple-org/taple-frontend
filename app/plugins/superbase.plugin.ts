import {createClient} from '@supabase/supabase-js'

export default defineNuxtPlugin({
    name: "supabase",
    setup: () => {
        const config = useRuntimeConfig()

        const supabaseUrl = config.public.supabaseUrl;
        const supabaseKey = config.public.supabaseKey;
        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials not found in environment variables')
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
            }
        });

        return {provide: {supabase}}
    }
})
