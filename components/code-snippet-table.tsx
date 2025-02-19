"use client";

import React from "react";
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
import { useState, useEffect } from "react";

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
  views: number;
  isPublic: boolean;
}

const CodeSnippetsTable = () => {
  const router = useRouter();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("/api/snippets");
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
    router.push(`/snippet/${id}`);
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
              <TableHead className="text-right">Views</TableHead>
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
                  {snippet.title || "Untitled"}
                </TableCell>
                <TableCell>{snippet.language}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(snippet.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">{snippet.views}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewSnippet(snippet.id);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {snippets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
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

export default CodeSnippetsTable;
