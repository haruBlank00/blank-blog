import { writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary, { UploadApiResponse } from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "thevervefashion",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          result && resolve(result);
        }
      );
      await writeAsyncIterableToWritable(data, uploadStream);
    }
  );

  return uploadPromise;
}

// console.log("configs", cloudinary.v2.config());
export { uploadImage };

// export async function deleteCloudinaryImage(id) {
//   return cloudinary.v2.uploader.destroy(id, { invalidate: true });
// }

// export async function deleteCloudinaryImages(ids) {
//   return cloudinary.v2.api.delete_resources(ids, { invalidate: true });
// }

// export function getCloudinaryPublicId(imageUrl) {
//   const regex = /thevervefashion\/([a-zA-Z0-9]+)/;
//   const match = imageUrl.match(regex);
//   const publicId = match ? match[0] : "";
//   return publicId;
// }
