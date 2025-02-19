// app/api/snippets/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const snippet = await prisma.codeSnippet.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json(snippet);
  } catch (error) {
    return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
  }
}
