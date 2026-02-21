import { headers } from "next/headers";
import Link from "next/link";
import { fetchTours } from "@/lib/api";

const API_BASE = "https://api.bucketlist.sa/api/guide-stores/public";

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

interface GuideStoreResponse {
  success: boolean;
  data: {
    guide: {
      fullName: string;
      storeSlug: string;
      profilePictureUrl?: string | null;
      location?: string | null;
      rating?: number | null;
      bio?: string | null;
      languages?: string[];
      specialties?: string[];
    };
    store: {
      storeName: string;
      logoUrl?: string | null;
      primaryColor?: string;
      heroImageUrl?: string | null;
      aboutText?: string;
    };
  };
}

/** Split comma-separated values into individual tags (e.g. "Arabic, English" → ["Arabic", "English"]) */
function splitTags(items: string[]): string[] {
  return items
    .flatMap((s) => s.split(",").map((t) => t.trim()))
    .filter(Boolean);
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

async function fetchGuideStore(
  slug: string
): Promise<GuideStoreResponse["data"] | null> {
  try {
    const res = await fetch(`${API_BASE}/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json: GuideStoreResponse = await res.json();
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

function StoreNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Store not found
        </h2>
        <p className="mt-2 text-gray-600">
          The guide store you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          Try visiting with a valid slug, e.g. ?slug=ahmed
        </p>
      </div>
    </div>
  );
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const headersList = await headers();
  const params = await searchParams;
  const slug = headersList.get("x-slug") || params.slug;

  if (!slug) {
    return <StoreNotFound />;
  }

  const data = await fetchGuideStore(slug);

  if (!data) {
    return <StoreNotFound />;
  }

  const [storeData, tours] = await Promise.all([
    Promise.resolve(data),
    fetchTours(slug),
  ]);

  const { guide, store } = storeData;
  const storeName = store.storeName || "Guide Store";
  const aboutText = store.aboutText || "";
  const guideName = guide.fullName || "Your Guide";
  const heroBg = store.heroImageUrl
    ? `url(${store.heroImageUrl})`
    : store.primaryColor || "#1f2937";

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={storeName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
              {getInitials(storeName)}
            </div>
          )}
          <h1 className="text-lg font-bold text-black md:text-xl">{storeName}</h1>
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="#tours"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            Tours
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            About
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-20"
        style={
          store.heroImageUrl
            ? {
                backgroundImage: `url(${store.heroImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { backgroundColor: heroBg }
        }
      >
        {store.heroImageUrl && (
          <div
            className="absolute inset-0 bg-black/60"
            aria-hidden
          />
        )}
        <div className="relative z-10 max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            {storeName}
          </h2>
          {aboutText && (
            <p className="mt-4 text-lg text-white/95 drop-shadow md:text-xl">
              {aboutText}
            </p>
          )}
          <a
            href="#tours"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-black transition-colors hover:bg-gray-100"
          >
            Explore Tours
          </a>
        </div>
      </section>

      <main>
        {/* Tours Section */}
        <section id="tours" className="scroll-mt-20 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-8 text-2xl font-bold text-black">Tours</h3>
            {tours.length === 0 ? (
              <p className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
                No tours available yet. Check back soon!
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour) => (
                  <Link
                    key={tour.id}
                    href={`/tour/${tour.id}?slug=${slug}`}
                    className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                      {tour.coverImage ? (
                        <img
                          src={tour.coverImage}
                          alt={tour.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-black">{tour.title}</h4>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {tour.duration} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <PeopleIcon className="h-4 w-4" />
                          Up to {tour.maxGuests} guests
                        </span>
                      </div>
                      <p className="mt-4 text-lg font-bold text-black">
                        From {tour.price} {tour.currency}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Meet Your Guide - only show if bio, languages, or specialties has data */}
        {(guide.bio || (guide.languages?.length ?? 0) > 0 || (guide.specialties?.length ?? 0) > 0) && (
          <section id="about" className="scroll-mt-20 border-t border-gray-200 bg-gray-50 px-6 py-16">
            <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row md:items-start">
              <div className="shrink-0 md:w-1/3">
                {guide.profilePictureUrl ? (
                  <img
                    src={guide.profilePictureUrl}
                    alt={guideName}
                    className="mx-auto h-48 w-48 rounded-full object-cover md:mx-0"
                  />
                ) : (
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-gray-300 text-4xl font-semibold text-gray-600 md:mx-0">
                    {getInitials(guide.fullName || "G")}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 md:w-2/3">
                <h3 className="text-2xl font-bold text-black">{guideName}</h3>
                {guide.location && (
                  <p className="mt-2 flex items-center gap-1.5 text-gray-600">
                    <PinIcon className="h-4 w-4 shrink-0" />
                    {guide.location}
                  </p>
                )}
                {guide.bio && (
                  <p className="mt-4 text-gray-600">{guide.bio}</p>
                )}
                {guide.languages && guide.languages.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Languages: </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {splitTags(guide.languages).map((lang) => (
                        <span
                          key={lang}
                          className="rounded-full border border-gray-300 bg-white px-3 py-0.5 text-sm text-gray-700"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {guide.specialties && guide.specialties.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Specialties: </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {splitTags(guide.specialties).map((spec) => (
                        <span
                          key={spec}
                          className="rounded-full border border-gray-300 bg-white px-3 py-0.5 text-sm text-gray-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold text-black">{storeName}</p>
            <p className="mt-1 text-sm text-gray-500">Powered by Bucket List</p>
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()} Bucket List. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
