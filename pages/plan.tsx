import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Plant = {
  name: string;
  latin?: string;
  image: string;
  notes: string;
};

export default function Plan() {
  const router = useRouter();
  const { zip, lat, lng } = router.query;

  const [loading, setLoading] = useState(true);

  // Decide region based on either ZIP or latitude.
  const region = useMemo(() => {
    // ZIP-based fallback (simple + deterministic)
    if (typeof zip === "string") {
      if (zip === "60302") return "Oak Park, IL";
      if (zip.startsWith("60")) return "Chicagoland / Upper Midwest";
      if (zip.startsWith("94")) return "Northern California";
      if (zip.startsWith("10") || zip.startsWith("11")) return "NYC Metro";
      return "Your Region";
    }

    // Lat-based fallback (rough bands)
    if (typeof lat === "string") {
      const latitude = parseFloat(lat);
      if (!Number.isNaN(latitude)) {
        if (latitude >= 40 && latitude <= 43) return "Chicagoland / Upper Midwest";
        if (latitude >= 36 && latitude < 40) return "Mid-Atlantic / Southern US";
        if (latitude >= 43 && latitude <= 49) return "Northern US / Great Lakes";
        if (latitude >= 32 && latitude < 36) return "Southern US";
      }
    }

    return "Your Region";
  }, [zip, lat]);

  // Plants (starter set). Later we’ll swap these based on region.
  const plants: Plant[] = useMemo(() => {
    // If you want, you can branch by region here.
    // For now: a Midwest-friendly starter set.
    return [
      {
        name: "Purple Coneflower",
        latin: "Echinacea purpurea",
        image:
          "https://images.unsplash.com/photo-1627923109045-01caba5a8b71?auto=format&fit=crop&w=1200&q=70",
        notes: "Hardy, pollinator magnet, blooms mid–late summer.",
      },
      {
        name: "Wild Bergamot",
        latin: "Monarda fistulosa",
        image:
          "https://images.unsplash.com/photo-1621619858360-7f79b3f3b2a9?auto=format&fit=crop&w=1200&q=70",
        notes: "Great for bees, smells amazing, handles heat well.",
      },
      {
        name: "Prairie Dropseed",
        latin: "Sporobolus heterolepis",
        image:
          "https://images.unsplash.com/photo-1625246333196-5b21f2bced1e?auto=format&fit=crop&w=1200&q=70",
        notes: "Soft grassy texture, drought tolerant, low maintenance.",
      },
    ];
  }, []);

  // Loading state just to avoid “router.query undefined” flashes
  useEffect(() => {
    if (!router.isReady) return;
    setLoading(false);
  }, [router.isReady]);

  const hasParams =
    (typeof zip === "string" && zip.length > 0) ||
    (typeof lat === "string" && typeof lng === "string" && lat.length > 0 && lng.length > 0);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          fontFamily: "system-ui",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <p style={{ opacity: 0.7 }}>Loading your plan…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui",
        padding: "2rem",
        maxWidth: "920px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
            opacity: 0.75,
            fontSize: "0.95rem",
          }}
        >
          ← Back
        </button>
      </div>

      <header style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>
          Your Rewild Plan
        </h1>

        <p style={{ margin: 0, opacity: 0.75 }}>
          Region: <strong>{region}</strong>
        </p>

        {typeof lat === "string" && typeof lng === "string" && (
          <p style={{ marginTop: "0.5rem", opacity: 0.55, fontSize: "0.95rem" }}>
            Using location: {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
          </p>
        )}

        {typeof zip === "string" && (
          <p style={{ marginTop: "0.5rem", opacity: 0.55, fontSize: "0.95rem" }}>
            Using ZIP: {zip}
          </p>
        )}
      </header>

      {!hasParams ? (
        <div
          style={{
            textAlign: "center",
            padding: "1.5rem",
            border: "1px solid #eee",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: "1rem", opacity: 0.75 }}>
            I don’t see a ZIP code or location in the URL.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "none",
              background: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go back and start over
          </button>
        </div>
      ) : (
        <>
          <section
            style={{
              margin: "0 auto",
              maxWidth: "760px",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              Your starter plants
            </h2>
            <p style={{ marginTop: 0, opacity: 0.75 }}>
              Three native picks that are easy to find, easy to grow, and great for pollinators.
            </p>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {plants.map((p) => (
              <article
                key={p.name}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                  background: "white",
                }}
              >
                <div style={{ width: "100%", height: "160px", background: "#f2f2f2" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      // If an image URL fails, keep it clean (no broken icon)
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                <div style={{ padding: "0.9rem 0.95rem 1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{p.name}</h3>
                  {p.latin && (
                    <p style={{ margin: "0.25rem 0 0.5rem", opacity: 0.65, fontStyle: "italic" }}>
                      {p.latin}
                    </p>
                  )}
                  <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.35 }}>{p.notes}</p>
                </div>
              </article>
            ))}
          </section>

          <section
            style={{
              marginTop: "2rem",
              textAlign: "center",
              padding: "1.25rem",
              border: "1px solid #eee",
              borderRadius: "14px",
              background: "#fafafa",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1.25rem" }}>
              A simple first step
            </h2>
            <p style={{ marginTop: 0, opacity: 0.75 }}>
              Replace one small patch (like a 3×6 ft area) with these three plants.
              You’ll learn fast, see results this season, and build confidence.
            </p>

            <button
              type="button"
              onClick={() => alert("Next: we’ll add a downloadable checklist 🙂")}
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: "black",
                color: "white",
                cursor: "pointer",
              }}
            >
              Get my 10-minute checklist
            </button>
          </section>
        </>
      )}
    </main>
  );
}