"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DeleteLinkDialog({ id, clerkUserId }: { id: number | string; clerkUserId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

      async function handleDelete() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, clerk_user_id: clerkUserId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to delete link");
      }

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="destructive" onClick={() => setOpen(true)} size="sm">
        Delete
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Delete link
            </h3>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              Are you sure you want to delete this link? This action cannot be undone.
            </p>

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
