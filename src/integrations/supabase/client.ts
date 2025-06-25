
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fyqdmuxxjzitrhmfipgz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5cWRtdXh4anppdHJobWZpcGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5ODI5ODUsImV4cCI6MjA1NTU1ODk4NX0.oF5q2pqgTvdi2bqmZ4fvaLSUGRLlzNjsQ3geM1_wys0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
