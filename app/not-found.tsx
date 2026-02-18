import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-300">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-800">
          Page not found
        </h2>
        <p className="mt-2 text-zinc-600">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
