export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      complaint_feedback: {
        Row: {
          comment: string;
          complaint_id: string;
          created_at: string;
          id: string;
          rating: number;
          user_id: string;
        };
        Insert: {
          comment?: string;
          complaint_id: string;
          created_at?: string;
          id?: string;
          rating: number;
          user_id: string;
        };
        Update: {
          comment?: string;
          complaint_id?: string;
          created_at?: string;
          id?: string;
          rating?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "complaint_feedback_complaint_id_fkey";
            columns: ["complaint_id"];
            isOneToOne: true;
            referencedRelation: "complaints";
            referencedColumns: ["id"];
          },
        ];
      };
      complaint_status_history: {
        Row: {
          changed_by: string | null;
          complaint_id: string;
          created_at: string;
          id: string;
          new_status: Database["public"]["Enums"]["complaint_status"];
          note: string;
          old_status: Database["public"]["Enums"]["complaint_status"] | null;
        };
        Insert: {
          changed_by?: string | null;
          complaint_id: string;
          created_at?: string;
          id?: string;
          new_status: Database["public"]["Enums"]["complaint_status"];
          note?: string;
          old_status?: Database["public"]["Enums"]["complaint_status"] | null;
        };
        Update: {
          changed_by?: string | null;
          complaint_id?: string;
          created_at?: string;
          id?: string;
          new_status?: Database["public"]["Enums"]["complaint_status"];
          note?: string;
          old_status?: Database["public"]["Enums"]["complaint_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "complaint_status_history_complaint_id_fkey";
            columns: ["complaint_id"];
            isOneToOne: false;
            referencedRelation: "complaints";
            referencedColumns: ["id"];
          },
        ];
      };
      complaints: {
        Row: {
          assigned_to: string | null;
          category: string;
          created_at: string;
          description: string;
          id: string;
          is_anonymous: boolean;
          location: string;
          photo_paths: string[];
          priority: Database["public"]["Enums"]["complaint_priority"];
          reference: string;
          resolved_at: string | null;
          status: Database["public"]["Enums"]["complaint_status"];
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assigned_to?: string | null;
          category: string;
          created_at?: string;
          description: string;
          id?: string;
          is_anonymous?: boolean;
          location: string;
          photo_paths?: string[];
          priority?: Database["public"]["Enums"]["complaint_priority"];
          reference?: string;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["complaint_status"];
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assigned_to?: string | null;
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          is_anonymous?: boolean;
          location?: string;
          photo_paths?: string[];
          priority?: Database["public"]["Enums"]["complaint_priority"];
          reference?: string;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["complaint_status"];
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          complaint_id: string | null;
          created_at: string;
          id: string;
          is_read: boolean;
          message: string;
          user_id: string;
        };
        Insert: {
          complaint_id?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message: string;
          user_id: string;
        };
        Update: {
          complaint_id?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_complaint_id_fkey";
            columns: ["complaint_id"];
            isOneToOne: false;
            referencedRelation: "complaints";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          department: string;
          email: string;
          full_name: string;
          id: string;
          phone: string;
          roll_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          department?: string;
          email?: string;
          full_name?: string;
          id: string;
          phone?: string;
          roll_id?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          department?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string;
          roll_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      next_complaint_reference: { Args: never; Returns: string };
    };
    Enums: {
      app_role: "admin" | "student";
      complaint_priority: "Low" | "Medium" | "High";
      complaint_status: "Pending" | "Assigned" | "In Progress" | "Resolved";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
      complaint_priority: ["Low", "Medium", "High"],
      complaint_status: ["Pending", "Assigned", "In Progress", "Resolved"],
    },
  },
} as const;
