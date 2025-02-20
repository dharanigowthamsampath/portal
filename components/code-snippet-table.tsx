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
}

const CodeSnippetsTable = () => {
  const router = useRouter();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/snippets?page=${currentPage}&limit=13`
        );
        if (response.ok) {
          const data = await response.json();
          setSnippets(data.snippets);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch snippets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [currentPage]);

  const handleViewSnippet = (id: string) => {
    router.push(`/snippet/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPaginationLoading(true); // Show loader when pagination changes
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setPaginationLoading(false); // Hide loader when new data is loaded
    }
  }, [snippets]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        {/* Loader for data loading */}
        <div className="animate-spin rounded-full border-4 border-t-transparent border-gray-600 w-8 h-8"></div>
      </div>
    );
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-4 items-center">
        <Button
          variant="default"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {/* Centered pagination text */}
        <span className="text-center">
          Page {currentPage} of {totalPages}
        </span>

        {paginationLoading ? (
          <div className="animate-spin rounded-full border-4 border-t-transparent border-gray-600 w-6 h-6"></div>
        ) : (
          <Button
            variant="default"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default CodeSnippetsTable;
