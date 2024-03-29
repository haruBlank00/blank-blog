import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { db } from "~/lib/prisma";

import { uploadImage } from "~/services/cloudinary.server";
import { Editor } from "./editor.client";
import { authenticator } from "~/services/auth.server";
import { getSession, getUser } from "~/services/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const blogId = params.blogId;
  const user = await getUser(request);
  try {
    if (blogId !== "new") {
      const blog = await db.blog.findFirst({
        where: {
          userId: user.id,
          id: blogId,
        },
      });

      const { id, semanticHtml, title, coverImageUrl } = blog || {};
      return {
        id,
        semanticHtml,
        title,
        coverImageUrl,
        buttonLabel: "Update",
      };
    }
  } catch (e) {
    console.log(`[BLOG/:blogId] - ERROR`, e);
  }
  return { semanticHtml: "", buttonLabel: "", title: "", coverImageUrl: "" };
};

export default function CreateEditBlog() {
  const {
    semanticHtml = "",
    buttonLabel,
    title = "",
    coverImageUrl = "",
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<Promise<typeof action>>();
  return (
    <div>
      <h2>Create blog</h2>
      <ClientOnly>
        {() => (
          <Editor
            semanticHtml={semanticHtml}
            title={title}
            coverImageUrl={coverImageUrl}
            buttonLabel={buttonLabel}
          />
        )}
      </ClientOnly>
    </div>
  );
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const blogId = params.blogId;
  const user = await getUser(request);
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (name === "cover-image") {
        const image = await uploadImage(data);
        return image.secure_url;
      }
      return undefined;
    },
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const semanticHtml = formData.get("semantic-html")?.toString();
  const coverImageUrl = formData.get("cover-image")?.toString();
  const title = formData.get("title")?.toString();

  invariant(semanticHtml, "Please provide a semantic html to save :)");
  invariant(coverImageUrl, "Please provide a cover image");
  invariant(title, "Please provide a title");

  if (blogId === "new") {
    const blog = await db.blog.create({
      data: {
        userId: user.id,
        semanticHtml,
        coverImageUrl,
        title,
      },
    });
    const url = `/dashboard/blogs/${blog.id}`;
    return redirect(url);
  }

  const blog = await db.blog.update({
    where: {
      id: blogId,
      userId: user.id,
    },
    data: {
      semanticHtml,
      coverImageUrl,
      title,
    },
  });

  return { blog, message: "Blog updated successfully" };
};

async function uploadImageToCloudinary(data: AsyncIterable<Uint8Array>) {
  // const uploadPromise = new Promise<UploadApiResponse>(
  //   async (resolve, reject) => {
  //     const uploadStream = cloudinaryServer.uploader.upload_stream(
  //       {
  //         folder: "coverImages",
  //       },
  //       (error, result) => {
  //         if (error) {
  //           reject(error);
  //           return;
  //         }
  //         result && resolve(result);
  //       }
  //     );
  //     await writeAsyncIterableToWritable(data, uploadStream);
  //   }
  // );
  // return uploadPromise;
}
