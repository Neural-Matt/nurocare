export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          nrc: string | null;
          date_of_birth: string | null;
          gender: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          nrc?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          nrc?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plans: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string;
          coverage_details: unknown;
          features: string[];
          is_active: boolean;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          description?: string;
          coverage_details?: unknown;
          features?: string[];
          is_active?: boolean;
          color?: string;
        };
        Update: {
          name?: string;
          price?: number;
          description?: string;
          coverage_details?: unknown;
          features?: string[];
          is_active?: boolean;
          color?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: string;
          start_date: string;
          end_date: string;
          policy_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: string;
          start_date: string;
          end_date: string;
          policy_number: string;
        };
        Update: {
          status?: string;
          start_date?: string;
          end_date?: string;
          policy_number?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      claims: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          type: string;
          amount: number;
          status: string;
          notes: string | null;
          receipt_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          type: string;
          amount: number;
          status?: string;
          notes?: string | null;
          receipt_url?: string | null;
        };
        Update: {
          status?: string;
          notes?: string | null;
          receipt_url?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "claims_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
