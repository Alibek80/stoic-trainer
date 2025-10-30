/**
 * Supabase client initialization for Stoic Trainer
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check .env.local file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
}

// Database helpers
export async function insertReflection(reflection: {
  type: 'morning' | 'evening';
  steps: Record<string, string>;
}) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('reflections')
    .insert({
      user_id: user.id,
      ...reflection,
    })
    .select()
    .single();

  return { data, error };
}

export async function getReflections(type?: 'morning' | 'evening') {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('reflections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function insertVirtue(virtue: {
  wisdom: number;
  courage: number;
  justice: number;
  temperance: number;
  date: string;
}) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('virtues')
    .insert({
      user_id: user.id,
      ...virtue,
    })
    .select()
    .single();

  return { data, error };
}

export async function getVirtues(limit = 30) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('virtues')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getWeeklyVirtues() {
  const { data, error } = await getVirtues(7);
  return { data, error };
}

export async function insertReframe(reframe: {
  situation: string;
  reaction: string;
  ai_response: string;
}) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('reframes')
    .insert({
      user_id: user.id,
      ...reframe,
    })
    .select()
    .single();

  return { data, error };
}

export async function getReframes(limit = 50) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('reframes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getChallenges(limit = 30) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function insertChallenge(challenge: {
  title: string;
  description: string;
  date: string;
}) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('challenges')
    .insert({
      user_id: user.id,
      title: challenge.title,
      description: challenge.description,
      date: challenge.date,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateChallengeStatus(id: string, updates: { accepted?: boolean; completed?: boolean }) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('challenges')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  return { data, error };
}

export async function getQuotes(searchQuery?: string, limit = 50) {
  let query = supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (searchQuery) {
    query = query.ilike('author', `%${searchQuery}%`);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function toggleFavoriteQuote(id: string) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch current favorites array
  const { data: current } = await supabase
    .from('quotes')
    .select('favorited_by')
    .eq('id', id)
    .single();

  const currentArray: string[] = (current?.favorited_by as string[]) || [];
  const isFav = currentArray.includes(user.id);
  const nextArray = isFav
    ? currentArray.filter((x) => x !== user.id)
    : [...currentArray, user.id];

  const { data, error } = await supabase
    .from('quotes')
    .update({ favorited_by: nextArray })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function insertMoodLog(moodLog: {
  mood: number;
  stress: number;
  date: string;
}) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('mood_logs')
    .insert({
      user_id: user.id,
      ...moodLog,
    })
    .select()
    .single();

  return { data, error };
}

export async function getMoodLogs(limit = 30) {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit);

  return { data, error };
}



