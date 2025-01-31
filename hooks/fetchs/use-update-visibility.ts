import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdateVisibilityParams {
  userId: string;
  noteId: string;
  visibility: string;
  title: string;
}

const updateNoteVisibility = async (params: UpdateVisibilityParams) => {
  const { userId, noteId, visibility, title } = params;
  
  const response = await fetch(`/api/notes`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      id: noteId,
      visibility,
      title,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar a visibilidade da nota.");
  }

  return response.json();
};

export const useUpdateNoteVisibility = ({ fromDashboard }: { fromDashboard?: boolean }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateNoteVisibility,
    onSuccess: (_data, variables) => {
      toast.success("Visibilidade atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: [fromDashboard ? "notes" : "note"] });

      router.push(fromDashboard ? "/dashboard" : `/dashboard/${variables.noteId}`);
    },
    onError: () => {
      toast.error("Erro ao atualizar a visibilidade da nota.");
    },
  });
};
