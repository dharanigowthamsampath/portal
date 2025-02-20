import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, code, language, expiresAt } = await req.json();
    const snippet = await prisma.codeSnippet.create({
      data: {
        title,
        code,
        language,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isPublic: false,
      },
    });
    return NextResponse.json(snippet);
  } catch (err) {
    console.error("Error creating snippet:", err);
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}

export async function GET() {
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
  } catch (err) {
    console.error("Error fetching snippets:", err);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}
