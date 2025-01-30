"use client";

import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce } from "lodash";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading, { Level } from "@tiptap/extension-heading";

import Underline from "@tiptap/extension-underline";
import { Note } from "@prisma/client";

interface NoteDetailsProps {
  userId: string;
  noteId: string;
}
const NoteDetails = ({ userId, noteId }: NoteDetailsProps) => {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const toolbarRef = useRef(null);
  const editorContainerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: note?.content ?? "",
    editable: true,
    onSelectionUpdate: ({ editor }) => {
      const selection = editor.state.selection;
      if (selection.empty) {
        setShowToolbar(false);
      } else {
        const { top, left } = selection.$from.pos;
        setShowToolbar(true);
        setToolbarPosition({
          top: editorContainerRef.current?.offsetTop + top,
          left: editorContainerRef.current?.offsetLeft + left,
        });
      }
    },
  });

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/notes?userId=${userId}&id=${noteId}`
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar a nota.");
        }

        const data = await response.json();
        setNote(data);
        if (editor) {
          editor.commands.setContent(data.content);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [userId, noteId, editor]);

  const saveNote = debounce(async (updatedContent) => {
    const response = await fetch(`/api/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: updatedContent,
        userId,
        id: note?.id,
      }),
    });

    if (response.ok) {
      console.log("Nota salva com sucesso!");
    } else {
      console.error("Erro ao salvar a nota.");
    }
  }, 1000);

  const handleEditorChange = () => {
    if (editor) {
      const updatedContent = editor.getHTML();
      saveNote(updatedContent);
    }
  };

  useEffect(() => {
    if (editor) {
      editor.on("update", handleEditorChange);
    }

    return () => {
      if (editor) {
        editor.off("update", handleEditorChange);
      }
    };
  }, [editor]);

  const handleSave = async () => {
    if (editor) {
      const updatedContent = editor.getHTML();
      const response = await fetch(`/api/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: updatedContent,
          userId,
          id: note?.id,
        }),
      });

      if (response.ok) {
        alert("Nota salva com sucesso!");
      } else {
        alert("Erro ao salvar a nota.");
      }
    }
  };

  const setHeading = (level: Level) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!note) return <div>Nota não encontrada.</div>;

  return (
    <div className="p-2">
      <h1 className="text-3xl font-semibold mb-4">{note.title}</h1>

      {/* Toolbar flutuante */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          style={{
            position: "absolute",
            top: toolbarPosition.top,
            left: toolbarPosition.left,
            transform: "translateY(-100%)",
          }}
          className="bg-white p-2 rounded shadow-md border border-gray-300"
        >
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            <strong>B</strong>
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            <em>I</em>
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            <u>U</u>
          </button>

          <button
            onClick={() => setHeading(1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            H1
          </button>

          <button
            onClick={() => setHeading(2)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            H2
          </button>

          <button
            onClick={() => setHeading(3)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            H3
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div ref={editorContainerRef} className="mb-6">
        <EditorContent editor={editor} />
      </div>

      {/* Botão de salvar */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default NoteDetails;
