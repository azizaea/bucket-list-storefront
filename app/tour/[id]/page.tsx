import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BookingFormSection } from "@/components/BookingFormSection";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
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
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
      <main className="mx-auto max-w-6xl px-6 py-12">
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
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-3xl font-bold text-black">
                {tour.price} {tour.currency}
                <span className="text-base font-normal text-gray-600"> per person</span>
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {tour.duration} hours
                </span>
                <span className="flex items-center gap-1">
                  <PeopleIcon className="h-4 w-4" />
                  Up to {tour.maxGuests} guests
                </span>
              </div>
              <a
                href="#booking-form"
                className="mt-6 block w-full rounded-lg bg-black px-4 py-3 text-center font-medium text-white transition-colors hover:bg-gray-800"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>

        {/* Booking form — same 2-step form, inline */}
        <section id="booking-form" className="scroll-mt-24 mt-16">
          <BookingFormSection
            slug={slug}
            tourId={tour.id}
            maxGuests={tour.maxGuests}
          />
        </section>
      </main>

      <StoreFooter
        storeName={storeName}
        licenseNumber={guide.licenseNumber}
      />
    </div>
  );
}
