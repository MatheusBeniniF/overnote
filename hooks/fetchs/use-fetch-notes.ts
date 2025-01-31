import { Note } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const fetchNotes = async (userId: string): Promise<Note[]> => {
  if (!userId) throw new Error("User ID é obrigatório.");

  const response = await fetch(`/api/notes?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Erro ao carregar as notas.");
  }

  return response.json();
};

export const useFetchNotes = (userId: string) => {
  return useQuery({
    queryKey: ["notes", userId],
    queryFn: () => fetchNotes(userId),
    enabled: !!userId,
  });
};
