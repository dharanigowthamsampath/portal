"use client";
import React from "react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CodeSnippet {
  title: string;
  code: string;
  language: string;
  isPublic: boolean;
  expiresAt: Date | null;
}

const CodeSharingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CodeSnippet>({
    title: "",
    code: "",
    language: "plain",
    isPublic: true,
    expiresAt: null,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "Code content is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create snippet");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Code snippet created successfully!",
      });
      router.push(`/snippet/${data.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create code snippet. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to save snippet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CodeSnippet,
    value: string | boolean | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Share Code Snippet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Title (optional)"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Textarea
              placeholder="Paste your code here..."
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              className="min-h-[200px] font-mono"
              required
            />
          </div>

          <div className="flex gap-4">
            <Select
              value={formData.language}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plain">Plain Text</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>

                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
            {/* 
            <Button
              type="button"
              variant={formData.isPublic ? "default" : "outline"}
              onClick={() => handleInputChange("isPublic", !formData.isPublic)}
            >
              {formData.isPublic ? "Public" : "Private"}
            </Button> */}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Snippet..." : "Share Code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CodeSharingForm;
