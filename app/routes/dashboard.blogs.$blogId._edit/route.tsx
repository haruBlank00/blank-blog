import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
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
  const method = request.method;
  const blogId = params.blogId;

  const formData = await request.formData();
  const semanticHtml = formData.get("semantic-html")?.toString();
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
