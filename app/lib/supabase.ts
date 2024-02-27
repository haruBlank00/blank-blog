import { createClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export const createBucket = async (bucketName: string) => {
  if (!bucketName) {
    throw new Error("Bucket name is missing");
  }
  const { data, error } = await supabase.storage.createBucket(bucketName);
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
        const { data } = await createBucket(bucketName);
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
