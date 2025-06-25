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
      neighborhoods: {
        Row: {
          avg_price: number
          created_at: string | null
          education: number | null
          entertainment: number | null
          green_spaces: number | null
          id: string
          name: string
          price_per_meter: number
          region_id: string
          retail: number | null
          safety: number | null
          updated_at: string | null
          walkability: number | null
        }
        Insert: {
          avg_price: number
          created_at?: string | null
          education?: number | null
          entertainment?: number | null
          green_spaces?: number | null
          id?: string
          name: string
          price_per_meter: number
          region_id: string
          retail?: number | null
          safety?: number | null
          updated_at?: string | null
          walkability?: number | null
        }
        Update: {
          avg_price?: number
          created_at?: string | null
          education?: number | null
          entertainment?: number | null
          green_spaces?: number | null
          id?: string
          name?: string
          price_per_meter?: number
          region_id?: string
          retail?: number | null
          safety?: number | null
          updated_at?: string | null
          walkability?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          property_title: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          property_title: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          property_title?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          password_hash: string
          phone: string | null
          profile_picture_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          password_hash: string
          phone?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          password_hash?: string
          phone?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          area: number
          bathrooms: number
          bedrooms: number
          coordinates: unknown
          created_at: string | null
          description: string | null
          energy_class: string
          floor: number | null
          heating_type: string | null
          historical_prices: Json | null
          id: string
          image_url: string | null
          neighborhood: string | null
          parking: string | null
          price: number
          property_type: string
          region: string | null
          solar_water_heater: boolean | null
          title: string
          updated_at: string | null
          user_id: string
          year_built: number
        }
        Insert: {
          address?: string | null
          area: number
          bathrooms: number
          bedrooms: number
          coordinates: unknown
          created_at?: string | null
          description?: string | null
          energy_class: string
          floor?: number | null
          heating_type?: string | null
          historical_prices?: Json | null
          id?: string
          image_url?: string | null
          neighborhood?: string | null
          parking?: string | null
          price: number
          property_type: string
          region?: string | null
          solar_water_heater?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
          year_built: number
        }
        Update: {
          address?: string | null
          area?: number
          bathrooms?: number
          bedrooms?: number
          coordinates?: unknown
          created_at?: string | null
          description?: string | null
          energy_class?: string
          floor?: number | null
          heating_type?: string | null
          historical_prices?: Json | null
          id?: string
          image_url?: string | null
          neighborhood?: string | null
          parking?: string | null
          price?: number
          property_type?: string
          region?: string | null
          solar_water_heater?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
          year_built?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_historical_averages: {
        Args: { p_year: number; p_neighborhood: string }
        Returns: {
          market_avg: number
          neighborhood_avg: number
          athens_avg: number
        }[]
      }
      get_property_averages: {
        Args: { property_id: string }
        Returns: {
          market_avg: number
          neighborhood_avg: number
        }[]
      }
      get_property_historical_data: {
        Args: { property_id: string }
        Returns: {
          year: number
          price: number
          market_avg: number
          neighborhood_avg: number
          athens_avg: number
        }[]
      }
      get_region_property_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          region_id: string
          apartment_count: number
          house_count: number
        }[]
      }
    }
    Enums: {
      notification_type: "property_added" | "property_deleted"
      region_id:
        | "central-athens"
        | "piraeus-coast"
        | "north-attica"
        | "east-attica"
        | "west-attica"
        | "south-athens"
        | "northeast-athens"
      user_role: "user" | "admin"
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
    Enums: {
      notification_type: ["property_added", "property_deleted"],
      region_id: [
        "central-athens",
        "piraeus-coast",
        "north-attica",
        "east-attica",
        "west-attica",
        "south-athens",
        "northeast-athens",
      ],
      user_role: ["user", "admin"],
    },
  },
} as const
