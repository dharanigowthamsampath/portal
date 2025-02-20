"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
  views: number;
  isPublic: boolean;
  createdBy: string;
}

const AdminSnippetsTable = () => {
  const router = useRouter();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("/api/admin"); // Fetch all snippets for the admin
        if (response.ok) {
          const data = await response.json();
          setSnippets(data);
        }
      } catch (error) {
        console.error("Failed to fetch snippets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const handleViewSnippet = (id: string) => {
    router.push(`/snippet/${id}`); // Redirect to the snippet details page
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/snippets/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setSnippets(
          snippets.map((snippet) =>
            snippet.id === id ? { ...snippet, isPublic: true } : snippet
          )
        );
      }
    } catch (error) {
      console.error("Failed to approve snippet:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/snippets/${id}`, {
        method: "DELETE", // Delete request for the snippet
      });
      if (response.ok) {
        setSnippets(snippets.filter((snippet) => snippet.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete snippet:", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/snippets/edit/${id}`); // Navigate to the edit page
  };

  if (loading) {
    return <div className="text-center py-4">Loading snippets...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Created</TableHead>
              {/* <TableHead>Created By</TableHead> */}
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-center">Approved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {snippets.map((snippet) => (
              <TableRow
                key={snippet.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleViewSnippet(snippet.id)}
              >
                <TableCell className="font-medium">
                  {snippet.title
                    ? snippet.title.split(" ").slice(0, 15).join(" ") +
                      (snippet.title.split(" ").length > 15 ? "..." : "")
                    : "Untitled"}
                </TableCell>

                <TableCell>{snippet.language}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(snippet.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                {/* <TableCell>{snippet.createdBy}</TableCell> */}
                <TableCell className="text-right">{snippet.views}</TableCell>
                <TableCell className="text-center">
                  {snippet.isPublic ? (
                    <span className="text-green-500">Approved</span>
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSnippet(snippet.id);
                      }}
                    >
                      View
                    </Button>
                    {!snippet.isPublic && (
                      <Button
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(snippet.id);
                        }}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(snippet.id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(snippet.id);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {snippets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No code snippets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSnippetsTable;
