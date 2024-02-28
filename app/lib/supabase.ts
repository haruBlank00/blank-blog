import {
  createServerClient as _createServerClient,
  parse,
  serialize,
} from "@supabase/ssr";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";
import { nanoid } from "nanoid";
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
  supabase: SupabaseClient<any, "public", any>,
  bucketName: string,
  folder: string,
  file: File
) => {
  invariant(bucketName, "Bucket name is required");
  invariant(folder, "Folder name is required");
  invariant(file, "File is required");

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

  const randomId = nanoid();
  const path = `${folder}/${randomId}_${file.name}`;

  return await supabase.storage.from(bucketName).upload(path, file);
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

export const getPublicUrl = (
  supabase: SupabaseClient,
  bucketName: string,
  path: string
) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
};

// *** SUPABASE AUTH
export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const createServerClient = (request: Request) => {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();
  const supabase = _createServerClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(key) {
          console.log("getting cookie");
          return cookies[key];
        },
        set(key, value, options) {
          console.log("setting cookie");
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  return { headers, supabase } as const;
};
