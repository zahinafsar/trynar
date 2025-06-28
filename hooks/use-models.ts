import { useState, useEffect } from "react";
import { ModelsService } from "@/lib/models";
import { ModelRow } from "@/types/db";
import { supabase } from "@/lib/supabase";

export function useModels() {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userModels = await ModelsService.getUserModels(user.id);
      setModels(userModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch models");
      console.error("Error fetching models:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const createModel = async (
    modelData: Omit<ModelRow, "id" | "created_at">
  ) => {
    try {
      const newModel = await ModelsService.createModel(modelData);
      setModels((prev) => [newModel, ...prev]);
      return newModel;
    } catch (err) {
      throw err;
    }
  };

  const updateModel = async (id: number, updates: Partial<ModelRow>) => {
    try {
      const updatedModel = await ModelsService.updateModel(id, updates);
      setModels((prev) =>
        prev.map((model) => (model.id === id ? updatedModel : model))
      );
      return updatedModel;
    } catch (err) {
      throw err;
    }
  };

  const deleteModel = async (id: number) => {
    try {
      await ModelsService.deleteModel(id);
      setModels((prev) => prev.filter((model) => model.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    models,
    loading,
    error,
    fetchModels,
    createModel,
    updateModel,
    deleteModel,
  };
}
