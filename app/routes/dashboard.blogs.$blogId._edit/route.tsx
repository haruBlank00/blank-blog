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

import { Editor } from "./editor.client";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const blogId = params.blogId;
  try {
    if (blogId !== "new") {
      const blog = await db.blog.findFirst({
        where: {
          id: blogId,
        },
      });

      const { id, semanticHtml, title, coverImageUrl } = blog || {};
      console.log(coverImageUrl);
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

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (name === "cover-image") {
      }
      return undefined;
    },
    // fallback to memory for everything else
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
    },
    data: {
      semanticHtml,
      coverImageUrl,
      title,
    },
  });

  return { blog, message: "Blog updated successfully" };
};
