import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { fetchGuideStore, fetchTours } from "@/lib/api";

/** Split comma-separated values into individual tags */
function splitTags(items: string[]): string[] {
  return items
    .flatMap((s) => s.split(",").map((t) => t.trim()))
    .filter(Boolean);
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
      </div>
    </div>
  );
}

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const headersList = await headers();
  const params = await searchParams;
  const slug = headersList.get("x-slug") || params.slug;

  if (!slug) {
    notFound();
  }

  const data = await fetchGuideStore(slug);
  if (!data) {
    notFound();
  }

  const [storeData, tours] = await Promise.all([
    Promise.resolve(data),
    fetchTours(slug),
  ]);

  const { guide, store } = storeData;
  const storeName = store.storeName || "Guide Store";
  const guideName = guide.fullName || "Your Guide";
  const bio = guide.bio || "";
  const languages = splitTags(guide.languages ?? []);
  const specialties = splitTags(guide.specialties ?? []);
  const phoneDigits = guide.phone?.replace(/\D/g, "") || "";
  const whatsappUrl = phoneDigits
    ? `https://wa.me/${phoneDigits.startsWith("966") ? phoneDigits : `966${phoneDigits.replace(/^0/, "")}`}`
    : null;

  // Hero background: profile picture or primary color
  const heroBg = guide.profilePictureUrl
    ? { backgroundImage: `url(${guide.profilePictureUrl})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { backgroundColor: store.primaryColor || "#1f2937" };

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader storeName={storeName} logoUrl={store.logoUrl} slug={slug} />

      {/* Hero — profile picture or primary color, dark overlay, guide name + location */}
      <section
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 pt-20 pb-20"
        style={heroBg}
      >
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            {guideName}
          </h1>
          {guide.location && (
            <p className="mt-4 text-lg text-white/95 drop-shadow md:text-xl">
              {guide.location}
            </p>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* About Me */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-black">About Me</h2>
          {bio ? (
            <p className="text-lg leading-relaxed text-gray-700">{bio}</p>
          ) : (
            <p className="text-lg leading-relaxed text-gray-500">
              No bio available yet.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">
              Experienced Guide
            </span>
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">
              24h response time
            </span>
          </div>
        </section>

        {/* Languages & Specialties */}
        <section className="mb-16">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-black">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {languages.length > 0 ? (
                  languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-black">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {specialties.length > 0 ? (
                  specialties.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tour Gallery */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-black">Tour Gallery</h2>
          {tours.length > 0 ? (
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
                  <div className="p-4">
                    <h4 className="font-bold text-black">{tour.title}</h4>
                    <p className="mt-2 font-semibold text-black">
                      {tour.price} {tour.currency}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
              No tours available yet.
            </p>
          )}
        </section>

        {/* Reviews placeholder */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-black">Reviews</h2>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-xl font-medium text-gray-600">
              ⭐ Reviews coming soon
            </p>
          </div>
        </section>

        {/* Contact CTA — WhatsApp */}
        {whatsappUrl && (
          <section className="mb-16">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#20BD5A]"
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Book via WhatsApp
            </a>
          </section>
        )}
      </main>

      <StoreFooter storeName={storeName} licenseNumber={guide.licenseNumber} />
    </div>
  );
}
