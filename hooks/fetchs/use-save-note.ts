import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SaveNoteParams {
  userId: string;
  noteId: string;
  content: string;
  title: string;
}

const saveNoteRequest = async ({ userId, noteId, content, title }: SaveNoteParams) => {
  const response = await fetch(`/api/notes`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      id: noteId,
      content,
      title,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar a nota.");
  }

  return response.json();
};

export const useSaveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveNoteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {},
  });
};
