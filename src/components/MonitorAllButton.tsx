"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const MonitorAllButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await fetch("/api/monitor/trigger-all", { method: "POST" });
      const data = await res.json();

      if (!res.ok) toast.error(data.error || "Something went wrong");
      else toast.success(data.message);
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {isPending ? "Monitoring..." : "Monitor All APIs"}
    </Button>
  );
};
