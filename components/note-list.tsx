"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { NotebookTabsIcon } from "lucide-react";
import { Note } from "@prisma/client";

interface NotesListProps {
  userId: string;
}

export const NotesList: React.FC<NotesListProps> = ({ userId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const sidebar = useSidebar();

  const showFullMessage = sidebar.open && !sidebar.isMobile;

  useEffect(() => {
    if (!userId) return;

    const fetchNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/notes?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Erro ao carregar as notas.");
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [userId]);

  if (loading)
    return <div className="text-sm text-gray-500">Carregando...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center">
        <NotebookTabsIcon size={20} />
        {showFullMessage && (
          <h3 className="text-xl font-semibold text-gray-800">Minhas Notas</h3>
        )}
      </div>
      <ScrollArea className="max-h-[300px] mt-4">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500">
            Você não tem notas ainda.
          </div>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id}>
                <Button
                  variant="link"
                  className="text-left !justify-start w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:no-underline"
                  onClick={() =>
                    (window.location.href = `/dashboard/${note.id}`)
                  }
                >
                  {note.title}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};
