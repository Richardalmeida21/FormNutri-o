import { createClient } from '@supabase/supabase-js';
import type { SurveyResponse } from '../types/survey';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitResponse(data: Omit<SurveyResponse, 'id' | 'created_at'>) {
  const { error } = await supabase.from('responses').insert([data]);
  if (error) throw error;
}

export async function fetchResponses(): Promise<SurveyResponse[]> {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as SurveyResponse[]) ?? [];
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
