// app/api/snippets/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, code, language, expiresAt, isPublic } = await req.json();
    const snippet = await prisma.codeSnippet.create({
      data: {
        title,
        code,
        language,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isPublic,
      },
    });
    return NextResponse.json(snippet);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const snippets = await prisma.codeSnippet.findMany({
      where: {
        isPublic: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
    return NextResponse.json(snippets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}
