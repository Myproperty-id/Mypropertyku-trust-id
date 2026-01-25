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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_inquiries: {
        Row: {
          category: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          building_size: number | null
          certificate_type:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          city: string
          created_at: string
          description: string | null
          floors: number | null
          id: string
          images: string[] | null
          is_published: boolean | null
          land_size: number | null
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          price: number
          property_type: string
          province: string
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          risk_notes: string | null
          title: string
          updated_at: string
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          year_built: number | null
          zoning_info: string | null
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          building_size?: number | null
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          city: string
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          land_size?: number | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          price: number
          property_type: string
          province: string
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_notes?: string | null
          title: string
          updated_at?: string
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          year_built?: number | null
          zoning_info?: string | null
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          building_size?: number | null
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          city?: string
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          land_size?: number | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          price?: number
          property_type?: string
          province?: string
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_notes?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          year_built?: number | null
          zoning_info?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          assigned_to: string | null
          certificate_verified: boolean | null
          created_at: string
          dispute_checked: boolean | null
          documents: string[] | null
          id: string
          notes: string | null
          property_id: string
          requested_by: string
          status: Database["public"]["Enums"]["verification_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          certificate_verified?: boolean | null
          created_at?: string
          dispute_checked?: boolean | null
          documents?: string[] | null
          id?: string
          notes?: string | null
          property_id: string
          requested_by: string
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          certificate_verified?: boolean | null
          created_at?: string
          dispute_checked?: boolean | null
          documents?: string[] | null
          id?: string
          notes?: string | null
          property_id?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          _action: string
          _entity_id?: string
          _entity_type: string
          _new_data?: Json
          _old_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "agent" | "user"
      certificate_type: "shm" | "shgb" | "hpl" | "girik" | "ajb" | "ppjb"
      kyc_status: "not_started" | "pending" | "verified" | "rejected"
      risk_level: "low" | "medium" | "high"
      verification_status: "pending" | "in_review" | "approved" | "rejected"
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
      app_role: ["admin", "agent", "user"],
      certificate_type: ["shm", "shgb", "hpl", "girik", "ajb", "ppjb"],
      kyc_status: ["not_started", "pending", "verified", "rejected"],
      risk_level: ["low", "medium", "high"],
      verification_status: ["pending", "in_review", "approved", "rejected"],
    },
  },
} as const
