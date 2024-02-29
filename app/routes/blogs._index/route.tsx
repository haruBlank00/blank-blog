import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatDate } from "~/lib/format";
import { db } from "~/lib/prisma";
import { Image } from "~/components/ui/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export const loader = async ({}: LoaderFunctionArgs) => {
  const blogs = await db.blog.findMany({
    take: 10,
  });

  return json({ blogs });
};

export default function Blogs() {
  const { blogs } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <div className="max-w-[25rem] mx-auto">
      <h1>Blank Blogs</h1>

      <div>
        <Avatar>
          <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
          <AvatarFallback>HB</AvatarFallback>
        </Avatar>
      </div>
      <div>
        {blogs.map((blog) => {
          const { id, title, coverImageUrl, createdAt } = blog;
          return (
            <Card
              key={id}
              className="cursor-pointer shadow-md hover:-translate-y-1 transition"
              onClick={() => navigate(`/blogs/${id}`)}
            >
              <CardHeader className="capitalize gap-4 flex-row items-center">
                <Image src={coverImageUrl} alt={title} />

                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{formatDate(createdAt)}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
