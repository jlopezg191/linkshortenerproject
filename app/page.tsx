import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { BarChart3, Link2, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import HomeRedirect from "./home-redirect";

const features = [
  {
    icon: Link2,
    title: "Instant link shortening",
    description:
      "Turn long URLs into concise links that are ready to share in a single click.",
  },
  {
    icon: ShieldCheck,
    title: "Secure sign-in",
    description:
      "Protect your workspace with Clerk-powered authentication and a polished account experience.",
  },
  {
    icon: BarChart3,
    title: "Simple link insights",
    description:
      "Keep track of your links from a clean dashboard built for fast, focused management.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  if (isSignedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(244,244,245,0.9))] font-sans text-zinc-950 dark:bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.95),_rgba(9,9,11,0.98))] dark:text-zinc-50">
      <HomeRedirect />
      <header className="border-b border-zinc-200/80 px-6 py-4 backdrop-blur dark:border-zinc-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white shadow-sm dark:bg-zinc-50 dark:text-zinc-950">
              LS
            </div>
            <div>
              <p className="text-sm font-semibold">LinkShortener</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Short links, signed in securely.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSignedIn ? (
              <>
                <SignInButton forceRedirectUrl="/dashboard">
                  <Button variant="ghost">Sign in</Button>
                </SignInButton>
                <SignUpButton forceRedirectUrl="/dashboard">
                  <Button>Create account</Button>
                </SignUpButton>
              </>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
              <Sparkles className="h-4 w-4" />
              Built for fast, polished link sharing
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Turn long URLs into instantly shareable links.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                LinkShortener helps creators, teams, and marketers publish cleaner links,
                manage them from a secure dashboard, and keep sharing simple.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SignUpButton forceRedirectUrl="/dashboard">
                <Button size="lg">Create your free account</Button>
              </SignUpButton>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline" size="lg">
                  Sign in to your dashboard
                </Button>
              </SignInButton>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "1-click", label: "shortening" },
                { value: "100%", label: "secure" },
                { value: "24/7", label: "available" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70"
                >
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-2xl dark:border-zinc-800">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-300">Your latest short link</p>
                  <p className="mt-1 text-lg font-semibold">ls.sh/launch</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                  Live
                </span>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl bg-zinc-900/80 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Destination</span>
                  <span className="text-zinc-200">acme.com/launch</span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Clicks</span>
                  <span className="text-zinc-200">1,284</span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Status</span>
                  <span className="text-emerald-300">Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Why teams use it
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to share links with confidence.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-950/70"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 px-6 py-6 text-center text-sm text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-400">
        Ready to make every link feel a little sharper?
      </footer>
    </div>
  );
}
