import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import HomeRedirect from "./home-redirect";

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  if (isSignedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <HomeRedirect />
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
            LS
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              LinkShortener
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Short links, signed in securely.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isSignedIn ? (
            <>
              <SignInButton>
                <Button variant="ghost">Sign in</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Create account</Button>
              </SignUpButton>
            </>
          ) : (
            <UserButton />
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Clerk authentication ready
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Create your first account and unlock the app experience.
              </h1>
              <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                This landing page now includes clear sign-in and sign-up controls,
                and your signed-in session will surface a user menu automatically.
              </p>
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={24}
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
