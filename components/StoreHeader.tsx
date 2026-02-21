import Link from "next/link";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface StoreHeaderProps {
  storeName: string;
  logoUrl?: string | null;
  slug: string;
}

export function StoreHeader({ storeName, logoUrl, slug }: StoreHeaderProps) {
  const homeHref = slug ? `/?slug=${slug}` : "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <Link href={homeHref} className="flex items-center gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={storeName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
            {getInitials(storeName)}
          </div>
        )}
        <h1 className="text-lg font-bold text-black md:text-xl">{storeName}</h1>
      </Link>
      <nav className="flex items-center gap-6">
        <a
          href={`${homeHref}#tours`}
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          Tours
        </a>
        <a
          href={`${homeHref}#about`}
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          About
        </a>
      </nav>
    </header>
  );
}
