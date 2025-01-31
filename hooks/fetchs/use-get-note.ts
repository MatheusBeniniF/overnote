import { Note } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const fetchNoteById = async (userId: string, noteId: string): Promise<Note> => {
  if (!userId || !noteId) throw new Error("User ID e Note ID são obrigatórios.");

  const response = await fetch(`/api/notes?userId=${userId}&id=${noteId}`);

  if (!response.ok) {
    throw new Error("Erro ao carregar a nota.");
  }

  return response.json();
};

export const useGetNoteById = (userId: string, noteId: string) => {
  return useQuery({
    queryKey: ["note", userId, noteId],
    queryFn: () => fetchNoteById(userId, noteId),
    enabled: !!userId && !!noteId,
  });
};
