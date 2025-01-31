import NoteDetails from "@/components/note";
import { auth } from "@/lib/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Redirecionando para o login...</div>;
  }

  const userId = session.user.id;

  return <NoteDetails userId={userId} noteId={params.id} />;
}
