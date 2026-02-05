
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://attvpufbmsbolxeqyoqr.supabase.co';
// Using the specific publishable key provided by the user
const supabaseKey = 'sb_publishable_NlkK4pBYnPCdTzs65OGzGw_ZoxzeR-6';

export const supabase = createClient(supabaseUrl, supabaseKey);
