export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function neutralOk(): Response {
  return jsonResponse({ ok: true });
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function tokenFromRequest(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type AdminUser = { id: string; email?: string | null };

/** Lookup auth user by e-mail via GoTrue Admin API (works without getUserByEmail in all SDK builds). */
export async function getAdminUserByEmail(
  supabaseUrl: string,
  serviceRoleKey: string,
  email: string,
): Promise<AdminUser | null> {
  const base = supabaseUrl.replace(/\/$/, '');
  const headers = {
    Authorization: `Bearer ${serviceRoleKey}`,
    apikey: serviceRoleKey,
  };

  const filterUrl =
    `${base}/auth/v1/admin/users?filter=${encodeURIComponent(`email.eq.${email}`)}&page=1&per_page=1`;

  try {
    const filtered = await fetch(filterUrl, { headers });
    if (filtered.ok) {
      const payload = await filtered.json();
      const users = Array.isArray(payload?.users) ? payload.users : [];
      if (users.length > 0 && users[0]?.id) {
        return { id: users[0].id, email: users[0].email ?? null };
      }
    }
  } catch (e) {
    console.error('getAdminUserByEmail filter lookup failed', e);
  }

  try {
    let page = 1;
    const perPage = 200;
    while (page <= 5) {
      const res = await fetch(
        `${base}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
        { headers },
      );
      if (!res.ok) break;
      const payload = await res.json();
      const users = Array.isArray(payload?.users) ? payload.users : [];
      if (!users.length) break;
      const match = users.find(
        (u: { email?: string }) => u.email && normalizeEmail(u.email) === email,
      );
      if (match?.id) {
        return { id: match.id, email: match.email ?? null };
      }
      if (users.length < perPage) break;
      page += 1;
    }
  } catch (e) {
    console.error('getAdminUserByEmail paginated lookup failed', e);
  }

  return null;
}
