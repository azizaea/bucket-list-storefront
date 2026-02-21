const API_BASE = "https://api.bucketlist.sa/api/guide-stores/public";

export interface GuideStoreData {
  guide: {
    fullName: string;
    storeSlug: string;
    licenseNumber?: string | null;
    profilePictureUrl?: string | null;
    location?: string | null;
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
}

export async function fetchGuideStore(slug: string): Promise<GuideStoreData | null> {
  try {
    const res = await fetch(`${API_BASE}/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

export interface Tour {
  id: string;
  title: string;
  price: number;
  currency: string;
  maxGuests: number;
  duration: number;
  coverImage?: string | null;
  description?: string | null;
  itineraryDays?: { day: number; timeLabel?: string; title: string; description: string }[];
  includes?: string[];
  excludes?: string[];
}

export interface ToursResponse {
  success: boolean;
  data: { tours: Tour[] };
}

export async function fetchTours(slug: string): Promise<Tour[]> {
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
