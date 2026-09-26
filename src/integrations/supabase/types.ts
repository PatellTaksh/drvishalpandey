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
      about_cards: {
        Row: {
          created_at: string
          icon: string
          id: string
          sort_order: number
          title: string
          updated_at: string
          value: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
          value?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          value?: string
          visible?: boolean
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string | null
          certificate_url: string | null
          created_at: string
          date: string | null
          description: string | null
          external_url: string | null
          id: string
          image_url: string | null
          organization: string | null
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          category?: string | null
          certificate_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          organization?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category?: string | null
          certificate_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          organization?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          user_id?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          issue_date: string | null
          issuer: string
          logo_url: string | null
          name: string
          pdf_url: string | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer: string
          logo_url?: string | null
          name: string
          pdf_url?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer?: string
          logo_url?: string | null
          name?: string
          pdf_url?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          created_at: string
          email: string | null
          email_visible: boolean
          id: string
          location: string | null
          location_visible: boolean
          note: string | null
          phone: string | null
          phone_visible: boolean
          updated_at: string
          website: string | null
          website_visible: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          email_visible?: boolean
          id?: string
          location?: string | null
          location_visible?: boolean
          note?: string | null
          phone?: string | null
          phone_visible?: boolean
          updated_at?: string
          website?: string | null
          website_visible?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          email_visible?: boolean
          id?: string
          location?: string | null
          location_visible?: boolean
          note?: string | null
          phone?: string | null
          phone_visible?: boolean
          updated_at?: string
          website?: string | null
          website_visible?: boolean
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          currently_studying: boolean
          degree: string
          description: string | null
          end_date: string | null
          grade: string | null
          id: string
          institution: string
          location: string | null
          logo_url: string | null
          sort_order: number
          start_date: string | null
          updated_at: string
          visible: boolean
          website: string | null
        }
        Insert: {
          created_at?: string
          currently_studying?: boolean
          degree: string
          description?: string | null
          end_date?: string | null
          grade?: string | null
          id?: string
          institution: string
          location?: string | null
          logo_url?: string | null
          sort_order?: number
          start_date?: string | null
          updated_at?: string
          visible?: boolean
          website?: string | null
        }
        Update: {
          created_at?: string
          currently_studying?: boolean
          degree?: string
          description?: string | null
          end_date?: string | null
          grade?: string | null
          id?: string
          institution?: string
          location?: string | null
          logo_url?: string | null
          sort_order?: number
          start_date?: string | null
          updated_at?: string
          visible?: boolean
          website?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          currently_working: boolean
          description: string | null
          employment_type: string
          end_date: string | null
          id: string
          job_title: string
          location: string | null
          logo_url: string | null
          responsibilities: string[]
          sort_order: number
          start_date: string | null
          technologies: string[]
          updated_at: string
          visible: boolean
          website: string | null
        }
        Insert: {
          company: string
          created_at?: string
          currently_working?: boolean
          description?: string | null
          employment_type?: string
          end_date?: string | null
          id?: string
          job_title: string
          location?: string | null
          logo_url?: string | null
          responsibilities?: string[]
          sort_order?: number
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
          visible?: boolean
          website?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          currently_working?: boolean
          description?: string | null
          employment_type?: string
          end_date?: string | null
          id?: string
          job_title?: string
          location?: string | null
          logo_url?: string | null
          responsibilities?: string[]
          sort_order?: number
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
          visible?: boolean
          website?: string | null
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          enabled: boolean
          href: string
          id: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          href: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          href?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          availability: string | null
          avatar_url: string | null
          bio_long: string
          bio_short: string
          created_at: string
          email: string | null
          full_name: string
          hero_primary_href: string
          hero_primary_label: string
          hero_primary_visible: boolean
          hero_secondary_href: string
          hero_secondary_label: string
          hero_secondary_visible: boolean
          hero_tertiary_href: string
          hero_tertiary_label: string
          hero_tertiary_visible: boolean
          id: string
          location: string | null
          phone: string | null
          professional_title: string
          tagline: string
          updated_at: string
          website: string | null
        }
        Insert: {
          availability?: string | null
          avatar_url?: string | null
          bio_long?: string
          bio_short?: string
          created_at?: string
          email?: string | null
          full_name?: string
          hero_primary_href?: string
          hero_primary_label?: string
          hero_primary_visible?: boolean
          hero_secondary_href?: string
          hero_secondary_label?: string
          hero_secondary_visible?: boolean
          hero_tertiary_href?: string
          hero_tertiary_label?: string
          hero_tertiary_visible?: boolean
          id?: string
          location?: string | null
          phone?: string | null
          professional_title?: string
          tagline?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          availability?: string | null
          avatar_url?: string | null
          bio_long?: string
          bio_short?: string
          created_at?: string
          email?: string | null
          full_name?: string
          hero_primary_href?: string
          hero_primary_label?: string
          hero_primary_visible?: boolean
          hero_secondary_href?: string
          hero_secondary_label?: string
          hero_secondary_visible?: boolean
          hero_tertiary_href?: string
          hero_tertiary_label?: string
          hero_tertiary_visible?: boolean
          id?: string
          location?: string | null
          phone?: string | null
          professional_title?: string
          tagline?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          challenges: string | null
          created_at: string
          demo_url: string | null
          detailed_description: string | null
          end_date: string | null
          featured: boolean
          features: string[]
          github_url: string | null
          id: string
          images: string[]
          role: string | null
          short_description: string
          slug: string
          solutions: string | null
          sort_order: number
          start_date: string | null
          status: string
          team_size: string | null
          technologies: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          visible: boolean
        }
        Insert: {
          category?: string | null
          challenges?: string | null
          created_at?: string
          demo_url?: string | null
          detailed_description?: string | null
          end_date?: string | null
          featured?: boolean
          features?: string[]
          github_url?: string | null
          id?: string
          images?: string[]
          role?: string | null
          short_description?: string
          slug: string
          solutions?: string | null
          sort_order?: number
          start_date?: string | null
          status?: string
          team_size?: string | null
          technologies?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
        }
        Update: {
          category?: string | null
          challenges?: string | null
          created_at?: string
          demo_url?: string | null
          detailed_description?: string | null
          end_date?: string | null
          featured?: boolean
          features?: string[]
          github_url?: string | null
          id?: string
          images?: string[]
          role?: string | null
          short_description?: string
          slug?: string
          solutions?: string | null
          sort_order?: number
          start_date?: string | null
          status?: string
          team_size?: string | null
          technologies?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          file_url: string
          id: string
          is_active: boolean
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string
          description: string
          enabled: boolean
          id: string
          key: string
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          key: string
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          key?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label: string | null
          description: string | null
          features: string[]
          icon: string
          id: string
          name: string
          sort_order: number
          starting_price: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          features?: string[]
          icon?: string
          id?: string
          name: string
          sort_order?: number
          starting_price?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          features?: string[]
          icon?: string
          id?: string
          name?: string
          sort_order?: number
          starting_price?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string
          canonical_url: string | null
          contact_email: string | null
          copyright: string
          created_at: string
          default_theme: string
          favicon_url: string | null
          footer_text: string
          id: string
          logo_url: string | null
          meta_description: string
          meta_title: string
          og_description: string
          og_image_url: string | null
          og_title: string
          site_name: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          canonical_url?: string | null
          contact_email?: string | null
          copyright?: string
          created_at?: string
          default_theme?: string
          favicon_url?: string | null
          footer_text?: string
          id?: string
          logo_url?: string | null
          meta_description?: string
          meta_title?: string
          og_description?: string
          og_image_url?: string | null
          og_title?: string
          site_name?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          canonical_url?: string | null
          contact_email?: string | null
          copyright?: string
          created_at?: string
          default_theme?: string
          favicon_url?: string | null
          footer_text?: string
          id?: string
          logo_url?: string | null
          meta_description?: string
          meta_title?: string
          og_description?: string
          og_image_url?: string | null
          og_title?: string
          site_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          experience: string | null
          icon_url: string | null
          id: string
          level: string | null
          name: string
          percent: number | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          experience?: string | null
          icon_url?: string | null
          id?: string
          level?: string | null
          name: string
          percent?: number | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          experience?: string | null
          icon_url?: string | null
          id?: string
          level?: string | null
          name?: string
          percent?: number | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          icon: string
          id: string
          label: string | null
          platform: string
          sort_order: number
          updated_at: string
          url: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          label?: string | null
          platform: string
          sort_order?: number
          updated_at?: string
          url: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          label?: string | null
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
