export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      /** Token usage tracking for AI model access */
      tokens: {
        Row: {
          /** Amount of tokens used */
          amount: number;
          /** When created */
          created_at: string;
          /** Unique identifier for the token record */
          id: string;
          /** User who used the tokens */
          user: string;
        };
        Insert: {
          /** Amount of tokens used */
          amount: number;
          /** When created */
          created_at?: string;
          /** Unique identifier for the token record */
          id?: string;
          /** User who used the tokens */
          user?: string;
        };
        Update: {
          /** Amount of tokens used */
          amount?: number;
          /** When created */
          created_at?: string;
          /** Unique identifier for the token record */
          id?: string;
          /** User who used the tokens */
          user?: string;
        };
        Relationships: [];
      };
      /** Product models for virtual try-on */
      models: {
        Row: {
          /** Category of the product */
          category?: string;
          /** When created */
          created_at: string;
          /** Unique identifier for the model */
          id: string;
          /** Generated image URL */
          image_url?: string;
          /** Name of the product model */
          name: string;
          /** User who created the model */
          user: string;
        };
        Insert: {
          /** Category of the product */
          category?: string;
          /** When created */
          created_at?: string;
          /** Unique identifier for the model */
          id?: string;
          /** Generated image URL */
          image_url?: string;
          /** Name of the product model */
          name: string;
          /** User who created the model */
          user?: string;
        };
        Update: {
          /** Category of the product */
          category?: string;
          /** When created */
          created_at?: string;
          /** Unique identifier for the model */
          id?: string;
          /** Generated image URL */
          image_url?: string;
          /** Name of the product model */
          name?: string;
          /** User who created the model */
          user?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      /* Views are within tables */
    };
    Functions: {
      /* No support for functions */
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

// Convenience type aliases for the models table
export type ModelRow = Tables<'models'>;
export type ModelInsert = TablesInsert<'models'>;
export type ModelUpdate = TablesUpdate<'models'>;

// Convenience type aliases for the tokens table
export type TokenRow = Tables<'tokens'>;
export type TokenInsert = TablesInsert<'tokens'>;
export type TokenUpdate = TablesUpdate<'tokens'>;