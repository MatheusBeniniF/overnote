"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce } from "lodash";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import { Toolbar } from "./toolbar";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { SkeletonNote } from "./skeletons";
import { CreateNoteModal } from "./create-note-modal";
import { Button } from "./ui/button";
import { LockIcon, ShareIcon, UnlockIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useGetNoteById } from "@/hooks/fetchs/use-get-note";
import { useUpdateNoteVisibility } from "@/hooks/fetchs/use-update-visibility";
import { useSaveNote } from "@/hooks/fetchs/use-save-note";
import { ConfirmationDeleteNoteModal } from "./confirmation-delete-note-modal";
import { toast } from "react-toastify";

interface NoteDetailsProps {
  userId: string;
  noteId: string;
}
const NoteDetails = ({ userId, noteId }: NoteDetailsProps) => {
  const { data: note, isLoading, error } = useGetNoteById(userId, noteId);
  const { mutate: updateVisibility } = useUpdateNoteVisibility();
  const { mutate: saveNote } = useSaveNote();

  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [isCopying, setIsCopying] = useState(false);
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

  const handleEditorChange = useCallback(() => {
    if (editor) {
      const updatedContent = editor.getHTML();
      saveNote({
        userId,
        noteId: note?.id ?? "",
        content: updatedContent,
      });
    }
  }, [editor, note, userId, noteId, saveNote]);

  useEffect(() => {
    if (editor) {
      editor.on("update", debounce(handleEditorChange, 1000));
    }

    return () => {
      if (editor) {
        editor.off("update", handleEditorChange);
      }
    };
  }, [editor, handleEditorChange]);

  const handleVisibilityChange = (value: string) => {
    if (!note) return;

    updateVisibility({
      userId,
      noteId: note.id,
      visibility: value,
      title: note.title!,
    });
  };

  const generateShareUrl = () => {
    if (!note || (note && note.visibility === "private")) return "";

    // You should use the note ID to generate a shareable URL
    // This URL can be something like "/note/{noteId}" which will open the specific note
    return `${window.location.origin}/dashboard/${note.id}`;
  };

  const handleCopyLink = async () => {
    const shareUrl = generateShareUrl();

    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopying(true);
        setTimeout(() => {
          setIsCopying(false);
        }, 2000); // Reset the "copied" status after 2 seconds
      } catch (error) {
        toast.error("Erro ao copiar o link.");
      }
    }
  };

  useEffect(() => {
    if (note?.content && editor) {
      editor.commands.setContent(note.content);
    }
  }, [note, editor]);

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

  // Show a toast if the user is viewing as a guest
  useEffect(() => {
    if (note && userId !== note?.userId) {
      toast.info(
        <div className="text-red-500">
          <span role="img" aria-label="locked">
            🔒
          </span>{" "}
          Você está vendo como visitante, não será possível editar.
        </div>,
        {
          autoClose: 5000,
        }
      );
    }
  }, [userId, note?.userId]);

  useOnClickOutside(toolbarRef, () => setShowToolbar(false));

  if (isLoading) {
    return <SkeletonNote />;
  }
  if (error) return <div>{error.message}</div>;
  if (!note) {
    toast.error("Nota não encontrada.");
    return null;
  }

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
                onClick={handleCopyLink}
              >
                <ShareIcon />
                {isCopying ? "Link copiado!" : "Compartilhar"}
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
          <div className="flex items-center gap-2">
            <Switch
              checked={note?.visibility === "public"}
              onCheckedChange={(checked: boolean) =>
                handleVisibilityChange(checked ? "public" : "private")
              }
            />
            {note?.visibility === "public" ? (
              <div className="flex items-center gap-2">
                <UnlockIcon size={16} />
                <p>Público</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LockIcon size={16} />
                <p>Privado</p>
              </div>
            )}
          </div>
          <ConfirmationDeleteNoteModal note={note!} userId={userId} />
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
        <EditorContent
          editor={editor}
          className={`${
            userId !== note?.userId ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        />
      </div>
    </div>
  );
};

export default NoteDetails;
