export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          balance: number
          created_at: string
          currency: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      deposits: {
        Row: {
          admin_notes: string | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          method: string | null
          reference_number: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          method?: string | null
          reference_number?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          method?: string | null
          reference_number?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          amount: number
          created_at: string
          employment_info: Json | null
          id: string
          loan_type: string
          purpose: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          employment_info?: Json | null
          id?: string
          loan_type: string
          purpose: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          employment_info?: Json | null
          id?: string
          loan_type?: string
          purpose?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_number: string | null
          account_status: string | null
          address: string | null
          balance: number | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          pin_hash: string | null
          profile_image_url: string | null
          role: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          account_status?: string | null
          address?: string | null
          balance?: number | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          pin_hash?: string | null
          profile_image_url?: string | null
          role?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          account_status?: string | null
          address?: string | null
          balance?: number | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          pin_hash?: string | null
          profile_image_url?: string | null
          role?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          description: string
          id: string
          recipient_account: string | null
          recipient_name: string | null
          reference_number: string
          status: string
          transaction_type: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          description: string
          id?: string
          recipient_account?: string | null
          recipient_name?: string | null
          reference_number: string
          status?: string
          transaction_type: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          description?: string
          id?: string
          recipient_account?: string | null
          recipient_name?: string | null
          reference_number?: string
          status?: string
          transaction_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          account_details: Json | null
          admin_notes: string | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          method: string | null
          reference_number: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_details?: Json | null
          admin_notes?: string | null
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          method?: string | null
          reference_number?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_details?: Json | null
          admin_notes?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          method?: string | null
          reference_number?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_user_account: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      add_manual_transaction: {
        Args:
          | {
              target_user_id: string
              transaction_amount: number
              transaction_date?: string
              transaction_description: string
              transaction_type?: string
            }
          | {
              target_user_id: string
              transaction_amount: number
              transaction_description: string
              transaction_type?: string
            }
        Returns: undefined
      }
      admin_get_all_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_number: string
          account_status: string
          balance: number
          created_at: string
          first_name: string
          id: string
          last_name: string
          phone: string
          role: string
          status: string
          user_id: string
        }[]
      }
      authenticate_admin: {
        Args: { password_param: string; username_param: string }
        Returns: {
          admin_id: string
          authenticated: boolean
          username: string
        }[]
      }
      fund_user_account: {
        Args: { amount: number; target_user_id: string }
        Returns: undefined
      }
      generate_account_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_reference_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_email: string }
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      toggle_user_status: {
        Args: { new_status: string; target_user_id: string }
        Returns: undefined
      }
      update_transaction_date: {
        Args: { new_date: string; table_name: string; transaction_id: string }
        Returns: undefined
      }
      update_user_balance: {
        Args: { amount_param: number; operation: string; user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
