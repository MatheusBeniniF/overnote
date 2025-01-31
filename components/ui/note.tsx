"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce } from "lodash";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import { Note } from "@prisma/client";
import { Toolbar } from "../toolbar";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { SkeletonNote } from "../skeletons";
import { CreateNoteModal } from "../create-note-modal";
import { Button } from "./button";
import { LockIcon, ShareIcon, Trash2Icon, UnlockIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

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
        const position = selection.$from.pos;
        setShowToolbar(true);
        setToolbarPosition({
          top:
            (editorContainerRef.current as unknown as HTMLElement)?.offsetTop +
            position -
            20,
          left:
            (editorContainerRef.current as unknown as HTMLElement)?.offsetLeft +
            position,
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

  const handleEditorChange = useCallback(() => {
    if (editor) {
      const updatedContent = editor.getHTML();
      saveNote(updatedContent);
    }
  }, [editor, saveNote]);

  const handleVisibilityChange = async (value: string) => {
    try {
      const response = await fetch(`/api/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visibility: value,
          userId,
          id: note?.id,
          title: note?.title,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNote(updatedNote);
        toast.success("Visibilidade atualizada com sucesso!");
      } else {
        console.error("Erro ao atualizar a visibilidade da nota.");
        toast.error("Erro ao atualizar a visibilidade da nota.");
      }
    } catch (error) {
      console.error("Erro ao atualizar a visibilidade da nota:", error);
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
  }, [editor, handleEditorChange]);

  useOnClickOutside(toolbarRef, () => setShowToolbar(false));

  if (loading) {
    return <SkeletonNote />;
  }
  if (error) return <div>{error}</div>;
  if (!loading && !note) return <div>Nota não encontrada.</div>;

  return (
    <div className="p-2 h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold mb-4">{note?.title}</h1>
        <div className="flex gap-2">
          <CreateNoteModal userId={userId} />
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                disabled={note?.visibility === "private"}
              >
                <ShareIcon />
                Compartilhar
              </Button>
            </TooltipTrigger>
            {note?.visibility === "private" && (
              <TooltipContent>
                <p>
                  Para compartilhar a anotação, altere a visibilidade para
                  publica.
                </p>
              </TooltipContent>
            )}
          </Tooltip>
          <div className="flex items-center">
            <Switch
              checked={note?.visibility === "public"}
              onCheckedChange={(checked: boolean) =>
                handleVisibilityChange(checked ? "public" : "private")
              }
            >
              <span className="flex items-center justify-between gap-2">
                {note?.visibility === "public" ? (
                  <>
                    <UnlockIcon className="text-green-500" />
                    <p>Público</p>
                  </>
                ) : (
                  <>
                    <LockIcon className="text-gray-500" />
                    <p>Privado</p>
                  </>
                )}
              </span>
            </Switch>
          </div>
          <Button variant="destructive">
            <Trash2Icon />
            Deletar
          </Button>
        </div>
      </div>

      {showToolbar && (
        <Toolbar
          ref={toolbarRef}
          toolbarPosition={toolbarPosition}
          editor={editor}
          closeToolbar={() => setShowToolbar(false)}
        />
      )}

      <div ref={editorContainerRef} className="h-full editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NoteDetails;
