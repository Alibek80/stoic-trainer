import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function hasLatin(text: string): boolean {
  return /[A-Za-z]/.test(text);
}

async function translate(text: string, author: string): Promise<{ text: string; author: string; skippedReason?: string }> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) return { text, author, skippedReason: 'missing_api_key' };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional translator. Output JSON only.' },
        { role: 'user', content: `Translate to Russian and return JSON {"text":"...","author":"..."}. Text: ${text}\nAuthor: ${author}` },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) return { text, author, skippedReason: `openai_http_${res.status}` };
  const data = await res.json();
  try {
    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return { text: parsed.text || text, author: parsed.author || author };
  } catch {
    return { text, author, skippedReason: 'openai_parse_error' };
  }
}

export async function POST() {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('id, text, author, category')
      .limit(500);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const targets = (data || []).filter((q: any) => typeof q.text === 'string' && hasLatin(q.text));
    const results: Array<{ id: string; updated: boolean; translated?: boolean; reason?: string } | { id: string; error: string }> = [];

    for (const q of targets) {
      const translated = await translate(q.text, q.author);
      const safeText = translated.text?.trim() || q.text;
      const safeAuthor = translated.author?.trim() || q.author;
      const upd = await supabase
        .from('quotes')
        .update({ text: safeText, author: safeAuthor, category: q.category || 'Стоицизм' })
        .eq('id', q.id)
        .select('id')
        .single();
      if (upd.error) results.push({ id: q.id, error: upd.error.message });
      else results.push({ id: q.id, updated: true, translated: !translated.skippedReason && (safeText !== q.text || safeAuthor !== q.author), reason: translated.skippedReason });
    }

    return NextResponse.json({ processed: results.length, results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


