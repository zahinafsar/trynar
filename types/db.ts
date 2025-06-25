export type TokenRow = {
  id: number;
  created_at: string;
  user: string;
  amount: number;
};

export type TokenInsert = {
  user: string;
  amount: number;
};

export type TokenUpdate = {
  id?: number;
  created_at?: string;
  user?: string;
  amount?: number;
};

export type Database = {
  public: {
    Tables: {
      tokens: {
        Row: TokenRow;
        Insert: TokenInsert;
        Update: TokenUpdate;
      };
    };
  };
}; 