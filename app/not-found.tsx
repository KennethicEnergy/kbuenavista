import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm uppercase tracking-section text-brand">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-text-primary">
        Page not found
      </h1>
      <p className="mt-3 text-text-muted">That route does not exist in this portfolio.</p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        ← Back home
      </Link>
    </div>
  );
}
