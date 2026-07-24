import { createBrowserClient } from '@supabase/ssr';
import {
  MOCK_CLAIMS,
  MOCK_FAMILY_MEMBERS,
  MOCK_NOTIFICATIONS,
  MOCK_PAYMENTS,
  MOCK_PROFILE,
  MOCK_SUBSCRIPTION,
} from '@/lib/mock-data';

export const hasSupabaseEnv = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Mock mode is opt-in only — it must never turn on just because env vars
// happen to be missing, or a misconfigured production deploy (e.g. a
// forgotten Vercel env var) would silently fall back to a fake logged-in
// admin session instead of failing loudly.
export const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

const mockDatabase = {
  profiles: [MOCK_PROFILE],
  claims: [...MOCK_CLAIMS],
  family_members: [...MOCK_FAMILY_MEMBERS],
  payments: [...MOCK_PAYMENTS],
  subscriptions: [MOCK_SUBSCRIPTION],
  notifications: [...MOCK_NOTIFICATIONS],
};

const cloneValue = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function createMockQuery(table: keyof typeof mockDatabase) {
  let rows = cloneValue(mockDatabase[table]);
  let pendingPatch: Record<string, unknown> | null = null;
  let pendingDelete = false;

  const builder: any = {
    select: () => builder,
    order: (column: string, options?: { ascending?: boolean }) => {
      const ascending = options?.ascending ?? true;
      rows = [...(rows as any[])].sort((left, right) => {
        const leftValue = left?.[column];
        const rightValue = right?.[column];
        if (leftValue === rightValue) return 0;
        return leftValue > rightValue ? (ascending ? 1 : -1) : (ascending ? -1 : 1);
      });
      return builder;
    },
    eq: (column: string, value: unknown) => {
      if (pendingDelete) {
        const remaining = (mockDatabase[table] as any[]).filter((row) => row?.[column] !== value);
        mockDatabase[table] = cloneValue(remaining);
        rows = [];
        return builder;
      }

      rows = (rows as any[]).filter((row) => row?.[column] === value);
      if (pendingPatch) {
        const updated = (rows as any[]).map((row) => ({
          ...row,
          ...pendingPatch,
          updated_at: new Date().toISOString(),
        }));
        mockDatabase[table] = (mockDatabase[table] as any[]).map((row) => {
          const match = (rows as any[]).some((filteredRow) => filteredRow.id === row.id);
          return match ? updated.find((item) => item.id === row.id) ?? row : row;
        });
        rows = updated;
      }
      return builder;
    },
    in: (column: string, values: unknown[]) => {
      rows = (rows as any[]).filter((row) => values.includes(row?.[column]));
      return builder;
    },
    insert: (value: Record<string, unknown> | Record<string, unknown>[]) => {
      const records = Array.isArray(value) ? value : [value];
      const inserted = records.map((record) => ({
        id: (record.id as string | undefined) ?? `${table}-mock-${Date.now()}`,
        created_at: (record.created_at as string | undefined) ?? new Date().toISOString(),
        updated_at: (record.updated_at as string | undefined) ?? new Date().toISOString(),
        ...record,
      }));
      (mockDatabase[table] as any[]) = [...(mockDatabase[table] as any[]), ...cloneValue(inserted)];
      rows = cloneValue(inserted) as any;
      return builder;
    },
    update: (value: Record<string, unknown>) => {
      pendingPatch = value;
      return builder;
    },
    delete: () => {
      pendingDelete = true;
      return builder;
    },
    single: async () => ({ data: rows[0] ?? null, error: null }),
    maybeSingle: async () => ({ data: rows[0] ?? null, error: null }),
    then: (resolve: (value: { data: unknown[]; error: null }) => unknown, reject?: (reason: unknown) => unknown) =>
      Promise.resolve({ data: rows, error: null }).then(resolve, reject),
  };

  return builder;
}

function createMockStorageClient() {
  return {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  };
}

function createMockSupabaseClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (_callback: unknown) => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
      signUp: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => createMockQuery(table as keyof typeof mockDatabase),
    storage: createMockStorageClient(),
  };
}

/**
 * Creates a Supabase client for use in browser/client components.
 * Generic types can be generated via `supabase gen types typescript` once 
 * a project is linked. Using `any` here for MVP compatibility.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient() {
  if (IS_MOCK_MODE) {
    return createMockSupabaseClient();
  }

  if (!hasSupabaseEnv) {
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        'in the environment, or set NEXT_PUBLIC_MOCK_AUTH=true for local mock mode. ' +
        'Refusing to silently fall back to mock data in an unconfigured environment.'
    );
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
