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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_date_availability: {
        Row: {
          application_id: string
          date_option_id: string
          id: string
        }
        Insert: {
          application_id: string
          date_option_id: string
          id?: string
        }
        Update: {
          application_id?: string
          date_option_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_date_availability_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_date_availability_date_option_id_fkey"
            columns: ["date_option_id"]
            isOneToOne: false
            referencedRelation: "date_options"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          city: string
          confirmation_token: string
          country: string
          created_at: string
          email: string
          event_id: string
          first_name: string
          footwear_fit: string
          id: string
          instagram_handle: string | null
          ip_hash: string | null
          is_adult: boolean
          last_name: string
          pace: string | null
          phone: string
          preferred_date_id: string
          runner_description: string | null
          running_level: string
          shoe_size: string
          shoe_size_system: string
          status: Database["public"]["Enums"]["application_status"]
          trail_experience: string
        }
        Insert: {
          city: string
          confirmation_token?: string
          country: string
          created_at?: string
          email: string
          event_id: string
          first_name: string
          footwear_fit: string
          id?: string
          instagram_handle?: string | null
          ip_hash?: string | null
          is_adult?: boolean
          last_name: string
          pace?: string | null
          phone: string
          preferred_date_id: string
          runner_description?: string | null
          running_level: string
          shoe_size: string
          shoe_size_system: string
          status?: Database["public"]["Enums"]["application_status"]
          trail_experience: string
        }
        Update: {
          city?: string
          confirmation_token?: string
          country?: string
          created_at?: string
          email?: string
          event_id?: string
          first_name?: string
          footwear_fit?: string
          id?: string
          instagram_handle?: string | null
          ip_hash?: string | null
          is_adult?: boolean
          last_name?: string
          pace?: string | null
          phone?: string
          preferred_date_id?: string
          runner_description?: string | null
          running_level?: string
          shoe_size?: string
          shoe_size_system?: string
          status?: Database["public"]["Enums"]["application_status"]
          trail_experience?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_preferred_date_id_fkey"
            columns: ["preferred_date_id"]
            isOneToOne: false
            referencedRelation: "date_options"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          application_id: string
          consent_key: string
          created_at: string
          granted: boolean
          id: string
          policy_version: string
        }
        Insert: {
          application_id: string
          consent_key: string
          created_at?: string
          granted: boolean
          id?: string
          policy_version: string
        }
        Update: {
          application_id?: string
          consent_key?: string
          created_at?: string
          granted?: boolean
          id?: string
          policy_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      date_options: {
        Row: {
          created_at: string
          event_date: string
          event_id: string
          id: string
          is_active: boolean
          sort_order: number
        }
        Insert: {
          created_at?: string
          event_date: string
          event_id: string
          id?: string
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          created_at?: string
          event_date?: string
          event_id?: string
          id?: string
          is_active?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "date_options_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_settings: {
        Row: {
          event_id: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          event_id: string
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          event_id?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          applications_open: boolean
          capacity: number
          cookie_url: string
          created_at: string
          distance_km: string
          elevation_m: string
          final_date_id: string | null
          id: string
          latitude: number
          location: string
          longitude: number
          max_applications: number
          meeting_point: string
          meeting_time: string
          privacy_url: string
          privacy_version: string
          route_notes: string
          slug: string
          surface: string
          terms_url: string
          title: string
          updated_at: string
          waitlist_mode: boolean
          weather_enabled: boolean
        }
        Insert: {
          applications_open?: boolean
          capacity?: number
          cookie_url?: string
          created_at?: string
          distance_km?: string
          elevation_m?: string
          final_date_id?: string | null
          id?: string
          latitude?: number
          location?: string
          longitude?: number
          max_applications?: number
          meeting_point?: string
          meeting_time?: string
          privacy_url?: string
          privacy_version?: string
          route_notes?: string
          slug: string
          surface?: string
          terms_url?: string
          title: string
          updated_at?: string
          waitlist_mode?: boolean
          weather_enabled?: boolean
        }
        Update: {
          applications_open?: boolean
          capacity?: number
          cookie_url?: string
          created_at?: string
          distance_km?: string
          elevation_m?: string
          final_date_id?: string | null
          id?: string
          latitude?: number
          location?: string
          longitude?: number
          max_applications?: number
          meeting_point?: string
          meeting_time?: string
          privacy_url?: string
          privacy_version?: string
          route_notes?: string
          slug?: string
          surface?: string
          terms_url?: string
          title?: string
          updated_at?: string
          waitlist_mode?: boolean
          weather_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "events_final_date_fk"
            columns: ["final_date_id"]
            isOneToOne: false
            referencedRelation: "date_options"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          application_id: string
          attendance_confirmed: boolean
          confirmed_at: string | null
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          final_shoe_size: string | null
          id: string
          image_release_accepted: boolean
          medical_note: string | null
          rules_acknowledged: boolean
        }
        Insert: {
          application_id: string
          attendance_confirmed?: boolean
          confirmed_at?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          final_shoe_size?: string | null
          id?: string
          image_release_accepted?: boolean
          medical_note?: string | null
          rules_acknowledged?: boolean
        }
        Update: {
          application_id?: string
          attendance_confirmed?: boolean
          confirmed_at?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          final_shoe_size?: string | null
          id?: string
          image_release_accepted?: boolean
          medical_note?: string | null
          rules_acknowledged?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "participants_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      date_preference_stats: {
        Args: { _event_id: string }
        Returns: {
          date_option_id: string
          event_date: string
          pct: number
          preferred_count: number
          total: number
        }[]
      }
    }
    Enums: {
      application_status:
        | "APPLICATION_RECEIVED"
        | "WAITLISTED"
        | "ACCEPTED"
        | "DECLINED"
        | "CONFIRMED"
        | "CANCELLED"
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
      application_status: [
        "APPLICATION_RECEIVED",
        "WAITLISTED",
        "ACCEPTED",
        "DECLINED",
        "CONFIRMED",
        "CANCELLED",
      ],
    },
  },
} as const
