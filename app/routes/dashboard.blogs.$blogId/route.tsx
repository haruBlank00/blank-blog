import { ClientOnly } from "remix-utils/client-only";
import { Button } from "~/components/ui/button";
import { Editor } from "./editor.client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFormAction } from "@remix-run/react";
export default function CreateEditBlog() {
  return (
    <div>
      <h2>Create blog</h2>
      <ClientOnly>{() => <Editor />}</ClientOnly>
    </div>
  );
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const semanticHtml = formData.get("semantic-html");
  return null;
};
