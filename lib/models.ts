import { supabase } from "./supabase";
import { ModelRow, ModelInsert, ModelUpdate } from "@/types/db";

export class ModelsService {
  /**
   * Create a new model record
   * @param model - The model data to insert
   * @returns Promise with the created model
   */
  static async createModel(model: ModelInsert): Promise<ModelRow> {
    try {
      const { data, error } = await supabase
        .from("models")
        .insert(model)
        .select()
        .single();

      if (error) {
        console.error("Error creating model:", error);
        throw new Error(`Failed to create model: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Models service error:", error);
      throw error;
    }
  }

  /**
   * Update an existing model
   * @param id - The model ID
   * @param updates - The fields to update
   * @returns Promise with the updated model
   */
  static async updateModel(
    id: string,
    updates: ModelUpdate
  ): Promise<ModelRow> {
    try {
      const { data, error } = await supabase
        .from("models")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating model:", error);
        throw new Error(`Failed to update model: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Models service error:", error);
      throw error;
    }
  }

  /**
   * Get models for a specific user
   * @param userId - The user ID
   * @returns Promise with the user's models
   */
  static async getUserModels(userId: string): Promise<ModelRow[]> {
    try {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("user", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching models:", error);
        throw new Error(`Failed to fetch models: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Models service error:", error);
      throw error;
    }
  }

  /**
   * Get a specific model by ID
   * @param id - The model ID
   * @returns Promise with the model
   */
  static async getModel(id: string): Promise<ModelRow | null> {
    try {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Model not found
        }
        console.error("Error fetching model:", error);
        throw new Error(`Failed to fetch model: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Models service error:", error);
      throw error;
    }
  }

  /**
   * Delete a model
   * @param id - The model ID
   */
  static async deleteModel(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("models").delete().eq("id", id);

      if (error) {
        console.error("Error deleting model:", error);
        throw new Error(`Failed to delete model: ${error.message}`);
      }
    } catch (error) {
      console.error("Models service error:", error);
      throw error;
    }
  }
}
