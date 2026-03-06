import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Plant = {
  name: string;
  latin?: string;
  image: string;
  notes: string;
};

type GeoInfo = {
  state?: string;
  city?: string;
  county?: string;
  displayName?: string;
};

function getEcosystemLabel(region: string): string {
  if (
    region.includes("Illinois") ||
    region.includes("Oak Park") ||
    region.includes("Chicago")
  ) {
    return "Prairie / Oak Savanna ecosystem";
  }

  if (region.includes("California")) {
    return "California grassland / chaparral ecosystem";
  }

  if (region.includes("New York") || region.includes("Northeast")) {
    return "Northeastern meadow / woodland ecosystem";
  }

  return "Local native plant ecosystem";
}

function getPlantsForRegion(region: string): Plant[] {
  const midwest: Plant[] = [
    {
      name: "Purple Coneflower",
      latin: "Echinacea purpurea",
      image:
        "https://images.unsplash.com/photo-1627923109045-01caba5a8b71?auto=format&fit=crop&w=1200&q=70",
      notes: "Hardy, colorful, and excellent for pollinators.",
    },
    {
      name: "Wild Bergamot",
      latin: "Monarda fistulosa",
      image:
        "https://images.unsplash.com/photo-1621619858360-7f79b3f3b2a9?auto=format&fit=crop&w=1200&q=70",
      notes: "Loved by bees and butterflies; fragrant and easygoing.",
    },
    {
      name: "Prairie Dropseed",
      latin: "Sporobolus heterolepis",
      image:
        "https://images.unsplash.com/photo-1625246333196-5b21f2bced1e?auto=format&fit=crop&w=1200&q=70",
      notes: "A soft native grass with great texture and low maintenance needs.",
    },
  ];

  const california: Plant[] = [
    {
      name: "California Poppy",
      latin: "Eschscholzia californica",
      image:
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=70",
      notes: "Iconic blooms, drought tolerant, and easy to scatter into a sunny patch.",
    },
    {
      name: "Yarrow",
      latin: "Achillea millefolium",
      image:
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=70",
      notes: "Tough, pollinator-friendly, and adaptable in many garden conditions.",
    },
    {
      name: "Deer Grass",
      latin: "Muhlenbergia rigens",
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=70",
      notes: "Architectural native grass that adds structure and handles dry summers.",
    },
  ];

  const northeast: Plant[] = [
    {
      name: "Black-Eyed Susan",
      latin: "Rudbeckia hirta",
      image:
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=70",
      notes: "Bright and cheerful, great for pollinators and beginner-friendly.",
    },
    {
      name: "Bee Balm",
      latin: "Monarda didyma",
      image:
        "https://images.unsplash.com/photo-1565019011521-b0575c2067b5?auto=format&fit=crop&w=1200&q=70",
      notes: "Bold flowers that hummingbirds and bees absolutely love.",
    },
    {
      name: "Little Bluestem",
      latin: "Schizachyrium scoparium",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=70",
      notes: "A native grass with gorgeous seasonal color and good habitat value.",
    },
  ];

  if (region.includes("California")) return california;
  if (region.includes("New York") || region.includes("Northeast")) return northeast;
  return midwest;
}

export default function Plan() {
  const router = useRouter();
  const { zip, lat, lng } = router.query;

  const [geoInfo, setGeoInfo] = useState<GeoInfo | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (
      typeof lat === "string" &&
      typeof lng === "string" &&
      lat.length > 0 &&
      lng.length > 0
    ) {
      const run = async () => {
        try {
          setGeoLoading(true);

          const response = await fetch(
            `/api/reverse-geocode?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
          );
          const data = await response.json();

          if (data.ok) {
            setGeoInfo({
              state: data.state,
              city: data.city,
              county: data.county,
              displayName: data.displayName,
            });
          }
        } catch (error) {
          console.error("reverse geocode failed", error);
        } finally {
          setGeoLoading(false);
        }
      };

      run();
    }
  }, [lat, lng]);

  const region = useMemo(() => {
    if (geoInfo?.city && geoInfo?.state) {
      return `${geoInfo.city}, ${geoInfo.state}`;
    }

    if (geoInfo?.state) {
      return geoInfo.state;
    }

    if (typeof zip === "string") {
      if (zip === "60302") return "Oak Park, Illinois";
      if (zip.startsWith("60")) return "Illinois";
      if (zip.startsWith("94")) return "California";
      if (zip.startsWith("10") || zip.startsWith("11")) return "New York";
    }

    return "Your Region";
  }, [geoInfo, zip]);

  const plants = useMemo(() => getPlantsForRegion(region), [region]);
  const ecosystem = useMemo(() => getEcosystemLabel(region), [region]);

  const hasParams =
    (typeof zip === "string" && zip.length > 0) ||
    (typeof lat === "string" && typeof lng === "string");

  if (!hasParams) {
    return (
      <main
        style={{
          minHeight: "100vh",
          fontFamily: "system-ui",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ opacity: 0.7 }}>No location found.</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "none",
              background: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui",
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <button
        type="button"
        onClick={() => router.push("/")}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textDecoration: "underline",
          opacity: 0.7,
          marginBottom: "1.5rem",
        }}
      >
        ← Back
      </button>

      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>
          Your Rewild Plan
        </h1>

        <p style={{ margin: 0, opacity: 0.75 }}>
          Region: <strong>{region}</strong>
        </p>

        <p style={{ marginTop: "0.5rem", opacity: 0.65, fontSize: "0.98rem" }}>
          Ecosystem: <strong>{ecosystem}</strong>
        </p>

        {geoLoading && (
          <p style={{ marginTop: "0.5rem", opacity: 0.55 }}>
            Refining your location…
          </p>
        )}

        {typeof lat === "string" && typeof lng === "string" && !geoLoading && (
          <p style={{ marginTop: "0.5rem", opacity: 0.55, fontSize: "0.95rem" }}>
            Using your current location
          </p>
        )}

        {typeof zip === "string" && (
          <p style={{ marginTop: "0.5rem", opacity: 0.55, fontSize: "0.95rem" }}>
            Using ZIP: {zip}
          </p>
        )}
      </header>

      <section
        style={{
          marginBottom: "1.5rem",
          textAlign: "center",
          maxWidth: "760px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
          Starter plants for your area
        </h2>
        <p style={{ margin: 0, opacity: 0.75 }}>
          A simple, location-aware starter set to help you begin with confidence.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {plants.map((plant) => (
          <article
            key={plant.name}
            style={{
              border: "1px solid #eee",
              borderRadius: "14px",
              overflow: "hidden",
              background: "white",
              boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
            }}
          >
            <img
              src={plant.image}
              alt={plant.name}
              style={{
                width: "100%",
                height: "170px",
                objectFit: "cover",
                display: "block",
                background: "#f3f3f3",
              }}
            />
            <div style={{ padding: "1rem" }}>
              <h3 style={{ margin: 0 }}>{plant.name}</h3>
              {plant.latin && (
                <p
                  style={{
                    margin: "0.3rem 0 0.6rem",
                    opacity: 0.65,
                    fontStyle: "italic",
                  }}
                >
                  {plant.latin}
                </p>
              )}
              <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.4 }}>
                {plant.notes}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section
        style={{
          marginTop: "2rem",
          padding: "1.25rem",
          borderRadius: "14px",
          background: "#fafafa",
          border: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1.2rem" }}>
          A simple first step
        </h2>
        <p style={{ margin: 0, opacity: 0.75 }}>
          Start with one small patch — even a 3×6 ft area is enough to create habitat and
          learn what works in your yard.
        </p>
      </section>
    </main>
  );
}