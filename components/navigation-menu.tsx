"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Code2, Table2, Settings, Github } from "lucide-react";

const NavigationMenu = () => {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Code2 className="h-6 w-6" />
          <span className="text-xl font-bold">CodeShare</span>
        </Link>

        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              className="flex items-center space-x-2"
            >
              <Table2 className="h-4 w-4" />
              <span>Submissions</span>
            </Button>
          </Link>
          <Link href="/submit">
            <Button
              variant={pathname === "/submit" ? "default" : "ghost"}
              className="flex items-center space-x-2"
            >
              <Code2 className="h-4 w-4" />
              <span>Share Code</span>
            </Button>
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
