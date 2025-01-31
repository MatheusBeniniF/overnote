import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CreateNoteParams {
  userId: string;
  title: string;
}

const createNoteRequest = async ({ userId, title }: CreateNoteParams) => {
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

  if (!response.ok) {
    throw new Error("Erro ao criar a nota.");
  }

  return response.json();
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNoteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar a nota.");
    },
  });
};
