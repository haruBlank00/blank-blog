import { ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/lib/prisma";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const blogId = params.blogId;
  invariant(blogId, "Blog id is required");

  try {
    const blog = await db.blog.delete({
      where: {
        id: blogId,
      },
    });
    return redirect("/dashboard/blogs");
  } catch (e) {
    console.log({ e });
    // redirect("/dashboard/blogs");
  }
};
