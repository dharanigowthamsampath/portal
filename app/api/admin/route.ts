import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch all snippets (for Admin)
export async function GET() {
  try {
    const snippets = await prisma.codeSnippet.findMany({
      orderBy: {
        createdAt: "desc",
      },
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

// Approve a snippet (set isPublic to true)
export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const snippet = await prisma.codeSnippet.update({
      where: { id },
      data: { isPublic: true }, // Mark the snippet as approved
    });

    return NextResponse.json(snippet);
  } catch (err) {
    console.error("Error approving snippet:", err);
    return NextResponse.json(
      { error: "Failed to approve snippet" },
      { status: 500 }
    );
  }
}

// // Delete a snippet
// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();

//     // Delete the snippet
//     await prisma.codeSnippet.delete({
//       where: { id },
//     });

//     return NextResponse.json({ message: "Snippet deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting snippet:", err);
//     return NextResponse.json(
//       { error: "Failed to delete snippet" },
//       { status: 500 }
//     );
//   }
// }
