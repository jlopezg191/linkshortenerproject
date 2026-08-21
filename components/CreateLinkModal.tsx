"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateLinkModal({ clerkUserId }: { clerkUserId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!url) {
      setError("Please provide a destination URL.");
      return;
    }

    setLoading(true);
    try {
      console.log("[CreateLinkModal] clerkUserId:", clerkUserId);
      const res = await fetch("/api/links", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, short_code: shortCode || undefined, clerk_user_id: clerkUserId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to create link");
      }

      setOpen(false);
      setUrl("");
      setShortCode("");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)} size="sm">
        Create Link
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Create short link
            </h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300">
                  Destination URL
                </label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/path"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300">
                  Short code (optional)
                </label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  placeholder="custom-slug"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
