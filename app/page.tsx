import { headers } from "next/headers";

const API_BASE = "https://api.bucketlist.sa/api/guide-stores/public";

interface GuideStoreResponse {
  success: boolean;
  data: {
    guide: { fullName: string; storeSlug: string };
    store: {
      storeName: string;
      primaryColor?: string;
      aboutText?: string;
    };
  };
}

interface Tour {
  id: string;
  title: string;
  price: number;
  currency: string;
  maxGuests: number;
  duration: number;
}

interface ToursResponse {
  success: boolean;
  data: { tours: Tour[] };
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

async function fetchTours(slug: string): Promise<Tour[]> {
  try {
    const res = await fetch(`${API_BASE}/${slug}/tours`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json: ToursResponse = await res.json();
    if (!json.success || !json.data?.tours) return [];
    return json.data.tours;
  } catch {
    return [];
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black px-6 py-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {storeName}
        </h1>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero / About */}
        <section className="mb-16">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Meet your guide
          </p>
          <h2 className="mt-2 text-3xl font-bold text-black md:text-4xl">
            {guideName}
          </h2>
          {aboutText && (
            <div className="mt-6 max-w-2xl">
              <p className="whitespace-pre-line text-lg leading-relaxed text-gray-600">
                {aboutText}
              </p>
            </div>
          )}
        </section>

        {/* Tours */}
        <section>
          <h3 className="mb-6 text-xl font-semibold text-black">
            Book a Tour
          </h3>
          {tours.length === 0 ? (
            <p className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
              No tours available yet. Check back soon!
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <h4 className="font-bold text-black">{tour.title}</h4>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    <li>{tour.duration} hours</li>
                    <li>Up to {tour.maxGuests} guests</li>
                    <li>
                      {tour.price} {tour.currency}
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
