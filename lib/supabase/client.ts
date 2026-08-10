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

// Same condition every hook needs to decide between local mock data and a
// real Supabase call — computed once here so hooks can import it directly
// instead of each re-deriving it from `hasSupabaseEnv`.
export const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true' || !hasSupabaseEnv;

const mockDatabase = {
  profiles: [MOCK_PROFILE],
  claims: [...MOCK_CLAIMS],
  family_members: [...MOCK_FAMILY_MEMBERS],
  payments: [...MOCK_PAYMENTS],
  subscriptions: [MOCK_SUBSCRIPTION],
  notifications: [...MOCK_NOTIFICATIONS],
};

const cloneValue = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

// The mock builder is intentionally untyped (`any`) — it stands in for
// whatever table shape Supabase would return, and the strict union across
// all mock tables isn't something TS can usefully narrow here.
function createMockQuery(table: keyof typeof mockDatabase) {
  const db = mockDatabase as unknown as Record<string, any[]>;
  let rows: any[] = cloneValue(db[table]);
  let pendingPatch: Record<string, unknown> | null = null;
  let pendingDelete = false;

  const builder: any = {
    select: () => builder,
    order: (column: string, options?: { ascending?: boolean }) => {
      const ascending = options?.ascending ?? true;
      rows = [...rows].sort((left, right) => {
        const leftValue = left?.[column];
        const rightValue = right?.[column];
        if (leftValue === rightValue) return 0;
        return leftValue > rightValue ? (ascending ? 1 : -1) : (ascending ? -1 : 1);
      });
      return builder;
    },
    eq: (column: string, value: unknown) => {
      if (pendingDelete) {
        const remaining = db[table].filter((row) => row?.[column] !== value);
        db[table] = cloneValue(remaining);
        rows = [];
        return builder;
      }

      rows = rows.filter((row) => row?.[column] === value);
      if (pendingPatch) {
        const updated = rows.map((row) => ({
          ...row,
          ...pendingPatch,
          updated_at: new Date().toISOString(),
        }));
        db[table] = db[table].map((row) => {
          const match = rows.some((filteredRow) => filteredRow.id === row.id);
          return match ? updated.find((item) => item.id === row.id) ?? row : row;
        });
        rows = updated;
      }
      return builder;
    },
    in: (column: string, values: unknown[]) => {
      rows = rows.filter((row) => values.includes(row?.[column]));
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
      db[table] = [...db[table], ...cloneValue(inserted)];
      rows = cloneValue(inserted);
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
 *
 * Return type is pinned to the real client shape — the mock client only
 * covers the subset of the API mock-mode hooks actually call, so it's cast
 * rather than structurally matched. Calling a method the mock doesn't
 * implement is a mock-layer gap to fix, not something the type system
 * should block; every real call site is already guarded by IS_MOCK_MODE.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): ReturnType<typeof createBrowserClient> {
  if (IS_MOCK_MODE) {
    return createMockSupabaseClient() as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
