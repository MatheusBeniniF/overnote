import { auth } from "@/lib/auth";
import { NoteCards } from "@/components/note-cards";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Redirecionando para o login...</div>;
  }

  const userId = session.user.id;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NoteCards userId={userId} />
    </div>
  );
}
