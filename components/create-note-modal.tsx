"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateNote } from "@/hooks/fetchs/use-create-note";
import { DialogClose } from "@radix-ui/react-dialog";

interface NoteCreateModalProps {
  userId: string;
}

export function CreateNoteModal({ userId }: NoteCreateModalProps) {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { mutate: createNote } = useCreateNote();

  const handleCreateNote = () => {
    createNote(
      { userId, title },
      {
        onSuccess: (data) => {
          router.push(`/dashboard/${data.id}`);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Erro desconhecido."
          );
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          <p className="hidden md:block">Criar nota</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Criar Nova Nota</DialogTitle>
        <DialogDescription>
          Insira um título para sua nova nota.
        </DialogDescription>

        <Input
          placeholder="Digite o título da nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleCreateNote}>Criar Nota</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
