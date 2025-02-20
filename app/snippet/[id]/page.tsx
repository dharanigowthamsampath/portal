"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Copy, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
  views: number;
  isPublic: boolean;
}

interface PageParams {
  id: string;
}

export default function SnippetPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = use(params);
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false); // State for code copy status
  const [isLinkCopied, setIsLinkCopied] = useState(false); // State for URL copy status
  const { toast } = useToast();

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/snippets/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch snippet");
        }
        const data = await response.json();
        setSnippet(data);
      } catch (err) {
        setError("Failed to load snippet");
        console.error("Error fetching snippet:", err);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchSnippet();
    }
  }, [resolvedParams.id]);

  const handleCopyCode = async () => {
    if (snippet?.code) {
      try {
        await navigator.clipboard.writeText(snippet.code);
        setIsCopied(true); // Set the state to true when copied
        toast({
          title: "Copied to clipboard",
          description: "The code has been copied to your clipboard.",
        });

        // Reset the copied status after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy code to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = async () => {
    try {
      // Copy the current URL to the clipboard
      await navigator.clipboard.writeText(window.location.href);
      setIsLinkCopied(true); // Set the state to true when the URL is copied
      toast({
        title: "URL copied",
        description: "The snippet URL has been copied to your clipboard.",
      });

      // Reset the link copied status after 2 seconds
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (err) {
      console.error("Error copying link:", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !snippet) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <h2 className="text-xl font-semibold mb-2">Snippet not found</h2>
          <p className="text-muted-foreground">
            The requested snippet does not exist or has been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-5">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>{snippet.title || "Untitled Snippet"}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>
                Created{" "}
                {formatDistanceToNow(new Date(snippet.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <span>•</span>
              <span>{snippet.views} views</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{snippet.language}</Badge>
            <Badge variant={snippet.isPublic ? "default" : "secondary"}>
              {snippet.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
              <code className="text-sm font-mono whitespace-pre-wrap break-words">
                {snippet.code}
              </code>
            </pre>
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyCode}
                className="h-8"
              >
                <Copy className="h-4 w-4 mr-2" />
                {isCopied ? "Copied!" : "Copy"}{" "}
                {/* Dynamically change the text */}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="h-8"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isLinkCopied ? "URL Copied!" : "Share"}{" "}
                {/* Dynamically change the text */}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
