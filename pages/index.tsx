import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

type SunPreference = "full-sun" | "part-shade" | "mostly-shade";
type SpacePreference = "small-patch" | "medium-yard" | "large-yard";
type GoalPreference = "pollinators" | "low-maintenance" | "bird-habitat" | "color";

const sunOptions: Array<{ value: SunPreference; label: string; notes: string }> = [
  {
    value: "full-sun",
    label: "Full sun",
    notes: "6+ hours of direct light",
  },
  {
    value: "part-shade",
    label: "Partial shade",
    notes: "Morning sun or dappled light",
  },
  {
    value: "mostly-shade",
    label: "Mostly shade",
    notes: "Protected from strong afternoon sun",
  },
];

const spaceOptions: Array<{ value: SpacePreference; label: string; notes: string }> = [
  {
    value: "small-patch",
    label: "Small patch",
    notes: "About 3 x 6 ft to 8 x 10 ft",
  },
  {
    value: "medium-yard",
    label: "Medium yard",
    notes: "About 200 to 1,000 sq ft, roughly 10 x 20 ft to 20 x 50 ft",
  },
  {
    value: "large-yard",
    label: "Large yard / plot",
    notes: "About 1,000 sq ft+ up to 1/4 acre or more",
  },
];

const goalOptions: Array<{ value: GoalPreference; label: string; notes: string }> = [
  {
    value: "pollinators",
    label: "Pollinators",
    notes: "More nectar, bloom, and insect activity",
  },
  {
    value: "low-maintenance",
    label: "Low maintenance",
    notes: "Easier structure and forgiving planting choices",
  },
  {
    value: "bird-habitat",
    label: "Bird habitat",
    notes: "More cover, seed, and layered shelter",
  },
  {
    value: "color",
    label: "Color",
    notes: "A brighter, more visibly blooming mix",
  },
];

const heroScenes = [
  {
    title: "A starter patch can look good fast.",
    copy: "Color, movement, and habitat in one real corner of the yard.",
    image: "/home/hero-garden.jpg",
    tags: ["Real garden", "Pollinator food"],
  },
  {
    title: "Who shows up",
    copy: "Butterflies start finding the patch when the flowers do.",
    image: "/home/hero-butterfly.jpg",
  },
  {
    title: "Native bloom",
    copy: "Even one small pocket can hold color, nectar, and momentum.",
    image: "/home/hero-milkweed.jpg",
  },
] as const;

const impactPreviewCards = [
  {
    kind: "leaf" as const,
    label: "Food",
    value: "Bloom + nectar",
    copy: "Native plants replace blank space with life.",
  },
  {
    kind: "bee" as const,
    label: "Pollinators",
    value: "Bees + butterflies",
    copy: "Bees and butterflies find food again.",
  },
  {
    kind: "bird" as const,
    label: "Wildlife",
    value: "Song + shelter",
    copy: "Insects bring birds, movement, and shelter with them.",
  },
  {
    kind: "globe" as const,
    label: "Climate",
    value: "Less mowing + roots",
    copy: "Healthier soil and stronger seasonal cycles build over time.",
  },
] as const;

const goalPreviewCopy: Record<GoalPreference, string> = {
  pollinators: "Start with bloom and nectar, and the insect activity follows.",
  "low-maintenance": "Start with a forgiving patch that feels lighter to care for over time.",
  "bird-habitat": "Start with layered shelter, seed, and more reasons for birds to stay.",
  color: "Start with a brighter patch that still works hard for habitat.",
};

function LightIcon({ type }: { type: SunPreference }) {
  const iconStroke = "#f3ddaf";
  const iconFill = "rgba(243, 221, 175, 0.14)";

  if (type === "full-sun") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" fill={iconFill} stroke={iconStroke} strokeWidth="1.6" />
        <path
          d="M12 2.8v3.1M12 18.1v3.1M21.2 12h-3.1M5.9 12H2.8M18.5 5.5l-2.2 2.2M7.7 16.3l-2.2 2.2M18.5 18.5l-2.2-2.2M7.7 7.7 5.5 5.5"
          stroke={iconStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "part-shade") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 4.2a7.8 7.8 0 1 0 0 15.6V4.2Z"
          fill={iconFill}
          stroke={iconStroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 4.2a7.8 7.8 0 0 1 0 15.6"
          stroke={iconStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18.6 6.2c-4.5.5-8.5 4-9.1 8.5-.2 1.2-.1 2.2.2 3.1.9.3 2 .4 3.1.2 4.5-.6 8-4.6 8.5-9.1.1-.9.1-1.8-.1-2.6-.8-.2-1.7-.2-2.6-.1Z"
        fill={iconFill}
        stroke={iconStroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.1 15.9c1.7-1.4 3.3-3 4.7-4.7"
        stroke={iconStroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoryGlyph({ kind }: { kind: "leaf" | "bee" | "bird" | "globe" }) {
  const stroke = "#38533b";

  if (kind === "leaf") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18.4 5.8c-5 .5-9.3 4.4-10 9.5-.2 1.3-.1 2.4.2 3.4 1 .3 2.1.4 3.4.2 5.1-.7 9-5 9.5-10 .1-.9.1-2-.1-3.1-.8-.2-1.9-.2-3-.1Z"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9 15c2.3-2 4.3-4.2 6-6.6"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "bee") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8.5 9.6c-1.1-1.8-.8-4 .8-5.1 1.6-1 3.9-.5 5.1 1.1"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M15.5 9.6c1.1-1.8.8-4-.8-5.1-1.6-1-3.9-.5-5.1 1.1"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <rect x="7" y="9" width="10" height="8" rx="4" stroke={stroke} strokeWidth="1.7" />
        <path d="M10 9v8M14 9v8" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 17v2.2" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "bird") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.5 15.8c1.5-4.7 5-8 10-8.6-.5 1.5-.6 3-.5 4.4 1.3.3 2.5.8 3.5 1.6-1.4 1.6-3.1 2.7-5.2 3.3-2.7.8-5.5.5-7.8-.7Z"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M10 12.3c1.5.1 2.8.5 4 1.2" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" stroke={stroke} strokeWidth="1.7" />
      <path d="M3.9 12h16.2M12 3.8c2 2.1 3.1 5 3.1 8.2S14 18.1 12 20.2" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 3.8c-2 2.1-3.1 5-3.1 8.2s1.1 6.1 3.1 8.2" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [zip, setZip] = useState("");
  const [sun, setSun] = useState<SunPreference>("full-sun");
  const [space, setSpace] = useState<SpacePreference>("small-patch");
  const [goal, setGoal] = useState<GoalPreference>("pollinators");
  const router = useRouter();

  const buildPlanUrl = (params: Record<string, string>) => {
    const search = new URLSearchParams({
      ...params,
      sun,
      space,
      goal,
    });

    return `/plan?${search.toString()}`;
  };

  const goWithZip = (value?: string) => {
    const cleaned = (value ?? zip).trim();

    if (cleaned.length === 5) {
      router.push(buildPlanUrl({ zip: cleaned }));
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported. Please enter your ZIP code instead.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(buildPlanUrl({ lat: String(latitude), lon: String(longitude) }));
      },
      () => {
        alert("We couldn't access your location. Please enter your ZIP instead.");
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
      }
    );
  };
  const selectedSun = sunOptions.find((option) => option.value === sun) ?? sunOptions[0];
  const selectedSpace = spaceOptions.find((option) => option.value === space) ?? spaceOptions[0];
  const selectedGoal = goalOptions.find((option) => option.value === goal) ?? goalOptions[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily:
          '"Avenir Next", Avenir, Montserrat, "Segoe UI", "Helvetica Neue", sans-serif',
        background:
          "radial-gradient(circle at top left, rgba(219, 233, 209, 0.98), transparent 28%), radial-gradient(circle at 84% 14%, rgba(246, 225, 188, 0.68), transparent 22%), linear-gradient(180deg, #f3efe4 0%, #fbf8f2 48%, #f4f6ee 100%)",
        color: "#1c2d22",
      }}
    >
      <div
        className="page-shell"
        style={{
          position: "relative",
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 4rem",
        }}
      >
        <div
          aria-hidden="true"
          className="float-slow"
          style={{
            position: "absolute",
            top: "3rem",
            left: "-2rem",
            width: "11rem",
            height: "11rem",
            borderRadius: "999px",
            background: "rgba(173, 204, 157, 0.18)",
            filter: "blur(10px)",
          }}
        />
        <div
          aria-hidden="true"
          className="float-delayed"
          style={{
            position: "absolute",
            right: "-1rem",
            top: "7rem",
            width: "12rem",
            height: "12rem",
            borderRadius: "999px",
            background: "rgba(235, 206, 153, 0.18)",
            filter: "blur(10px)",
          }}
        />

        <section
          className="fade-up"
          style={{
            textAlign: "center",
            marginBottom: "1.2rem",
          }}
        >
          <p
            style={{
              margin: "0 0 0.6rem",
              fontSize: "1.18rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#607159",
              fontWeight: 700,
            }}
          >
            Rewild
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.55rem, 6.8vw, 4.6rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.09em",
              color: "#203127",
              textWrap: "balance",
            }}
          >
            Your land. Nature&apos;s best hope.
          </h1>
          <p
            style={{
              maxWidth: "42rem",
              margin: "0.9rem auto 0",
              fontSize: "0.98rem",
              lineHeight: 1.72,
              color: "#52624d",
            }}
          >
            Turn a small patch into a thriving habitat.
          </p>
          <div
            className="hero-chip-row"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.6rem",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            {["Pick light", "Choose size", "Get your plan"].map((item) => (
              <span
                key={item}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  padding: "0.48rem 0.82rem",
                  background: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(125, 146, 108, 0.14)",
                  color: "#4d5d49",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <section
            className="hero-preview"
            style={{
              marginTop: "1.15rem",
              borderRadius: "30px",
              padding: "1.15rem",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(244, 247, 238, 0.78))",
              border: "1px solid rgba(125, 146, 108, 0.14)",
              boxShadow: "0 18px 42px rgba(59, 79, 44, 0.06)",
            }}
          >
            <div
              className="hero-gallery-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
                gap: "0.9rem",
                alignItems: "stretch",
              }}
            >
              <article
                className="hero-scene hero-scene-main"
                style={{
                  borderRadius: "24px",
                  minHeight: "420px",
                  color: "#f6f5ee",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={heroScenes[0].image}
                  alt={heroScenes[0].title}
                  fill
                  priority
                  sizes="(max-width: 720px) 100vw, 58vw"
                  style={{ objectFit: "cover" }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(15, 24, 18, 0.08) 0%, rgba(15, 24, 18, 0.34) 48%, rgba(15, 24, 18, 0.82) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "auto 1rem 1rem 1rem",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.74rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(246,245,238,0.76)",
                      fontWeight: 700,
                    }}
                  >
                    Picture the patch
                  </p>
                  <h3
                    style={{
                      margin: "0.45rem 0 0",
                      maxWidth: "22rem",
                      fontSize: "clamp(1.8rem, 4vw, 2.45rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {heroScenes[0].title}
                  </h3>
                  <p
                    style={{
                      margin: "0.6rem 0 0",
                      maxWidth: "24rem",
                      color: "rgba(246,245,238,0.82)",
                      lineHeight: 1.55,
                    }}
                  >
                    {heroScenes[0].copy}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginTop: "0.9rem",
                    }}
                  >
                    {heroScenes[0].tags.map((item) => (
                      <span
                        key={item}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          padding: "0.42rem 0.68rem",
                          background: "rgba(255,255,255,0.14)",
                          backdropFilter: "blur(6px)",
                          fontSize: "0.83rem",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>

              <div
                className="hero-scene-stack"
                style={{
                  display: "grid",
                  gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr) auto",
                  gap: "0.8rem",
                }}
              >
                {heroScenes.slice(1).map((scene) => (
                  <article
                    key={scene.title}
                    className="hero-scene"
                    style={{
                      borderRadius: "24px",
                      minHeight: "190px",
                      position: "relative",
                      overflow: "hidden",
                      textAlign: "left",
                      color: "#f6f5ee",
                    }}
                  >
                    <Image
                      src={scene.image}
                      alt={scene.title}
                      fill
                      sizes="(max-width: 720px) 100vw, 32vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(20, 29, 20, 0.06) 0%, rgba(20, 29, 20, 0.28) 48%, rgba(20, 29, 20, 0.78) 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: "auto 0.9rem 0.9rem 0.9rem",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.15rem",
                          lineHeight: 1.02,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {scene.title}
                      </h3>
                      <p
                        style={{
                          margin: "0.38rem 0 0",
                          color: "rgba(246,245,238,0.82)",
                          lineHeight: 1.45,
                          fontSize: "0.94rem",
                        }}
                      >
                        {scene.copy}
                      </p>
                    </div>
                  </article>
                ))}

                <article
                  style={{
                    borderRadius: "24px",
                    padding: "1rem",
                    background:
                      "linear-gradient(180deg, rgba(248, 250, 244, 0.96), rgba(243, 238, 226, 0.94))",
                    border: "1px solid rgba(207, 216, 199, 0.9)",
                    textAlign: "left",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.5rem",
                      fontSize: "0.75rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#697867",
                      fontWeight: 700,
                    }}
                  >
                    The shift
                  </p>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.5rem",
                      lineHeight: 1.02,
                      letterSpacing: "-0.05em",
                      color: "#243424",
                    }}
                  >
                    Not a perfect meadow. Just a living patch.
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.55rem",
                      marginTop: "0.9rem",
                    }}
                  >
                    {["Less mowing", "More bloom", "More shelter"].map((item) => (
                      <span
                        key={item}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          padding: "0.46rem 0.68rem",
                          background: "rgba(236, 242, 230, 0.92)",
                          color: "#32442f",
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p style={{ margin: "0.7rem 0 0", color: "#5b6a57", lineHeight: 1.55 }}>
                    The planner below is the tool. This is what the shift can actually look like.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </section>

        <section
          className="planner-section fade-up delay-2"
          style={{
            marginTop: "1rem",
            position: "relative",
            borderRadius: "38px",
            padding: "1.4rem",
            background:
              "linear-gradient(155deg, rgba(25, 43, 31, 0.98), rgba(49, 79, 50, 0.94))",
            color: "#f8f5ec",
            boxShadow: "0 32px 78px rgba(30, 46, 33, 0.18)",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: "16rem",
              height: "11rem",
              opacity: 0.9,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "9rem",
                height: "5.5rem",
                borderRadius: "70% 30% 65% 35% / 55% 35% 65% 45%",
                background: "rgba(164, 194, 124, 0.24)",
                transform: "rotate(-10deg)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "1.6rem",
                left: "3rem",
                width: "9.5rem",
                height: "5rem",
                borderRadius: "43% 57% 34% 66% / 49% 36% 64% 51%",
                background: "rgba(230, 189, 116, 0.22)",
                transform: "rotate(9deg)",
              }}
            />
          </div>

          <div
            className="planner-body"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            <section
              style={{
                borderRadius: "30px",
                padding: "1.15rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    margin: "0 0 0.35rem",
                    fontSize: "0.8rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "rgba(248,245,236,0.72)",
                  }}
                >
                  Build your starter plan
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "2rem",
                    lineHeight: 0.98,
                    letterSpacing: "-0.05em",
                  }}
                >
                  Four simple choices. One patch to start.
                </h2>
                <p
                  style={{
                    margin: "0.55rem 0 0",
                    color: "rgba(248,245,236,0.76)",
                    lineHeight: 1.6,
                    maxWidth: "34rem",
                  }}
                >
                  Set the patch, pick the light, choose the size, and tell us what you
                  want back most.
                </p>
              </div>

              <div
                className="planner-form-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "0.85rem",
                }}
              >
                <section
                  style={{
                    gridColumn: "1 / -1",
                    borderRadius: "24px",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.3rem",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      opacity: 0.76,
                    }}
                  >
                    1. Where is the patch?
                  </p>
                  <p
                    style={{
                      margin: "0 0 0.85rem",
                      color: "rgba(248,245,236,0.74)",
                      lineHeight: 1.55,
                    }}
                  >
                    Use your location or type a ZIP. We only use this to localize the
                    plant list.
                  </p>
                  <div
                    className="planner-location-row"
                    style={{
                      display: "flex",
                      gap: "0.8rem",
                      alignItems: "stretch",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleLocation}
                      className="cta-pop"
                      style={{
                        padding: "0.95rem 1.2rem",
                        fontSize: "0.98rem",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        borderRadius: "18px",
                        border: "none",
                        backgroundColor: "#f3ddaf",
                        color: "#213426",
                        cursor: "pointer",
                        boxShadow: "0 18px 36px rgba(15, 24, 17, 0.18)",
                      }}
                    >
                      Use my location
                    </button>

                    <div
                      className="planner-location-inline"
                      style={{
                        display: "flex",
                        gap: "0.65rem",
                        alignItems: "stretch",
                        flex: "1 1 280px",
                      }}
                    >
                      <input
                        placeholder="Enter ZIP"
                        value={zip}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                          setZip(value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && zip.length === 5) {
                            e.preventDefault();
                            goWithZip();
                          }
                        }}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: "0.95rem 1rem",
                          fontSize: "1rem",
                          borderRadius: "18px",
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(255,255,255,0.08)",
                          color: "#f8f5ec",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => goWithZip()}
                        disabled={zip.length !== 5}
                        style={{
                          padding: "0.95rem 1rem",
                          fontSize: "0.96rem",
                          fontWeight: 700,
                          borderRadius: "18px",
                          border: "1px solid rgba(255,255,255,0.18)",
                          background:
                            zip.length === 5
                              ? "rgba(255,255,255,0.12)"
                              : "rgba(255,255,255,0.04)",
                          color:
                            zip.length === 5
                              ? "#f8f5ec"
                              : "rgba(248,245,236,0.42)",
                          cursor: zip.length === 5 ? "pointer" : "default",
                        }}
                      >
                        Use ZIP
                      </button>
                    </div>
                  </div>
                </section>

                <section
                  style={{
                    borderRadius: "24px",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.3rem",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      opacity: 0.76,
                    }}
                  >
                    2. How much light?
                  </p>
                  <p
                    style={{
                      margin: "0 0 0.85rem",
                      color: "rgba(248,245,236,0.74)",
                      lineHeight: 1.55,
                    }}
                  >
                    Choose the light this patch gets most often.
                  </p>
                  <div
                    className="planner-choice-grid planner-choice-grid-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: "0.7rem",
                    }}
                  >
                    {sunOptions.map((option) => {
                      const isActive = option.value === sun;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSun(option.value)}
                          style={{
                            textAlign: "left",
                            borderRadius: "18px",
                            border: isActive
                              ? "1px solid rgba(243, 221, 175, 0.9)"
                              : "1px solid rgba(255,255,255,0.14)",
                            background: isActive
                              ? "linear-gradient(180deg, rgba(243, 221, 175, 0.18), rgba(255,255,255,0.08))"
                              : "rgba(255,255,255,0.06)",
                            color: "#f8f5ec",
                            padding: "0.85rem",
                            cursor: "pointer",
                            boxShadow: isActive
                              ? "0 12px 26px rgba(19, 29, 21, 0.16)"
                              : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "2.5rem",
                              height: "2.5rem",
                              borderRadius: "999px",
                              marginBottom: "0.65rem",
                              background: isActive
                                ? "rgba(243, 221, 175, 0.18)"
                                : "rgba(255,255,255,0.08)",
                            }}
                          >
                            <LightIcon type={option.value} />
                          </div>
                          <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: "0.88rem", opacity: 0.78, lineHeight: 1.45 }}>
                            {option.notes}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section
                  style={{
                    borderRadius: "24px",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.3rem",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      opacity: 0.76,
                    }}
                  >
                    3. How much space?
                  </p>
                  <p
                    style={{
                      margin: "0 0 0.85rem",
                      color: "rgba(248,245,236,0.74)",
                      lineHeight: 1.55,
                    }}
                  >
                    Pick the scale that feels realistic for your first patch.
                  </p>
                  <div style={{ display: "grid", gap: "0.7rem" }}>
                    {spaceOptions.map((option) => {
                      const isActive = option.value === space;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSpace(option.value)}
                          style={{
                            textAlign: "left",
                            borderRadius: "20px",
                            border: isActive
                              ? "1px solid rgba(243, 221, 175, 0.9)"
                              : "1px solid rgba(255,255,255,0.14)",
                            background: isActive
                              ? "linear-gradient(180deg, rgba(243, 221, 175, 0.18), rgba(255,255,255,0.08))"
                              : "rgba(255,255,255,0.06)",
                            color: "#f8f5ec",
                            padding: "0.9rem 1rem",
                            cursor: "pointer",
                            boxShadow: isActive
                              ? "0 12px 26px rgba(19, 29, 21, 0.16)"
                              : "none",
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: 1.5 }}>
                            {option.notes}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section
                  style={{
                    gridColumn: "1 / -1",
                    borderRadius: "24px",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.3rem",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      opacity: 0.76,
                    }}
                  >
                    4. What do you want back most?
                  </p>
                  <p
                    style={{
                      margin: "0 0 0.85rem",
                      color: "rgba(248,245,236,0.74)",
                      lineHeight: 1.55,
                    }}
                  >
                    Choose the outcome you want this planting to lead with.
                  </p>
                  <div
                    className="planner-choice-grid planner-choice-grid-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.7rem",
                    }}
                  >
                    {goalOptions.map((option) => {
                      const isActive = option.value === goal;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setGoal(option.value)}
                          style={{
                            textAlign: "left",
                            borderRadius: "18px",
                            border: isActive
                              ? "1px solid rgba(243, 221, 175, 0.9)"
                              : "1px solid rgba(255,255,255,0.14)",
                            background: isActive
                              ? "linear-gradient(180deg, rgba(243, 221, 175, 0.18), rgba(255,255,255,0.08))"
                              : "rgba(255,255,255,0.06)",
                            color: "#f8f5ec",
                            padding: "0.9rem 1rem",
                            cursor: "pointer",
                            boxShadow: isActive
                              ? "0 12px 26px rgba(19, 29, 21, 0.16)"
                              : "none",
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: "0.88rem", opacity: 0.8, lineHeight: 1.45 }}>
                            {option.notes}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <p
                style={{
                  margin: "0.9rem 0 0",
                  color: "rgba(248,245,236,0.62)",
                  lineHeight: 1.55,
                  fontSize: "0.92rem",
                }}
              >
                You can refine the mix again on the next screen without losing your
                location.
              </p>
            </section>

            <aside
              style={{
                borderRadius: "30px",
                padding: "1.1rem",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.06))",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.35rem",
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "rgba(248,245,236,0.72)",
                }}
              >
                What rewilding does
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.05em",
                }}
              >
                A little yard can wake up fast.
              </h2>
              <p
                style={{
                  margin: "0.7rem 0 0",
                  color: "rgba(248,245,236,0.76)",
                  lineHeight: 1.6,
                }}
              >
                Swap some lawn for native plants and you start bringing back food,
                shelter, and seasonal life.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.55rem",
                  marginTop: "0.9rem",
                }}
              >
                {[selectedSun.label, selectedSpace.label, `${selectedGoal.label} focus`].map(
                  (item) => (
                    <span
                      key={item}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: "999px",
                        padding: "0.42rem 0.68rem",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#f8f5ec",
                        fontSize: "0.84rem",
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>

              <div
                className="planner-impact-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                {impactPreviewCards.map((item) => (
                  <article
                    key={item.label}
                    style={{
                      borderRadius: "22px",
                      padding: "0.95rem",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      style={{
                        width: "2.8rem",
                        height: "2.8rem",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "999px",
                        background: "rgba(243, 221, 175, 0.14)",
                        marginBottom: "0.7rem",
                      }}
                    >
                      <StoryGlyph kind={item.kind} />
                    </div>
                    <p
                      style={{
                        margin: "0 0 0.2rem",
                        fontSize: "0.76rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(248,245,236,0.66)",
                        fontWeight: 700,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.02rem",
                        lineHeight: 1.1,
                        letterSpacing: "-0.03em",
                        fontWeight: 700,
                      }}
                    >
                      {item.value}
                    </p>
                    <p
                      style={{
                        margin: "0.45rem 0 0",
                        color: "rgba(248,245,236,0.68)",
                        lineHeight: 1.5,
                        fontSize: "0.88rem",
                      }}
                    >
                      {item.copy}
                    </p>
                  </article>
                ))}
              </div>

              <article
                style={{
                  marginTop: "0.9rem",
                  borderRadius: "24px",
                  padding: "1rem",
                  background:
                    "linear-gradient(180deg, rgba(248, 250, 244, 0.96), rgba(243, 238, 226, 0.94))",
                  border: "1px solid rgba(207, 216, 199, 0.9)",
                  color: "#243424",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.35rem",
                    fontSize: "0.76rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#697867",
                    fontWeight: 700,
                  }}
                >
                  What comes back
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.6rem",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    color: "#203126",
                  }}
                >
                  Bloom. Buzz. Birds. Shelter.
                </h3>
                <p style={{ margin: "0.55rem 0 0", color: "#556451", lineHeight: 1.6 }}>
                  {goalPreviewCopy[goal]}
                </p>
              </article>
            </aside>
          </div>
        </section>

      </div>

      <style jsx>{`
        .fade-up {
          animation: fadeUp 700ms ease-out both;
        }

        .delay-2 {
          animation-delay: 120ms;
        }

        .delay-3 {
          animation-delay: 180ms;
        }

        .delay-4 {
          animation-delay: 240ms;
        }

        .delay-5 {
          animation-delay: 300ms;
        }

        .float-slow {
          animation: drift 11s ease-in-out infinite;
        }

        .float-delayed {
          animation: drift 13s ease-in-out infinite;
          animation-delay: 1.4s;
        }

        .cta-pop {
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            filter 180ms ease;
        }

        .cta-pop:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 40px rgba(15, 24, 17, 0.24);
          filter: saturate(1.02);
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

        @keyframes drift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 720px) {
          main {
            overflow-x: clip;
          }

          .page-shell {
            padding: 1.1rem 0.9rem 3rem !important;
          }

          .planner-section {
            border-radius: 28px !important;
            padding: 1.15rem !important;
          }

          .hero-gallery-grid {
            grid-template-columns: 1fr !important;
          }

          .hero-scene-main {
            min-height: 340px !important;
          }

          .hero-scene-stack {
            grid-template-rows: none !important;
          }

          .hero-scene {
            min-height: 210px !important;
          }

          .planner-body,
          .planner-form-grid {
            grid-template-columns: 1fr !important;
          }

          .planner-location-row,
          .planner-location-inline {
            flex-direction: column !important;
          }

          .planner-location-inline button {
            width: 100% !important;
          }

          .planner-choice-grid {
            grid-template-columns: 1fr !important;
          }

          .planner-impact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
