import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
import { useEffect } from "react";

export const Editor = () => {
  useEffect(() => {
    const editor = new Quill("#editor", {
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
    });
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
  }, []);
  return (
    <>
      <div id="toolbar"></div>
      <div
        id="editor"
        style={{
          height: 350,
          width: "100%",
        }}
      ></div>
    </>
  );
};
