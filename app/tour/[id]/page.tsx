import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TourBookingWidget } from "@/components/TourBookingWidget";
import { TourItineraryClient } from "@/components/TourItineraryClient";
import { fetchTours } from "@/lib/api";

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-black"
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
      className="h-5 w-5 shrink-0 text-gray-600"
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

  const tours = await fetchTours(slug);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    notFound();
  }

  const itineraryDays = tour.itineraryDays ?? [];
  const includes = tour.includes ?? [];
  const excludes = tour.excludes ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <Link
          href={slug ? `/?slug=${slug}` : "/"}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to store
        </Link>
      </div>

      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-gray-300">
        {tour.coverImage ? (
          <img
            src={tour.coverImage}
            alt={tour.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-500">
            No image
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {tour.title}
          </h1>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left: 2/3 */}
          <div className="lg:col-span-2">
            {/* Anchor tabs */}
            <nav className="mb-8 flex gap-6 border-b border-gray-200">
              <a
                href="#overview"
                className="border-b-2 border-black pb-3 text-sm font-medium text-black"
              >
                Overview
              </a>
              <a
                href="#itinerary"
                className="border-b-2 border-transparent pb-3 text-sm font-medium text-gray-600 hover:text-black"
              >
                Itinerary
              </a>
              <a
                href="#includes"
                className="border-b-2 border-transparent pb-3 text-sm font-medium text-gray-600 hover:text-black"
              >
                Includes
              </a>
            </nav>

            {/* Overview */}
            <section id="overview" className="mb-12 scroll-mt-24">
              <h2 className="mb-4 text-xl font-bold text-black">Overview</h2>
              {tour.description ? (
                <p className="text-gray-600">{tour.description}</p>
              ) : (
                <p className="text-gray-600">
                  Discover this unique experience with your local guide.
                </p>
              )}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-black">{tour.duration} hours</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Max guests</p>
                  <p className="font-semibold text-black">{tour.maxGuests}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold text-black">
                    {tour.price} {tour.currency}
                  </p>
                </div>
              </div>
            </section>

            {/* Itinerary */}
            <section id="itinerary" className="mb-12 scroll-mt-24">
              <h2 className="mb-4 text-xl font-bold text-black">Itinerary</h2>
              {itineraryDays.length === 0 ? (
                <p className="text-gray-600">No itinerary details available.</p>
              ) : (
                <TourItineraryClient days={itineraryDays} />
              )}
            </section>

            {/* Includes / Excludes */}
            <section id="includes" className="scroll-mt-24">
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

          {/* Right: 1/3 - Sticky booking widget */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <TourBookingWidget
                title={tour.title}
                price={tour.price}
                currency={tour.currency}
                maxGuests={tour.maxGuests}
                slug={slug}
                tourId={tour.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
