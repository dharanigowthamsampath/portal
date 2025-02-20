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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");

    const snippets = await prisma.codeSnippet.findMany({
      where: {
        isPublic: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit, // Skip previous pages
      take: limit, // Limit the number of results per page
    });

    // Fetch total count of snippets for pagination controls
    const totalCount = await prisma.codeSnippet.count({
      where: {
        isPublic: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    return NextResponse.json({
      snippets,
      totalCount,
      totalPages: Math.ceil(totalCount / limit), // Calculate total pages
    });
  } catch (err) {
    console.error("Error fetching snippets:", err);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}
