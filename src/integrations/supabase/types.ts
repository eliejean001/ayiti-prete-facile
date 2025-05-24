export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          role: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          role?: string | null
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          address: string
          created_at: string
          email: string
          employer: string | null
          employer_address: string | null
          employer_phone: string | null
          employment_status: string | null
          full_name: string
          id: string
          interest_rate: number
          job_title: string | null
          loan_amount: number
          loan_duration: number
          loan_purpose: string
          monthly_income: number | null
          other_income_sources: string | null
          payment_status: string
          phone_number: string
          reference_address: string | null
          reference_name: string | null
          reference_phone: string | null
          signature: string
          status: string
          updated_at: string
          years_employed: number | null
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          employer?: string | null
          employer_address?: string | null
          employer_phone?: string | null
          employment_status?: string | null
          full_name: string
          id?: string
          interest_rate: number
          job_title?: string | null
          loan_amount: number
          loan_duration: number
          loan_purpose: string
          monthly_income?: number | null
          other_income_sources?: string | null
          payment_status?: string
          phone_number: string
          reference_address?: string | null
          reference_name?: string | null
          reference_phone?: string | null
          signature: string
          status?: string
          updated_at?: string
          years_employed?: number | null
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          employer?: string | null
          employer_address?: string | null
          employer_phone?: string | null
          employment_status?: string | null
          full_name?: string
          id?: string
          interest_rate?: number
          job_title?: string | null
          loan_amount?: number
          loan_duration?: number
          loan_purpose?: string
          monthly_income?: number | null
          other_income_sources?: string | null
          payment_status?: string
          phone_number?: string
          reference_address?: string | null
          reference_name?: string | null
          reference_phone?: string | null
          signature?: string
          status?: string
          updated_at?: string
          years_employed?: number | null
        }
        Relationships: []
      }
      moncash_config: {
        Row: {
          client_id: string
          client_secret: string
          id: string
          is_sandbox: boolean | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          client_secret: string
          id?: string
          is_sandbox?: boolean | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          client_secret?: string
          id?: string
          is_sandbox?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          loan_application_id: string | null
          payment_token: string | null
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          loan_application_id?: string | null
          payment_token?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          loan_application_id?: string | null
          payment_token?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
