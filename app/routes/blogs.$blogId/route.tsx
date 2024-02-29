import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Image } from "~/components/ui/image";
import { Separator } from "~/components/ui/separator";
import { formatDate } from "~/lib/format";
import { db } from "~/lib/prisma";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const blogId = params.blogId;
  invariant(blogId, "Blog id is missing.");

  const blog = await db.blog.findFirst({
    where: {
      id: blogId,
    },
  });
  return { blog };
};

export default function Blog() {
  const { blog } = useLoaderData<typeof loader>();

  invariant(blog, "Internal sever error");

  const { coverImageUrl, createdAt, id, semanticHtml, title } = blog;
  return (
    <div className="">
      <h1 className="capitalize text-center">{title}</h1>
      <p className="text-center ">{formatDate(createdAt)}</p>

      <Image className="w-full h-auto" src={coverImageUrl} alt={title} />
      <Separator className="my-2" />
      <div dangerouslySetInnerHTML={{ __html: semanticHtml }} />
    </div>
  );
}
