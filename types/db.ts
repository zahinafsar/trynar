export type UsageRow = {
  id: number;
  created_at: string;
  user: string;
  token: number;
};

export type UsageInsert = {
  user: string;
  token: number;
};

export type UsageUpdate = {
  id?: number;
  created_at?: string;
  user?: string;
  token?: number;
};

export type SubscriptionRow = {
  id: number;
  created_at: string;
  user: string;
  token: number;
};

export type SubscriptionInsert = {
  user: string;
  token: number;
};

export type SubscriptionUpdate = {
  id?: number;
  created_at?: string;
  user?: string;
  token?: number;
};

export type Database = {
  public: {
    Tables: {
      usage: {
        Row: UsageRow;
        Insert: UsageInsert;
        Update: UsageUpdate;
      };
      subscription: {
        Row: SubscriptionRow;
        Insert: SubscriptionInsert;
        Update: SubscriptionUpdate;
      };
    };
  };
}; 