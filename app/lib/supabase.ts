import { createClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

// *** BUCKET AND STORAGE
export const createBucket = async (
  bucketName: string,
  {
    isPublic = false,
    allowedMimeTypes = ["image/*"],
    fileSizeLimit = "1MB",
  }: {
    isPublic?: boolean;
    allowedMimeTypes: string[];
    fileSizeLimit?: string | number | null | undefined;
  }
) => {
  if (!bucketName) {
    throw new Error("Bucket name is missing");
  }
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: isPublic,
    allowedMimeTypes,
    fileSizeLimit,
  });
  if (error) {
    throw new Error(error?.message);
  }
  return { data };
};

export const uploadToBucket = async (
  bucketName: string,
  folder: string,
  file: File
) => {
  invariant(bucketName, "Bucket name is required");
  invariant(folder, "Folder name is required");
  invariant(file, "File is required");

  const bucket = await supabase.storage.getBucket(bucketName);
  /**
   * When error happens due to missing bucket we get following error
   * bucket.error: {
   *  __isStorageError: true,
   * name: 'StorageApiError',
   * status: 400,
   * message: 'Bucket not found'
   * stack: 'StorageApiError: Bucket not found ...
   * }
   */
  if (bucket.error) {
    if (bucket.error.message === "Bucket not found") {
      try {
        const { data } = await createBucket(bucketName, {
          allowedMimeTypes: ["image/*"],
          fileSizeLimit: "1MB",
          isPublic: true,
        });
      } catch (e) {
        console.log({ e });
      }
    }
  }
  const path = `${folder}/${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file);
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const downloadFromBucket = async (
  bucketName: string,
  folder: string,
  file: File
) => {
  invariant(bucketName, "Bucket name is required");
  invariant(folder, "Folder name is required");
  invariant(file, "File is required");

  const path = `${folder}/${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(path);
  return { data, error };
};

// *** SUPABASE AUTH
export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};
