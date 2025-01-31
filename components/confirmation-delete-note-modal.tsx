"use client";

import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteNote } from "@/hooks/fetchs/use-delete-note";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface NoteCreateModalProps {
  userId: string;
  note: Note;
}

export const ConfirmationDeleteNoteModal = ({
  note,
  userId,
}: NoteCreateModalProps) => {
  const { mutate: deleteNote } = useDeleteNote();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeleteNote = useCallback(() => {
    if (note) {
      deleteNote(
        { userId, noteId: note.id },
        {
          onSuccess: () => {
            if (isClient) {
              router.push("/dashboard");
            }
          },
        }
      );
    }
  }, [note, userId, deleteNote, router, isClient]);

  if (!isClient) {
    return null;
  }

  if (!note) {
    toast.error("Nota não encontrada.");
    router.push("/dashboard");
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon />
          Deletar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Deseja deletar a nota?</DialogTitle>

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleDeleteNote} variant="destructive">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
