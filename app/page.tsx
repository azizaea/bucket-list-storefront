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
  const params = await searchParams;
  const slug = params.slug;

  if (!slug) {
    return <StoreNotFound />;
  }

  const data = await fetchGuideStore(slug);

  if (!data) {
    return <StoreNotFound />;
  }

  const { guide, store } = data;
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

        {/* Book a Tour placeholder */}
        <section className="rounded-2xl border border-gray-200 bg-white p-8 md:p-12">
          <h3 className="text-xl font-semibold text-black">
            Book a Tour
          </h3>
          <p className="mt-2 text-gray-600">
            Tours and experiences coming soon. Check back later!
          </p>
        </section>
      </main>
    </div>
  );
}
