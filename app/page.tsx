import CodeSnippetsTable from "@/components/code-snippet-table";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col gap-8 py-8">
      <CodeSnippetsTable />
    </div>
  );
}
