import 'expo-sqlite/localStorage/install'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vifurugyrmprstcmceol.supabase.co";
const supabasePublishableKey = "sb_publishable_dsEf9S0D6Yc2o5gNFBPKUg_anG4MIWz";


export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})