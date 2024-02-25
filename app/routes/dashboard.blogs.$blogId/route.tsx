import { ClientOnly } from "remix-utils/client-only";
import { Editor } from "~/components/editor.client";
export default function CreateEditBlog() {
  return (
    <div>
      <h2>Create blog</h2>
      <ClientOnly>{() => <Editor />}</ClientOnly>
    </div>
  );
}
