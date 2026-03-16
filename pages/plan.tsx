import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type SunPreference = "full-sun" | "part-shade" | "mostly-shade";
type SpacePreference = "small-patch" | "medium-yard" | "large-yard";

type Plant = {
  name: string;
  latin?: string;
  benefit: string;
  image?: string;
  imageSourceLabel?: string;
  imageSourceUrl?: string;
  notes: string;
};

type GeoInfo = {
  state?: string;
  city?: string;
  county?: string;
  displayName?: string;
};

type PlanDetails = {
  sun: SunPreference;
  sunLabel: string;
  space: SpacePreference;
  spaceLabel: string;
  sizeRange: string;
  strategy: string;
  title: string;
};

export default function Plan() {
  const router = useRouter();
  const { zip, lat, lon, lng, sun, space } = router.query;
  const longitude = typeof lon === "string" ? lon : typeof lng === "string" ? lng : undefined;

  const [geoInfo, setGeoInfo] = useState<GeoInfo | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantsLoading, setPlantsLoading] = useState(false);
  const [ecosystem, setEcosystem] = useState("Local native plant ecosystem");
  const [planDetails, setPlanDetails] = useState<PlanDetails>({
    sun: "full-sun",
    sunLabel: "Full sun",
    space: "small-patch",
    spaceLabel: "Small patch",
    sizeRange: "About 3 x 6 ft to 8 x 10 ft",
    strategy: "Start with one compact habitat pocket that looks intentional fast.",
    title: "Starter plan",
  });

  useEffect(() => {
    if (
      typeof lat === "string" &&
      typeof longitude === "string" &&
      lat.length > 0 &&
      longitude.length > 0
    ) {
      const run = async () => {
        try {
          setGeoLoading(true);

          const response = await fetch(
            `/api/reverse-geocode?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(longitude)}`
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
  }, [lat, longitude]);

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

  useEffect(() => {
    if (!router.isReady) return;

    const run = async () => {
      try {
        setPlantsLoading(true);

        const params = new URLSearchParams();
        params.set("region", region);

        if (typeof zip === "string" && zip.length > 0) {
          params.set("zip", zip);
        }
        if (typeof sun === "string" && sun.length > 0) {
          params.set("sun", sun);
        }
        if (typeof space === "string" && space.length > 0) {
          params.set("space", space);
        }

        const response = await fetch(`/api/plants?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error ?? "Unable to load plants");
        }

        setPlants(Array.isArray(data.plants) ? data.plants : []);
        setEcosystem(
          typeof data.ecosystem === "string"
            ? data.ecosystem
            : "Local native plant ecosystem"
        );
        if (data.plan) {
          setPlanDetails(data.plan);
        }
      } catch (error) {
        console.error("plant plan failed", error);
        setPlants([]);
      } finally {
        setPlantsLoading(false);
      }
    };

    run();
  }, [region, router.isReady, space, sun, zip]);

  const hasParams =
    (typeof zip === "string" && zip.length > 0) ||
    (typeof lat === "string" && typeof longitude === "string");
  const locationSource =
    typeof lat === "string" && typeof longitude === "string"
      ? "Current location"
      : typeof zip === "string"
        ? `ZIP ${zip}`
        : "Location";
  const regionLabel = region === "Your Region" ? "your area" : region;
  const planTitle =
    region === "Your Region"
      ? planDetails.title
      : `${planDetails.sunLabel} plan for ${region}`;
  const cardSurface = "rgba(255,255,255,0.78)";
  const warmBorder = "1px solid rgba(104, 130, 90, 0.16)";

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
        fontFamily:
          '"Avenir Next", Avenir, Montserrat, "Segoe UI", "Helvetica Neue", sans-serif',
        padding: "2rem 1.25rem 4rem",
        margin: "0 auto",
        background:
          "radial-gradient(circle at top left, rgba(220, 234, 212, 0.98), transparent 33%), radial-gradient(circle at 90% 14%, rgba(246, 224, 188, 0.84), transparent 24%), linear-gradient(180deg, #f3efe4 0%, #fbfaf3 40%, #f2f5ec 100%)",
        color: "#1d2a1d",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "#4e6249",
            fontSize: "0.95rem",
            letterSpacing: "0.01em",
            fontWeight: 600,
            marginBottom: "1.5rem",
          }}
        >
          ← Back home
        </button>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.9fr)",
            gap: "1.25rem",
            alignItems: "stretch",
            marginBottom: "1.75rem",
          }}
        >
          <header
            style={{
              borderRadius: "30px",
              padding: "1.8rem",
              background:
                "linear-gradient(145deg, rgba(28, 46, 33, 0.97), rgba(57, 85, 49, 0.92))",
              color: "#f6f5ee",
              boxShadow: "0 24px 56px rgba(37, 58, 33, 0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "auto -70px -80px auto",
                width: "220px",
                height: "220px",
                borderRadius: "999px",
                background: "rgba(246, 212, 140, 0.12)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.65rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  padding: "0.45rem 0.8rem",
                  background: "rgba(255,255,255,0.12)",
                fontSize: "0.85rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {locationSource}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  padding: "0.45rem 0.8rem",
                background: "rgba(255,255,255,0.12)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {ecosystem}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  padding: "0.45rem 0.8rem",
                  background: "rgba(255,255,255,0.12)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {planDetails.spaceLabel}
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.35rem, 6vw, 4.6rem)",
                lineHeight: 0.96,
                margin: "0 0 1rem",
                letterSpacing: "-0.06em",
                fontWeight: 700,
              }}
            >
              {planTitle}
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "36rem",
                fontSize: "1.02rem",
                lineHeight: 1.72,
                color: "rgba(246, 245, 238, 0.82)",
                letterSpacing: "-0.01em",
              }}
            >
              We turned {regionLabel} into a {planDetails.sunLabel.toLowerCase()} starter
              plan for a {planDetails.spaceLabel.toLowerCase()}. Expect three native plants
              that support pollinators while staying manageable for the space you picked.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "0.8rem",
                marginTop: "1.4rem",
              }}
            >
              <div
                style={{
                  borderRadius: "18px",
                  padding: "0.95rem",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(4px)",
              }}
            >
                <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.72 }}>Starter set</p>
                <p style={{ margin: "0.3rem 0 0", fontSize: "1.5rem" }}>{plants.length || 3}</p>
              </div>
              <div
                style={{
                  borderRadius: "18px",
                  padding: "0.95rem",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(4px)",
              }}
              >
                <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.72 }}>Light</p>
                <p style={{ margin: "0.3rem 0 0", fontSize: "1.5rem" }}>{planDetails.sunLabel}</p>
              </div>
              <div
                style={{
                  borderRadius: "18px",
                  padding: "0.95rem",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(4px)",
              }}
              >
                <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.72 }}>Size guide</p>
                <p style={{ margin: "0.3rem 0 0", fontSize: "1.1rem", lineHeight: 1.25 }}>
                  {planDetails.sizeRange}
                </p>
              </div>
            </div>

            {geoLoading && (
              <p style={{ margin: "1rem 0 0", fontSize: "0.95rem", opacity: 0.72 }}>
                Refining your location...
              </p>
            )}
          </header>

          <aside
            style={{
              borderRadius: "28px",
              padding: "1.4rem",
              background: cardSurface,
              border: warmBorder,
              boxShadow: "0 18px 40px rgba(59, 82, 42, 0.08)",
              backdropFilter: "blur(14px)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.65rem",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#61725d",
                fontWeight: 700,
              }}
            >
              What makes this plan work
            </p>
            <h2
              style={{
                margin: "0 0 0.8rem",
                fontSize: "1.55rem",
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
              }}
            >
              A beginner-friendly native patch
            </h2>
            <p style={{ margin: 0, color: "#4f5d4d", lineHeight: 1.65 }}>
              This mix balances bloom, structure, and habitat so the space feels alive
              quickly without outgrowing your {planDetails.spaceLabel.toLowerCase()}.
            </p>

            <div
              style={{
                marginTop: "1.2rem",
                display: "grid",
                gap: "0.8rem",
              }}
            >
              {[
                `Matched to ${planDetails.sunLabel.toLowerCase()} conditions`,
                `Sized for a ${planDetails.spaceLabel.toLowerCase()}`,
                planDetails.strategy,
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: "18px",
                    padding: "0.9rem 1rem",
                    background: "rgba(244, 241, 231, 0.92)",
                    color: "#384536",
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <p style={{ margin: "1rem 0 0", fontSize: "0.92rem", color: "#6f7c69" }}>
              {typeof zip === "string"
                ? `Using ZIP ${zip} as your planning signal.`
                : "Using your current location as your planning signal."}
            </p>
          </aside>
        </section>

        <section
          style={{
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 0.45rem",
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#667260",
                fontWeight: 700,
              }}
            >
              Starter palette
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.02,
                letterSpacing: "-0.05em",
              }}
            >
              Native plants picked for {regionLabel}
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: "28rem", color: "#5f6d58", lineHeight: 1.6 }}>
            A location-aware plant set shaped by your light and space choices, so it
            feels like a plan instead of a generic list.
          </p>
        </section>

        {plantsLoading ? (
          <section
            style={{
              borderRadius: "26px",
              background:
                "linear-gradient(135deg, rgba(241,246,236,1) 0%, rgba(251,246,236,1) 100%)",
              border: "1px solid #dde5d3",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 12px 28px rgba(41, 63, 34, 0.06)",
              marginBottom: "1.75rem",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.2rem" }}>
              Building your starter habitat plan...
            </p>
            <p style={{ margin: "0.75rem auto 0", maxWidth: "32rem", opacity: 0.7 }}>
              Matching your area with a few native plants that are beautiful,
              beginner-friendly, and useful for wildlife.
            </p>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.15rem",
              marginBottom: "1.9rem",
            }}
          >
            {plants.map((plant, index) => (
              <article
                key={plant.name}
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.82)",
                  border: warmBorder,
                  boxShadow: "0 18px 44px rgba(42, 59, 32, 0.08)",
                }}
                className="plant-card fade-up"
              >
                <div style={{ position: "relative" }}>
                  {plant.image ? (
                    <Image
                      src={plant.image}
                      alt={plant.name}
                      width={1200}
                      height={680}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        display: "block",
                        background: "#f3f3f3",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "220px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1.25rem",
                        background:
                          "radial-gradient(circle at top left, rgba(221,233,210,0.95), transparent 34%), linear-gradient(180deg, rgba(231,239,222,1) 0%, rgba(243,239,228,1) 100%)",
                        color: "#345034",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "14rem",
                          display: "grid",
                          gap: "0.55rem",
                          justifyItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "3.8rem",
                            height: "3.8rem",
                            borderRadius: "999px",
                            display: "grid",
                            placeItems: "center",
                            background: "rgba(255,255,255,0.52)",
                            fontSize: "1.5rem",
                          }}
                        >
                          +
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.8rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            opacity: 0.66,
                          }}
                        >
                          Curated image in progress
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "1.12rem",
                            fontWeight: 700,
                            lineHeight: 1.25,
                          }}
                        >
                          Trustworthy species photo coming soon
                        </p>
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.9rem",
                      left: "0.9rem",
                      width: "2.3rem",
                      height: "2.3rem",
                      borderRadius: "999px",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(250, 247, 238, 0.92)",
                      color: "#2f4328",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                    }}
                  >
                    0{index + 1}
                  </div>
                </div>
                <div style={{ padding: "1.15rem" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.45rem",
                      lineHeight: 1.02,
                      letterSpacing: "-0.04em",
                      fontWeight: 700,
                    }}
                  >
                    {plant.name}
                  </h3>
                  {plant.latin && (
                    <p
                      style={{
                        margin: "0.35rem 0 0.75rem",
                        color: "#73806e",
                        fontStyle: "italic",
                      }}
                    >
                      {plant.latin}
                    </p>
                  )}
                  <p
                    style={{
                      margin: "0 0 0.65rem",
                      fontWeight: 600,
                      color: "#35552d",
                      lineHeight: 1.45,
                    }}
                  >
                    {plant.benefit}
                  </p>
                  <p style={{ margin: 0, color: "#566453", lineHeight: 1.6 }}>
                    {plant.notes}
                  </p>
                  {plant.imageSourceUrl && (
                    <p style={{ margin: "0.8rem 0 0", fontSize: "0.85rem", color: "#687565" }}>
                      <a
                        href={plant.imageSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#687565" }}
                      >
                        Photo source: {plant.imageSourceLabel}
                      </a>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.05fr) minmax(260px, 0.95fr)",
            gap: "1rem",
          }}
        >
          <section
            style={{
              borderRadius: "26px",
              padding: "1.5rem",
              background: "rgba(247, 244, 234, 0.92)",
              border: warmBorder,
            }}
          >
            <p
              style={{
                margin: "0 0 0.45rem",
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#687565",
                fontWeight: 700,
              }}
            >
              First weekend plan
            </p>
            <h2
              style={{
                margin: "0 0 0.8rem",
                fontSize: "1.9rem",
                lineHeight: 1.03,
                letterSpacing: "-0.05em",
              }}
            >
              Start with one small patch, not the whole yard
            </h2>
            <p style={{ margin: "0 0 1rem", color: "#596655", lineHeight: 1.6 }}>
              {planDetails.sizeRange}. The goal is momentum, not perfection.
            </p>
            <div style={{ display: "grid", gap: "0.7rem" }}>
              {[
                `Choose a ${planDetails.sunLabel.toLowerCase()} area you can realistically maintain.`,
                "Plant in loose clusters so the bed feels intentional quickly.",
                planDetails.strategy,
              ].map((step) => (
                <div
                  key={step}
                  style={{
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.68)",
                    padding: "0.95rem 1rem",
                    color: "#41503f",
                    lineHeight: 1.55,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              borderRadius: "26px",
              padding: "1.5rem",
              background: "rgba(255,253,250,0.88)",
              border: warmBorder,
              boxShadow: "0 14px 34px rgba(51, 70, 40, 0.05)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.45rem",
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#687565",
                fontWeight: 700,
              }}
            >
              Why this matters
            </p>
            <h2
              style={{
                margin: "0 0 0.8rem",
                fontSize: "1.9rem",
                lineHeight: 1.03,
                letterSpacing: "-0.05em",
              }}
            >
              Tiny habitat is still habitat
            </h2>
            <p style={{ margin: "0 0 1rem", color: "#596655", lineHeight: 1.6 }}>
              Native plants feed insects, insects feed birds, and suddenly your space is
              participating in something bigger than a garden bed.
            </p>
            <div
              style={{
                borderRadius: "18px",
                background: "linear-gradient(180deg, #eef3e6 0%, #f8f5ec 100%)",
                padding: "1rem",
                color: "#3f5139",
                lineHeight: 1.6,
              }}
            >
              Rewild works best when it feels joyful and repeatable. Start small, notice
              what shows up, and let curiosity pull you into the next patch.
            </div>
          </section>
        </section>
      </div>
      <style jsx>{`
        .fade-up {
          animation: fadeUp 700ms ease-out both;
        }

        .plant-card {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .plant-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 48px rgba(42, 59, 32, 0.12);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 920px) {
          section[style*="grid-template-columns: minmax(0, 1.4fr)"] {
            grid-template-columns: 1fr !important;
          }

          section[style*="grid-template-columns: minmax(0, 1.05fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
