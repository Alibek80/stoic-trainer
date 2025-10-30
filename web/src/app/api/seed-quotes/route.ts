import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type RemoteQuote = any;

function normalizeQuote(raw: RemoteQuote): { text: string | null; author: string | null; category?: string } {
  const text: string | null = (raw?.text ?? raw?.quote ?? raw?.saying ?? null) as string | null;
  const author: string | null = (raw?.author ?? raw?.by ?? raw?.source ?? null) as string | null;
  const category: string | undefined = (raw?.category ?? raw?.topic ?? (Array.isArray(raw?.tags) ? raw.tags[0] : undefined)) as string | undefined;
  const normalizedText = typeof text === 'string' ? text.trim() : null;
  const normalizedAuthor = typeof author === 'string' ? author.trim() : null;
  return { text: normalizedText, author: normalizedAuthor, category };
}

async function translateToRu(text: string, author: string): Promise<{ textRu: string; authorRu: string; skippedReason?: string }> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    return { textRu: text, authorRu: author, skippedReason: 'missing_api_key' };
  }

  const prompt = `Translate the following Stoic quote to Russian. Return strict JSON: {"text":"...","author":"..."}.
Text: ${text}
Author: ${author}`;

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
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    return { textRu: text, authorRu: author, skippedReason: `openai_http_${res.status}` };
  }

  const data = await res.json();
  try {
    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return { textRu: parsed.text || text, authorRu: parsed.author || author };
  } catch {
    return { textRu: text, authorRu: author, skippedReason: 'openai_parse_error' };
  }
}

export async function POST(request: Request) {
  try {
    const { limit = 100, offset = 0 } = (await request.json().catch(() => ({}))) as { limit?: number; offset?: number };

    const resp = await fetch('https://raw.githubusercontent.com/DavidWells/awesome-stoicism/master/quotes.json');
    if (!resp.ok) {
      return NextResponse.json({ error: 'Failed to fetch quotes.json' }, { status: 500 });
    }
    const allQuotes = (await resp.json()) as RemoteQuote[];
    const slice = allQuotes.slice(offset, offset + limit);

    const results = [] as Array<{ id: string | null; author: string; text: string; category?: string; error?: string; translated?: boolean; reason?: string }>;

    for (const raw of slice) {
      const { text, author, category } = normalizeQuote(raw);
      if (!text || !author) {
        results.push({ id: null, author: author || 'Unknown', text: '', category, error: 'Skipped: missing text or author' });
        continue;
      }
      const { textRu, authorRu, skippedReason } = await translateToRu(text, author);
      const safeText = (textRu || text).trim();
      const safeAuthor = (authorRu || author).trim();
      if (!safeText || !safeAuthor) {
        results.push({ id: null, author: safeAuthor || author || 'Unknown', text: '', category, error: 'Skipped after translation: empty text/author' });
        continue;
      }
      const { data, error } = await supabase
        .from('quotes')
        .insert({ author: safeAuthor, text: safeText, category: (category && String(category).trim()) || 'Стоицизм' })
        .select()
        .single();
      results.push({ id: (data as any)?.id ?? null, author: safeAuthor, text: safeText, category, error: error?.message, translated: !skippedReason && (safeText !== text || safeAuthor !== author), reason: skippedReason });
    }

    return NextResponse.json({ count: results.length, results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


