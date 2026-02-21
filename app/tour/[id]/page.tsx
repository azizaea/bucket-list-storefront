import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { TourBookingModal } from "@/components/TourBookingModal";
import { TourItineraryTimeline } from "@/components/TourItineraryTimeline";
import { fetchGuideStore, fetchTours } from "@/lib/api";

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default async function TourDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slug?: string }>;
}) {
  const headersList = await headers();
  const { id } = await params;
  const search = await searchParams;
  const slug = headersList.get("x-slug") || search.slug;

  if (!slug) {
    notFound();
  }

  const [storeData, tours] = await Promise.all([
    fetchGuideStore(slug),
    fetchTours(slug),
  ]);

  if (!storeData) {
    notFound();
  }

  const tour = tours.find((t) => t.id === id);
  if (!tour) {
    notFound();
  }

  const { guide, store } = storeData;
  const storeName = store.storeName || "Guide Store";
  const itineraryDays = tour.itineraryDays ?? [];
  const includes = tour.includes ?? [];
  const excludes = tour.excludes ?? [];

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader
        storeName={storeName}
        logoUrl={store.logoUrl}
        slug={slug}
      />

      {/* Hero — full-width cover 70vh, dark overlay, tour title centered */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-gray-300">
        {tour.coverImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${tour.coverImage})` }}
            />
            <div className="absolute inset-0 bg-black/60" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-400" />
        )}
        <div className="relative z-10 max-w-2xl px-6 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            {tour.title}
          </h1>
        </div>
      </section>

      {/* Content — two-column layout */}
      <main className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left: 2/3 */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-black">Description</h2>
              {tour.description ? (
                <p className="text-gray-600">{tour.description}</p>
              ) : (
                <p className="text-gray-600">
                  Discover this unique experience with your local guide.
                </p>
              )}
            </section>

            {/* Itinerary — timeline style */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-black">Itinerary</h2>
              {itineraryDays.length === 0 ? (
                <p className="text-gray-600">No itinerary details available.</p>
              ) : (
                <TourItineraryTimeline entries={itineraryDays} />
              )}
            </section>

            {/* Includes / Excludes */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-black">
                Includes & Excludes
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-medium text-black">Includes</h3>
                  <ul className="space-y-2">
                    {includes.length === 0 ? (
                      <li className="text-gray-500">—</li>
                    ) : (
                      includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckIcon />
                          {item}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 font-medium text-black">Excludes</h3>
                  <ul className="space-y-2">
                    {excludes.length === 0 ? (
                      <li className="text-gray-500">—</li>
                    ) : (
                      excludes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <XIcon />
                          {item}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Right: 1/3 — sticky booking card */}
          <div className="lg:col-span-1 lg:self-start">
            <TourBookingModal
              slug={slug}
              tourId={tour.id}
              price={tour.price}
              currency={tour.currency}
              duration={tour.duration}
              maxGuests={tour.maxGuests}
            />
          </div>
        </div>
      </main>

      <StoreFooter
        storeName={storeName}
        licenseNumber={guide.licenseNumber}
      />
    </div>
  );
}
