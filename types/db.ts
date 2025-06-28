export type TokenRow = {
  id: number;
  created_at: string;
  user: string;
  amount: number;
};

export type TokenInsert = {
  amount: number;
};

export type TokenUpdate = {
  amount?: number;
};

export type ModelRow = {
  id: number;
  created_at: string;
  user: string;
  url: string;
  category: string;
};

export type ModelInsert = {
  url: string;
  category: string;
};

export type ModelUpdate = {
  url?: string;
  category?: string;
};

export type Database = {
  public: {
    Tables: {
      tokens: {
        Row: TokenRow;
        Insert: TokenInsert;
        Update: TokenUpdate;
      };
      models: {
        Row: ModelRow;
        Insert: ModelInsert;
        Update: ModelUpdate;
      };
    };
  };
}; 