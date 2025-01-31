import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid"; // Gera URLs únicas se necessário

export async function POST(req: Request) {
  try {
    const { title, content, userId, visibility } = await req.json();

    // Validação básica
    if (!title || !userId) {
      return NextResponse.json(
        { error: "O título e o ID do usuário são obrigatórios." },
        { status: 400 }
      );
    }

    // Gera URL pública somente se a visibilidade for "public"
    const publicUrl = visibility === "public" ? `${nanoid(10)}` : null;

    const note = await prisma.note.create({
      data: {
        title,
        content: content || "",
        userId,
        visibility: visibility || "private",
        publicUrl,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar a nota:", error);
    return NextResponse.json(
      { error: "Erro ao criar a nota." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");
    if (id) {
      const note = await prisma.note.findUnique({
        where: { id },
      });

      if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }

      if (note.visibility === "private" && note.userId !== userId) {
        return NextResponse.json(
          { error: "Unauthorized access to this note" },
          { status: 403 }
        );
      }

      return NextResponse.json(note, { status: 200 });
    }

    if (userId) {
      const notes = await prisma.note.findMany({
        where: {
          userId,
        },
      });

      return NextResponse.json(notes, { status: 200 });
    } else {
      const publicNotes = await prisma.note.findMany({
        where: {
          visibility: "public",
        },
      });

      return NextResponse.json(publicNotes, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Obtenha os parâmetros `userId` e `id` da query string
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    // Verifique se o `userId` e o `id` foram fornecidos
    if (!userId || !id) {
      return NextResponse.json(
        { error: "User ID and Note ID are required" },
        { status: 400 }
      );
    }

    // Tente encontrar a nota com o `id` fornecido e validar se pertence ao usuário correto
    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    // Se a nota não existir ou não pertencer ao usuário, retorne erro
    if (!note || note.userId !== userId) {
      return NextResponse.json(
        {
          error: "Note not found or user doesn't have permission to delete it",
        },
        { status: 403 }
      );
    }

    // Excluir a nota se for válida
    const deletedNote = await prisma.note.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedNote, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, title, content, visibility, userId } = await req.json();

    if (!userId || !id) {
      return NextResponse.json(
        { error: "User ID and Note ID are required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.visibility === "private" && note.userId !== userId) {
      return NextResponse.json(
        { error: "User doesn't have permission to update this note" },
        { status: 403 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (note.visibility === "public" || note.userId === userId) {
      const updatedNote = await prisma.note.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          visibility,
        },
      });

      return NextResponse.json(updatedNote, { status: 200 });
    }

    return NextResponse.json(
      { error: "You can only update public notes or your own private notes" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}
