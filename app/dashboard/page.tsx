import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUserLinks } from "@/data/links";
import CreateLinkModal from "@/components/CreateLinkModal";
import EditLinkModal from "@/components/EditLinkModal";
import DeleteLinkDialog from "@/components/DeleteLinkDialog";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userLinks = await getUserLinks(userId);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <header className="mb-8 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage your links from here.
          </p>
        </div>

            <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Back to home
          </Link>
          <CreateLinkModal clerkUserId={userId} />
          <UserButton />
        </div>
      </header>

      <main className="space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Your links
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                Saved short links
              </h2>
            </div>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {userLinks.length} total
            </span>
          </div>

          {userLinks.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              No links yet. Create your first short link to see it here.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {userLinks.map((link) => (
                <article
                  key={link.id}
                  className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Short code
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-base font-semibold text-zinc-950 dark:text-zinc-50">
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
                          {link.short_code}
                        </span>
                        <Link
                          href={`/${link.short_code}`}
                          className="text-sm text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200"
                        >
                          View link
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Destination
                      </p>
                      <p className="max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/80 p-4 text-sm dark:bg-zinc-950/80">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        Clicks
                      </p>
                      <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                        {link.clicks}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 p-4 text-sm dark:bg-zinc-950/80">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        Status
                      </p>
                      <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                        {link.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 p-4 text-sm dark:bg-zinc-950/80">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        Created
                      </p>
                      <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                        {(link.created_at ? new Date(String(link.created_at)) : new Date()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <EditLinkModal clerkUserId={userId} link={link} />
                    <DeleteLinkDialog id={link.id} clerkUserId={userId} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
