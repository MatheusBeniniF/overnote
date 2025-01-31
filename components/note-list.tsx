"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { NotebookTabsIcon } from "lucide-react";
import { Note } from "@prisma/client";
import { useFetchNotes } from "@/hooks/fetchs/use-fetch-notes";

interface NotesListProps {
  userId: string;
}

export const NotesList: React.FC<NotesListProps> = ({ userId }) => {
  const sidebar = useSidebar();
  const { data: notes, isLoading, error } = useFetchNotes(userId);

  const showFullMessage = sidebar.open && !sidebar.isMobile;

  if (isLoading)
    return <div className="text-sm text-gray-500">Carregando...</div>;
  if (error) return <div className="text-sm text-red-500">{error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center">
        <NotebookTabsIcon size={20} />
        {showFullMessage && (
          <h3 className="text-xl font-semibold text-gray-800">Minhas Notas</h3>
        )}
      </div>
      <ScrollArea className="max-h-[300px] mt-4">
        {!notes ? (
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
