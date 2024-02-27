import { Form, useSubmit } from "@remix-run/react";
import Quill from "quill";
import { Ref, useRef, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useEditor from "~/lib/hooks/useEditor";

export let editor: Quill;
export const Editor = ({
  semanticHtml,
  buttonLabel,
}: {
  semanticHtml: string;
  buttonLabel: string;
}) => {
  const editorEl = useRef<HTMLDivElement>();
  const editor = useEditor(editorEl);
  const submit = useSubmit();
  const [coverImage, setCoverImage] = useState<File>();
  const inputField = useRef<Ref<HTMLInputElement>>();

  if (editor?.root?.innerHTML) {
    editor.root.innerHTML = semanticHtml;
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("semantic-html", editor?.getSemanticHTML() || "");
    formData.append("cover-image", coverImage || "");
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  return (
    <>
      <Form
        onSubmit={submitHandler}
        className="my-4"
        encType="multipart/form-data"
      >
        {Boolean(coverImage) ? (
          <div className="flex items-center gap-4">
            <figure className="w-28">
              <img
                src={coverImage && URL.createObjectURL(coverImage)}
                alt="Cover image of your blog :)"
                className="block h-full w-full object-cover "
              />
            </figure>
            <div>
              <Button variant={"outline"} onClick={() => inputField}>
                Change
              </Button>
              <Button variant={"ghost"} className="text-red-700">
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Input
              type="file"
              placeholder="Add a cover image"
              id="cover-image"
              name="cover-image"
              className="hidden"
              ref={inputField}
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCoverImage(file);
                }
              }}
            />
            <label
              htmlFor="cover-image"
              className="my-4 border-2 border-gray-600 px-4 py-2 font-semibold"
            >
              Add a cover image
            </label>
          </>
        )}

        <Input
          required
          name="title"
          placeholder="New post title here..."
          className="outline-none border-none text-4xl pl-0 py-4 my-2 focus-visible:ring-0 focus-visible:border-none"
        />
        <div
          ref={editorEl}
          id="editor"
          style={{
            height: 350,
            width: "100%",
          }}
        ></div>

        <Button type="submit">{buttonLabel}</Button>
      </Form>
    </>
  );
};
