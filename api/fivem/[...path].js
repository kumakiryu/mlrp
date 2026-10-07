const FIVEM_API_BASE = "https://frontend.cfx-services.net/api";

export default async function handler(request, response) {
  const path = Array.isArray(request.query.path)
    ? request.query.path.join("/")
    : request.query.path;

  if (!path || !/^servers\/single\/[a-zA-Z0-9]+$/.test(path)) {
    return response.status(400).json({ error: "Invalid FiveM API path" });
  }

  try {
    const upstream = await fetch(`${FIVEM_API_BASE}/${path}`, {
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      return response.status(upstream.status).json({ error: "FiveM server unavailable" });
    }

    const payload = await upstream.json();
    response.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return response.status(200).json(payload);
  } catch {
    return response.status(502).json({ error: "Unable to reach the FiveM API" });
  }
}
