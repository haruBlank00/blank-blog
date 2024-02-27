import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { db } from "~/lib/prisma";
import { Editor } from "./editor.client";
import { useActionData, useLoaderData } from "@remix-run/react";
import { uploadToBucket } from "~/lib/supabase";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const blogId = params.blogId;
  try {
    if (blogId !== "new") {
      const blog = await db.blog.findFirst({
        where: {
          id: blogId,
        },
      });
      return { semanticHtml: blog?.semanticHtml, buttonLabel: "Update" };
    }

    return { semanticHtml: "", buttonLabel: "Create" };
  } catch (e) {
    console.log(`[BLOG/:blogId] - ERROR`, e);
    return { semanticHtml: "", buttonLabel: "Create" };
  }
};

export default function CreateEditBlog() {
  const { semanticHtml = "", buttonLabel } = useLoaderData<typeof loader>();
  const actionData = useActionData<Promise<typeof action>>();
  return (
    <div>
      <h2>Create blog</h2>
      <ClientOnly>
        {() => <Editor semanticHtml={semanticHtml} buttonLabel={buttonLabel} />}
      </ClientOnly>
    </div>
  );
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const blogId = params.blogId;

  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name === "cover-image") {
        invariant(filename, "file name is missing");
        const dataArray1 = [];
        for await (const x of data) {
          dataArray1.push(x);
        }
        try {
          const bucket = await uploadToBucket(
            "blogs",
            "cover-images",
            new File(dataArray1, filename, { type: contentType })
          );
        } catch (e) {
          console.log({ e });
        }
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
  const coverImage = formData.get("cover-image");
  const title = formData.get("title");

  console.log({ semanticHtml, coverImage, title });

  invariant(semanticHtml, "Please provide a semantic html to save :)");

  if (blogId === "new") {
    const blog = await db.blog.create({
      data: {
        semanticHtml,
      },
    });
    return { blog, message: "Blog created successfully" };
  }

  const blog = await db.blog.update({
    where: {
      id: blogId,
    },
    data: {
      semanticHtml,
    },
  });
  return { blog, message: "Blog updated successfully" };
};
