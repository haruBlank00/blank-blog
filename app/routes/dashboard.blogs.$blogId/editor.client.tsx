import { Form, useSubmit } from "@remix-run/react";
import Quill from "quill";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import useEditor from "~/lib/hooks/useEditor";

export let editor: Quill;
export const Editor = () => {
  const editorEl = useRef();
  const editor = useEditor(editorEl);
  const submit = useSubmit();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("semantic-html", editor?.getSemanticHTML() || "");
    submit(formData, { method: "post" });
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <div
          ref={editorEl}
          id="editor"
          style={{
            height: 350,
            width: "100%",
          }}
        ></div>

        <Button type="submit">Create</Button>
      </Form>
    </>
  );
};
