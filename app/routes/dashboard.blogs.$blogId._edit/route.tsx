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
      if (name !== "img") {
        return undefined;
      }
      console.log({ name, contentType, data, filename });
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  // const uploadHandler = unstable_composeUploadHandlers(
  //   unstable_createFileUploadHandler({
  //     avoidFileConflicts: true,
  //     directory: "/tmp",
  //     file: ({ filename }) => filename,
  //     maxPartSize: 5_000_000,
  //   }),
  //   unstable_createMemoryUploadHandler()
  // );
  // const formData = await request.formData();
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const semanticHtml = formData.get("semantic-html")?.toString();
  const coverImage = formData.get("cover-image");
  const title = formData.get("title");

  console.log({ semanticHtml, coverImage, title });

  invariant(semanticHtml, "Please provide a semantic html to save :)");

  console.log(Object.entries(formData), "new foems");
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
