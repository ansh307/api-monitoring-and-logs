"use client";

import { useTransition } from "react";
import { toast } from "sonner"; // or any toast lib
import { Button } from "@/components/ui/button";

export function TriggerMonitorButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await fetch("/api/monitor/trigger", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        toast.success(data.message || "Job triggered!");
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="bg-blue-600 text-white hover:bg-blue-700"
    >
      {isPending ? "Triggering..." : "Trigger Monitor Now"}
    </Button>
  );
}
