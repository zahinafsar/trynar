import { supabase } from "./supabase";
import { TokenInsert } from "@/types/db";

export interface TokenResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export const getUserTokens = async (userId: string): Promise<TokenResponse> => {
  try {
    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .eq("user", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const getTokenBalance = async (
  userId: string
): Promise<TokenResponse> => {
  try {
    const { data, error } = await supabase
      .from("tokens")
      .select("amount")
      .eq("user", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    const balance = data?.reduce((sum, token) => sum + token.amount, 0) || 0;
    return { success: true, data: balance };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const addTokens = async (amount: number): Promise<TokenResponse> => {
  try {
    const tokenData: TokenInsert = {
      amount: amount,
    };

    // Note: You need to add the user field to TokenInsert type and handle it in RLS policies
    const { data, error } = await supabase
      .from("tokens")
      .insert([{ ...tokenData }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const consumeTokens = async (
  userId: string,
  amount: number
): Promise<TokenResponse> => {
  try {
    // First check if user has enough tokens
    const balanceResponse = await getTokenBalance(userId);
    if (!balanceResponse.success) {
      return balanceResponse;
    }

    const currentBalance = balanceResponse.data;
    if (currentBalance < amount) {
      return { success: false, error: "Insufficient tokens" };
    }

    // Add negative amount to represent usage
    const tokenData: TokenInsert = {
      amount: -amount,
    };

    const { data, error } = await supabase
      .from("tokens")
      .insert([{ ...tokenData, user: userId }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const getTokenHistory = async (
  userId: string,
  limit: number = 10
): Promise<TokenResponse> => {
  try {
    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .eq("user", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
};
