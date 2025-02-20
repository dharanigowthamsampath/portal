import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

// DELETE request to delete a snippet by ID
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract the `id` from the URL path

    if (!id) {
      return NextResponse.json(
        { error: "ID not found in the URL path" },
        { status: 400 }
      );
    }

    // Deleting the snippet by ID
    const deletedSnippet = await prisma.codeSnippet.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Snippet deleted successfully",
      deletedSnippet,
    });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 }
    );
  }
}
