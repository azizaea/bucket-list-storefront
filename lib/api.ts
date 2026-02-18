const API_BASE = "https://api.bucketlist.sa/api/guide-stores/public";

export interface Tour {
  id: string;
  title: string;
  price: number;
  currency: string;
  maxGuests: number;
  duration: number;
  coverImage?: string | null;
  description?: string | null;
  itineraryDays?: { day: number; title: string; description: string }[];
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
