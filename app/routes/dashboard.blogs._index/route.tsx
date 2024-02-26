import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { db } from "~/lib/prisma";
import { columns } from "./table/columns";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useToast } from "~/components/ui/use-toast";
import { useEffect } from "react";

export const loader = async () => {
  const blogs = await db.blog.findMany({});
  return { blogs };
};

export default function Blogs() {
  const navigate = useNavigate();
  const { blogs } = useLoaderData<typeof loader>();
  // const actionData = useActionData<typeof action>();
  // const { toast } = useToast();

  // useEffect(() => {
  //   if (actionData) {
  //     const { success, blogId = "N/A" } = actionData;
  //     if (success) {
  //       toast({
  //         variant: "destructive",
  //         title: "Blog deleted successfully",
  //         description: "Successfully deleted blog with id " + blogId,
  //       });
  //       return;
  //     }

  //     toast({
  //       title: "Unable to deleted blog",
  //       description:
  //         "Couldn't  deleted blog with id " + actionData?.blogId || "N/A",
  //     });
  //   }
  // }, [actionData]);

  return (
    <div>
      <h2>Manage your blogs</h2>

      <Button onClick={() => navigate("new")}>
        <Plus className="h-4 w-4" />
        Create
      </Button>

      <DataTable data={blogs} columns={columns} />
    </div>
  );
}
