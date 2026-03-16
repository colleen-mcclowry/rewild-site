import type { NextApiRequest, NextApiResponse } from "next";

type ReverseGeocodeSuccess = {
  ok: boolean;
  state?: string;
  city?: string;
  county?: string;
  displayName?: string;
  raw: unknown;
};

type ReverseGeocodeError = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReverseGeocodeSuccess | ReverseGeocodeError>
) {
  const { lat, lon, latlng } = req.query;

  // Accept either lat & lon or latlng="lat,lon"
  let latitude: string | undefined;
  let longitude: string | undefined;
  if (lat && lon) {
    latitude = String(lat);
    longitude = String(lon);
  } else if (typeof latlng === "string") {
    const parts = latlng.split(",");
    if (parts.length >= 2) {
      latitude = parts[0].trim();
      longitude = parts[1].trim();
    }
  }

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: 'Provide lat and lon (or latlng="lat,lon")' });
  }

  try {
    // If you have a provider URL or API key, set REVERSE_GEOCODE_URL in .env.local
    // Example default: Nominatim (OpenStreetMap) — no key required
    const base =
      process.env.REVERSE_GEOCODE_URL ??
      "https://nominatim.openstreetmap.org/reverse";
    const params = new URLSearchParams({
      format: "json",
      lat: latitude,
      lon: longitude,
      addressdetails: "1",
    });

    const url = `${base}?${params.toString()}`;

    const fetchOptions: RequestInit = {
      headers: {
        "User-Agent": "rewild-site/1.0 (contact@example.com)",
        Accept: "application/json",
      },
    };

    const r = await fetch(url, fetchOptions);
    const body = await r.json();
    const address = body?.address ?? {};

    return res.status(r.ok ? 200 : 502).json({
      ok: r.ok,
      state: address.state,
      city: address.city ?? address.town ?? address.village ?? address.hamlet,
      county: address.county,
      displayName: body?.display_name,
      raw: body,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
