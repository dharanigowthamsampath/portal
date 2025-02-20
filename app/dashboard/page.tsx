"use client";

// pages/dashboard.tsx or app/dashboard.tsx
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AdminSnippetsTable from "@/components/admin-snippets-table"; // Import your table
import LoginCard from "@/components/login-card";

const Dashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isAuthenticated = Cookies.get("authenticated") === "true";
    if (isAuthenticated) {
      setAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  return (
    <div className="p-4">
      {!authenticated ? (
        <LoginCard onSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <AdminSnippetsTable />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
