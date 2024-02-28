import { Form, useNavigation, useSubmit } from "@remix-run/react";
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
  title,
  coverImageUrl,
}: {
  semanticHtml: string;
  buttonLabel: string;
  title: string;
  coverImageUrl: string;
}) => {
  const editorEl = useRef<HTMLDivElement>();
  const editor = useEditor(editorEl);
  const submit = useSubmit();
  const [coverImage, setCoverImage] = useState<File>();
  const inputFieldRef = useRef<Ref<HTMLInputElement>>(null);
  const navigation = useNavigation();

  if (editor?.root?.innerHTML) {
    editor.root.innerHTML = semanticHtml;
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("semantic-html", editor?.getSemanticHTML() || "");
    formData.append("cover-image", coverImage || "");
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const imgSrc = coverImage
    ? URL.createObjectURL(coverImage)
    : coverImageUrl
    ? coverImageUrl
    : null;
  return (
    <>
      <Form
        onSubmit={submitHandler}
        className="my-4"
        encType="multipart/form-data"
      >
        <Input
          type="file"
          placeholder="Add a cover image"
          id="cover-image"
          name="cover-image"
          className="hidden"
          ref={inputFieldRef}
          required
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCoverImage(file);
            }
          }}
        />
        {imgSrc ? (
          <div className="flex items-center gap-4">
            <figure className="w-28">
              <img
                src={imgSrc}
                alt="Cover image of your blog :)"
                className="block h-full w-full object-cover "
              />
            </figure>
            <div>
              <Button
                variant={"outline"}
                type="button"
                onClick={() => {
                  if (inputFieldRef.current) {
                    console.log("wt");
                    inputFieldRef.current?.click();
                  }
                }}
              >
                Change
              </Button>
              <Button type="button" variant={"ghost"} className="text-red-700">
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <label
              htmlFor="cover-image"
              className="my-4 border-2 border-gray-600 px-4 py-2 font-semibold"
            >
              Add a cover image
            </label>
          </>
        )}

        <Input
          defaultValue={title}
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

        <Button
          type="submit"
          disabled={["loading", "submitting"].includes(navigation.state)}
        >
          {buttonLabel}
        </Button>
      </Form>
    </>
  );
};
