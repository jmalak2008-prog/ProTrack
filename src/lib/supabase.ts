import {createClient} from '@supabase/supabase-js';

// Client initialisé uniquement lorsque les variables publiques sont configurées.
// Ne jamais placer SUPABASE_SERVICE_ROLE_KEY dans le navigateur.
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = url && anon ? createClient(url,anon,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}) : null;
