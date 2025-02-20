"use client";

// components/LoginCard.tsx
import { useState } from "react";

import Cookies from "js-cookie";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const LoginCard = ({ onSuccess }: { onSuccess: () => void }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const correctPasscode = "ProjectX@2025"; // Replace with your passcode logic
    if (passcode === correctPasscode) {
      // Set a cookie for 10 minutes (600 seconds)
      Cookies.set("authenticated", "true", { expires: 10 / 1440 }); // 10 minutes in days
      onSuccess();
    } else {
      setError("Invalid passcode. Please try again.");
    }
  };

  return (
    <Card className="max-w-sm mx-auto p-4">
      <CardHeader>
        <h2 className="text-lg font-medium">Enter Passcode</h2>
      </CardHeader>
      <CardContent>
        <Input
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
          className="w-full"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
