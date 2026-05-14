"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RegistrationButtonProps {
  eventId: string;
  isOpen: boolean;
}

export default function RegistrationButton({ eventId, isOpen }: RegistrationButtonProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  async function handleRegister() {
    setStatus("saving");

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });

      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Button onClick={handleRegister} disabled={!isOpen || status === "saving"}>
      {!isOpen && "Registration closed"}
      {isOpen && status === "idle" && "Register now"}
      {status === "saving" && "Registering..."}
      {status === "success" && "Registered"}
      {status === "error" && "Try again"}
    </Button>
  );
}
