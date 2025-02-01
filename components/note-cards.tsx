"use client";
import { useFetchNotes } from "@/hooks/fetchs/use-fetch-notes";
import { SkeletonsNoteCard } from "./skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Note } from "@prisma/client";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDeleteNote } from "@/hooks/fetchs/use-delete-note";
import { useUpdateNoteVisibility } from "@/hooks/fetchs/use-update-visibility";
import { CreateNoteModal } from "./create-note-modal";

export const NoteCards = ({ userId }: { userId: string }) => {
  const { data: notes, isLoading, error } = useFetchNotes(userId);
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateVisibility } = useUpdateNoteVisibility({
    fromDashboard: true,
  });

  if (isLoading) return <SkeletonsNoteCard />;

  if (error) return <div>Falha ao carregar as notas: {error.message}</div>;

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Você ainda não possui notas.
        </h1>
        <CreateNoteModal userId={userId} />
      </div>
    );
  }

  const [privateNotes, publicNotes] = notes.reduce<[Note[], Note[]]>(
    (acc, note) => {
      if (note.visibility === "private") {
        acc[0].push(note);
      } else {
        acc[1].push(note);
      }
      return acc;
    },
    [[], []]
  );

  const handleDelete = (noteId: string) => deleteNote({ userId, noteId });

  const handleToggleVisibility = (note: Note) =>
    updateVisibility({
      userId,
      noteId: note.id,
      visibility: note.visibility === "private" ? "public" : "private",
      title: note.title!,
    });

  const renderNotes = (notes: Note[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <Link
          key={note.id}
          href={`/dashboard/${note.id}`}
          passHref
          className="block"
        >
          <Card className="rounded-xl bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out">
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 max-w-screen-sm truncate">
                {note.title}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-500 p-2 hover:bg-gray-200 rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-md rounded-md p-2">
                  <DropdownMenuItem
                    onClick={() => handleDelete(note.id)}
                    className="text-red-500 hover:bg-red-100 px-4 py-2 rounded-md"
                  >
                    Excluir
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleVisibility(note)}
                    className="text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md"
                  >
                    Tornar{" "}
                    {note.visibility === "private" ? "Pública" : "Privada"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold">
                Criada em: {new Date(note.createdAt).toLocaleString()}
              </p>
              <p className="text-sm font-bold">
                Atualizada em: {new Date(note.updatedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {publicNotes.length > 0 && (
        <div>
          <div className="flex items-center justify-between pr-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Notas Públicas
            </h2>
            <CreateNoteModal userId={userId} />
          </div>
          {renderNotes(publicNotes)}
        </div>
      )}
      {privateNotes.length > 0 && (
        <div>
          <div className="flex items-center justify-between pr-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Notas Privadas
            </h2>
            {publicNotes.length === 0 && <CreateNoteModal userId={userId} />}
          </div>
          {renderNotes(privateNotes)}
        </div>
      )}
    </div>
  );
};
