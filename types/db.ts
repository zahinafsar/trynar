export type TokenRow = {
  id: number;
  created_at: string;
  user: string;
  amount: number;
};

export type TokenInsert = {
  user?: string;
  amount: number;
};

export type TokenUpdate = {
  amount?: number;
};

export type ModelRow = {
  id: number;
  created_at: string;
  user: string;
  name: string;
  product_url: string;
  image_url?: string;
  category?: string;
};

export type ModelInsert = {
  user: string;
  name: string;
  product_url: string;
  image_url?: string;
  category?: string;
  url?: string;
};

export type ModelUpdate = {
  user?: string;
  name?: string;
  product_url?: string;
  image_url?: string;
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
