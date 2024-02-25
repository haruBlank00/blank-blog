import Quill from "quill";
import { useEffect, useState } from "react";
import QuillMarkdown from "quilljs-markdown";

const defaultlOptions = {
  theme: "snow",
  placeholder: "Create a new post...",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ],
  },
};
const useEditor = (el: any, options?: any) => {
  const [editor, setEditor] = useState<Quill>();
  useEffect(() => {
    const editorId = `#${el?.current?.id}`;
    const editor = new Quill(editorId, options || defaultlOptions);
    setEditor(editor);
    const markdownOptions = {
      /**
           ignoreTags: [ 'pre', 'strikethrough'], // @option - if you need to ignore some tags.
           tags: { // @option if you need to change for trigger pattern for some tags.
            blockquote: {
              pattern: /^(\|){1,6}\s/g,
            },
            bold: {
              pattern:  /^(\|){1,6}\s/g,
            },
            italic: {
              pattern: /(\_){1}(.+?)(?:\1){1}/g,
            },
          },
          */
    };
    const quillMarkdown = new QuillMarkdown(editor, markdownOptions);
  }, [el]);

  return editor;
};

export default useEditor;
