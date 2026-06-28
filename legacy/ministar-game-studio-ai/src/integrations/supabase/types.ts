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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          reading_time_minutes: number
          slug: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_time_minutes?: number
          slug: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_time_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          game_data: Json
          game_type: string
          game_version: number
          id: string
          is_active: boolean | null
          is_community_shared: boolean
          share_code: string
          share_code_locked: boolean
          worksheet_id: string
        }
        Insert: {
          created_at?: string
          game_data?: Json
          game_type: string
          game_version?: number
          id?: string
          is_active?: boolean | null
          is_community_shared?: boolean
          share_code: string
          share_code_locked?: boolean
          worksheet_id: string
        }
        Update: {
          created_at?: string
          game_data?: Json
          game_type?: string
          game_version?: number
          id?: string
          is_active?: boolean | null
          is_community_shared?: boolean
          share_code?: string
          share_code_locked?: boolean
          worksheet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_worksheet_id_fkey"
            columns: ["worksheet_id"]
            isOneToOne: false
            referencedRelation: "worksheets"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          created_at: string
          game_id: string
          id: string
          player_name: string
          score: number
          time_taken_seconds: number | null
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          player_name: string
          score?: number
          time_taken_seconds?: number | null
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          player_name?: string
          score?: number
          time_taken_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "community_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_entries_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          instruction_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          instruction_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          instruction_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          avatar: string
          best_streak: number
          created_at: string
          device_id: string
          id: string
          level: number
          player_name: string
          total_correct: number
          total_games_played: number
          total_questions: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar?: string
          best_streak?: number
          created_at?: string
          device_id: string
          id?: string
          level?: number
          player_name: string
          total_correct?: number
          total_games_played?: number
          total_questions?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar?: string
          best_streak?: number
          created_at?: string
          device_id?: string
          id?: string
          level?: number
          player_name?: string
          total_correct?: number
          total_games_played?: number
          total_questions?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worksheets: {
        Row: {
          analysis_results: Json | null
          audience_level: string | null
          content_text: string | null
          content_type: string
          created_at: string
          file_url: string | null
          id: string
          instruction_language: string | null
          is_public: boolean
          subject_area: string | null
          term_end_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_results?: Json | null
          audience_level?: string | null
          content_text?: string | null
          content_type: string
          created_at?: string
          file_url?: string | null
          id?: string
          instruction_language?: string | null
          is_public?: boolean
          subject_area?: string | null
          term_end_date?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_results?: Json | null
          audience_level?: string | null
          content_text?: string | null
          content_type?: string
          created_at?: string
          file_url?: string | null
          id?: string
          instruction_language?: string | null
          is_public?: boolean
          subject_area?: string | null
          term_end_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_games: {
        Row: {
          audience_level: string | null
          content_summary: string | null
          created_at: string | null
          game_data: Json | null
          game_type: string | null
          grade_level: string | null
          id: string | null
          share_code: string | null
          subject_area: string | null
          theme: string | null
          worksheet_title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lock_worksheet_share_codes: {
        Args: { p_worksheet_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "teacher" | "student"
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
      app_role: ["teacher", "student"],
    },
  },
} as const
