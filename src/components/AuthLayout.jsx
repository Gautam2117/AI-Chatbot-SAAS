import { Link } from "react-router-dom";

/** Subtle chat bubble used decoratively */
function Bubble({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl px-4 py-2 shadow-sm backdrop-blur-md border border-white/10 " +
        "bg-white/10 text-white/90 text-sm " + className
      }
    >
      {children}
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090B10]">
      {/* glow orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-600/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl animate-pulse [animation-delay:400ms]" />

      {/* grid pattern */}
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* top brand */}
      <header className="relative z-10 flex items-center justify-center py-8">
        <Link to="/" className="group inline-flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 grid place-items-center text-white shadow-lg shadow-fuchsia-500/20">
            🤖
          </div>
          <span className="text-white/90 text-lg font-semibold tracking-wide">
            Botify
            <span className="text-white/50 ml-1 text-sm">AI</span>
          </span>
        </Link>
      </header>

      {/* center card */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-5">
          {/* left decorative chat column (hidden on small) */}
          <div className="hidden md:flex md:col-span-2 flex-col gap-4 pt-8">
            <Bubble className="self-start">Hi! Ready to build your AI assistant?</Bubble>
            <Bubble className="self-start">Sign in or create an account 🚀</Bubble>
            <Bubble className="self-start">We’ll be done in seconds.</Bubble>
          </div>

          {/* glass card */}
          <div className="md:col-span-3">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              {/* inner gradient hairline */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10" />
              <div className="relative p-8 md:p-10">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-sm text-white/60">{subtitle}</p>
                )}

                <div className="mt-8">{children}</div>
              </div>
            </div>

            {footer && (
              <p className="mt-6 text-center text-sm text-white/60">{footer}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
