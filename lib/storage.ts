import { supabase } from "./supabase";

export class StorageService {
  private static readonly BUCKET_NAME = "models";

  constructor(private bucketName: string = StorageService.BUCKET_NAME) {
    // You can set a different bucket name if needed
    this.bucketName = bucketName;
  }

  /**
   * Ensure the storage bucket exists and is properly configured
   * @returns Promise<boolean> - true if bucket exists or was created successfully
   */
  static async ensureBucketExists(): Promise<boolean> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } =
        await supabase.storage.listBuckets();

      if (listError) {
        console.error("Error listing buckets:", listError);
        return false;
      }

      const bucketExists = buckets?.some(
        (bucket) => bucket.name === this.BUCKET_NAME
      );

      if (bucketExists) {
        return true;
      }

      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(
        this.BUCKET_NAME,
        {
          public: true,
          allowedMimeTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
          fileSizeLimit: 5242880, // 5MB
        }
      );

      if (createError) {
        console.error("Error creating bucket:", createError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error ensuring bucket exists:", error);
      return false;
    }
  }

  /**
   * Upload a file to Supabase storage
   * @param file - The file to upload
   * @param path - The path where the file should be stored
   * @returns Promise with the public URL of the uploaded file
   */
  static async uploadFile(file: File, path: string): Promise<string> {
    try {
      // Check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User must be authenticated to upload files");
      }

      // Ensure bucket exists
      // const bucketReady = await this.ensureBucketExists();
      // if (!bucketReady) {
      //   throw new Error("Storage bucket is not available");
      // }

      // Upload the file
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        console.error("Upload error:", error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error("Storage service error:", error);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase storage
   * @param path - The path of the file to delete
   */
  static async deleteFile(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path]);

      if (error) {
        console.error("Delete error:", error);
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    } catch (error) {
      console.error("Storage service error:", error);
      throw error;
    }
  }

  /**
   * Generate a unique file path
   * @param userId - The user ID
   * @param fileName - The original file name
   * @returns A unique file path
   */
  static generateFilePath(userId: string, fileName: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = fileName.split(".").pop();
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }

  /**
   * Extract file path from public URL
   * @param publicUrl - The public URL of the file
   * @returns The file path
   */
  static extractPathFromUrl(publicUrl: string): string {
    const url = new URL(publicUrl);
    const pathSegments = url.pathname.split("/");
    // Remove the first few segments to get the actual file path
    // URL format: /storage/v1/object/public/bucket-name/file-path
    const bucketIndex = pathSegments.indexOf(this.BUCKET_NAME);
    if (bucketIndex !== -1) {
      return pathSegments.slice(bucketIndex + 1).join("/");
    }
    return "";
  }
}
