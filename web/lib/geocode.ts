const cache = new Map<string, string>();

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('lat', String(latitude));
    url.searchParams.set('lon', String(longitude));
    url.searchParams.set('format', 'json');

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'OneTapHelp/1.0 (emergency tracking)' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return formatCoordsFallback(latitude, longitude);

    const data = (await res.json()) as { display_name?: string };
    const name = data.display_name?.split(',').slice(0, 3).join(', ') ?? null;
    const label = name ?? formatCoordsFallback(latitude, longitude);
    cache.set(key, label);
    return label;
  } catch {
    return formatCoordsFallback(latitude, longitude);
  }
}

function formatCoordsFallback(lat: number, lng: number): string {
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}
