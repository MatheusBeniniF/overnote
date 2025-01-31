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

interface NoteCreateModalProps {
  userId: string;
}

export function CreateNoteModal({ userId }: NoteCreateModalProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateNote = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title,
          content: "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/${data.id}`);

        toast.success("Nota criada com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao criar a nota.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro desconhecido."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Criar nota
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
          <Button variant="outline" onClick={() => setTitle("")}>
            Cancelar
          </Button>
          <Button onClick={handleCreateNote} disabled={loading}>
            {loading ? "Criando..." : "Criar Nota"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
