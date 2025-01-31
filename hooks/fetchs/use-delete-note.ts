import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface DeleteNoteParams {
    userId: string;
    noteId: string;
}

const deleteNoteRequest = async ({ userId, noteId }: DeleteNoteParams) => {
    const response = await fetch(`/api/notes?id=${noteId}&userId=${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao deletar a nota.");
    }

    return response.json();
}

export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteNoteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Nota deletada com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao deletar a nota.");
        },
    });
}