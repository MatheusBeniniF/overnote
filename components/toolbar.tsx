import { Editor } from "@tiptap/core";
import { MutableRefObject } from "react";

interface ToolbarProps {
  editor: Editor | null;
  toolbarPosition: { top: number; left: number };
  ref: MutableRefObject<null>;
  closeToolbar: () => void;
}

export const Toolbar = ({
  editor,
  toolbarPosition,
  ref,
  closeToolbar,
}: ToolbarProps) => {
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: toolbarPosition.top,
        left: toolbarPosition.left,
        transform: "translateY(-100%)",
      }}
      className="bg-white p-2 rounded shadow-md border flex gap-0.5 border-gray-300"
    >
      <button
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
          closeToolbar();
        }}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        <strong>B</strong>
      </button>

      <button
        onClick={() => {
          editor?.chain().focus().toggleItalic().run();
          closeToolbar();
        }}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        <em>I</em>
      </button>

      <button
        onClick={() => {
          editor?.chain().focus().toggleUnderline().run();
          closeToolbar();
        }}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        <u>U</u>
      </button>
    </div>
  );
};
