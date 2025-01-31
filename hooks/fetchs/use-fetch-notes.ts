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
    queryKey: ["notes", userId], // Use o ID do usuário para diferenciar consultas
    queryFn: () => fetchNotes(userId),
    enabled: !!userId, // Somente executa a consulta se houver um userId válido
  });
};
