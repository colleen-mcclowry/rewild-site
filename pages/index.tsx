import Image from "next/image";
import { useEffect, useState } from "react";
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

const goalPreviewCopy: Record<GoalPreference, string> = {
  pollinators: "Start with bloom and nectar, and the insect activity follows.",
  "low-maintenance": "Start with a forgiving patch that feels lighter to care for over time.",
  "bird-habitat": "Start with layered shelter, seed, and more reasons for birds to stay.",
  color: "Start with a brighter patch that still works hard for habitat.",
};

const goalPreviewLabels: Record<GoalPreference, string> = {
  pollinators: "Food first",
  "low-maintenance": "Ease first",
  "bird-habitat": "Shelter first",
  color: "Color first",
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

export default function Home() {
  const [zip, setZip] = useState("");
  const [sun, setSun] = useState<SunPreference>("full-sun");
  const [space, setSpace] = useState<SpacePreference>("small-patch");
  const [goal, setGoal] = useState<GoalPreference>("pollinators");
  const [plannerStep, setPlannerStep] = useState(0);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPlannerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPlannerOpen]);

  const hasZip = zip.length === 5;
  const hasLocation = hasZip || Boolean(geoCoords);
  const locationSummary = geoCoords ? "Current location" : hasZip ? `ZIP ${zip}` : "Choose patch";

  const buildPlanUrl = () => {
    const search = new URLSearchParams({
      sun,
      space,
      goal,
    });

    if (geoCoords) {
      search.set("lat", geoCoords.lat);
      search.set("lon", geoCoords.lon);
    } else if (hasZip) {
      search.set("zip", zip);
    }

    return `/plan?${search.toString()}`;
  };

  const openPlanner = () => {
    setLocationError(null);
    setPlannerStep(hasLocation ? 1 : 0);
    setIsPlannerOpen(true);
  };

  const closePlanner = () => {
    setIsPlannerOpen(false);
    setIsLocating(false);
    setLocationError(null);
  };

  const handleZipChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setZip(cleaned);
    setGeoCoords(null);
    setLocationError(null);
  };

  const handleLocation = () => {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't available here. Enter a ZIP instead.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoCoords({ lat: String(latitude), lon: String(longitude) });
        setZip("");
        setIsLocating(false);
        setPlannerStep(1);
      },
      () => {
        setIsLocating(false);
        setLocationError("We couldn't access your location. Enter a ZIP instead.");
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
      }
    );
  };

  const goToNextPlannerStep = () => {
    if (plannerStep === 0) {
      if (!hasLocation) {
        setLocationError("Choose your current location or enter a 5-digit ZIP.");
        return;
      }

      setLocationError(null);
      setPlannerStep(1);
      return;
    }

    if (plannerStep === 3) {
      closePlanner();
      router.push(buildPlanUrl());
      return;
    }

    setPlannerStep((current) => Math.min(current + 1, 3));
  };

  const goToPreviousPlannerStep = () => {
    setLocationError(null);
    setPlannerStep((current) => Math.max(current - 1, 0));
  };

  const selectedSun = sunOptions.find((option) => option.value === sun) ?? sunOptions[0];
  const selectedSpace = spaceOptions.find((option) => option.value === space) ?? spaceOptions[0];
  const selectedGoal = goalOptions.find((option) => option.value === goal) ?? goalOptions[0];
  const plannerFlowSteps = [
    {
      step: "Patch",
      title: "Where is the patch?",
      description: "We only use this to localize the plant list.",
      value: locationSummary,
    },
    {
      step: "Light",
      title: "How much light?",
      description: "Pick the light this patch gets most often.",
      value: selectedSun.label,
    },
    {
      step: "Size",
      title: "How much space?",
      description: "Choose a size that feels realistic for your first patch.",
      value: selectedSpace.label,
    },
    {
      step: "Focus",
      title: "What do you want back most?",
      description: "Choose the outcome you want this planting to lead with.",
      value: selectedGoal.label,
    },
  ] as const;
  const currentPlannerStep = plannerFlowSteps[plannerStep];
  const plannerPreviewTags = [
    hasLocation ? locationSummary : null,
    selectedSun.label,
    selectedSpace.label,
    `${selectedGoal.label} focus`,
  ].filter((item): item is string => Boolean(item));
  const plannerPrimaryActionLabel =
    plannerStep === 0
      ? "Continue to light"
      : plannerStep === 1
        ? "Continue to size"
        : plannerStep === 2
          ? "Continue to focus"
          : "Build my plan";

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
              gridTemplateColumns: "1fr",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            <section
              className="planner-form-panel"
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
                    fontSize: "clamp(2rem, 4vw, 2.9rem)",
                    lineHeight: 0.96,
                    letterSpacing: "-0.06em",
                    maxWidth: "26rem",
                  }}
                >
                  A guided start for one living patch.
                </h2>
                <p
                  style={{
                    margin: "0.6rem 0 0",
                    color: "rgba(248,245,236,0.76)",
                    lineHeight: 1.65,
                    maxWidth: "38rem",
                  }}
                >
                  No giant form. No guessing. Just a quick guided flow that turns a
                  real patch into a local mix, starter layout, and weekend plan.
                </p>
              </div>

              <div
                className="planner-intro-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.15fr) minmax(260px, 0.85fr)",
                  gap: "0.85rem",
                  alignItems: "stretch",
                }}
              >
                <article
                  style={{
                    borderRadius: "26px",
                    padding: "1.1rem",
                    background:
                      "linear-gradient(180deg, rgba(243, 221, 175, 0.16), rgba(255,255,255,0.05))",
                    border: "1px solid rgba(243, 221, 175, 0.22)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.76rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(248,245,236,0.58)",
                      fontWeight: 700,
                    }}
                  >
                    Guided planner
                  </p>
                  <h3
                    style={{
                      margin: "0.45rem 0 0",
                      fontSize: "1.9rem",
                      lineHeight: 0.96,
                      letterSpacing: "-0.05em",
                      maxWidth: "24rem",
                    }}
                  >
                    {hasLocation ? "Continue where you left off." : "Start with the patch."}
                  </h3>
                  <p
                    style={{
                      margin: "0.7rem 0 0",
                      color: "rgba(248,245,236,0.8)",
                      lineHeight: 1.62,
                      maxWidth: "29rem",
                    }}
                  >
                    {hasLocation
                      ? "Your answers are already here. Open the guide, tweak the feel, and build the full plan."
                      : "We’ll walk through location, light, size, and the kind of life you want back most."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.55rem",
                      marginTop: "0.9rem",
                    }}
                  >
                    {["~30 seconds", "4 quick choices", "Build when ready"].map((item) => (
                      <span
                        key={item}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          padding: "0.42rem 0.68rem",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#f8f5ec",
                          fontSize: "0.84rem",
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div
                    className="planner-launch-row"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.7rem",
                      alignItems: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={openPlanner}
                      className="cta-pop planner-open-button"
                      style={{
                        padding: "1rem 1.25rem",
                        fontSize: "1rem",
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
                      {hasLocation ? "Continue guided plan" : "Start guided plan"}
                    </button>
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(248,245,236,0.68)",
                        lineHeight: 1.45,
                        fontSize: "0.92rem",
                      }}
                    >
                      One question at a time, then straight into the plan.
                    </p>
                  </div>
                </article>

                <article
                  style={{
                    borderRadius: "26px",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.76rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(248,245,236,0.56)",
                      fontWeight: 700,
                    }}
                  >
                    How it unfolds
                  </p>
                  <div
                    className="planner-journey-grid"
                    style={{
                      display: "grid",
                      gap: "0.65rem",
                      marginTop: "0.75rem",
                    }}
                  >
                    {[
                      {
                        step: "1",
                        title: "Place the patch",
                        copy: "Use location or ZIP so the plant list fits where you are.",
                      },
                      {
                        step: "2",
                        title: "Shape the conditions",
                        copy: "Pick the light and a size that feels realistic right now.",
                      },
                      {
                        step: "3",
                        title: "Lead with a goal",
                        copy: "Choose food, shelter, ease, or color as the first move.",
                      },
                      {
                        step: "4",
                        title: "Build the plan",
                        copy: "Get the mix, layout, weekend checklist, and first-season care.",
                      },
                    ].map((item) => (
                      <article
                        key={item.step}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2.2rem minmax(0, 1fr)",
                          gap: "0.75rem",
                          alignItems: "start",
                        }}
                      >
                        <div
                          style={{
                            width: "2.2rem",
                            height: "2.2rem",
                            borderRadius: "999px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(243, 221, 175, 0.16)",
                            color: "#f3ddaf",
                            fontWeight: 700,
                          }}
                        >
                          {item.step}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              color: "#f8f5ec",
                              fontWeight: 700,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {item.title}
                          </p>
                          <p
                            style={{
                              margin: "0.25rem 0 0",
                              color: "rgba(248,245,236,0.7)",
                              lineHeight: 1.5,
                            }}
                          >
                            {item.copy}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              </div>

              <article
                style={{
                  marginTop: "1rem",
                  borderRadius: "24px",
                  padding: "1rem",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.76rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(248,245,236,0.56)",
                    fontWeight: 700,
                  }}
                >
                  Current direction
                </p>
                <h3
                  style={{
                    margin: "0.4rem 0 0",
                    fontSize: "1.55rem",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {goalPreviewLabels[goal]}
                </h3>
                <p
                  style={{
                    margin: "0.55rem 0 0",
                    color: "rgba(248,245,236,0.78)",
                    lineHeight: 1.6,
                    maxWidth: "40rem",
                  }}
                >
                  {goalPreviewCopy[goal]}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.55rem",
                    marginTop: "0.9rem",
                  }}
                >
                  {plannerPreviewTags.map((item) => (
                    <span
                      key={item}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: "999px",
                        padding: "0.42rem 0.68rem",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#f8f5ec",
                        fontSize: "0.84rem",
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>

              <div style={{ marginTop: "1rem" }}>
                <p
                  style={{
                    margin: "0 0 0.55rem",
                    fontSize: "0.76rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(248,245,236,0.56)",
                    fontWeight: 700,
                  }}
                >
                  Your patch so far
                </p>
                <div
                  className="planner-summary-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "0.65rem",
                  }}
                >
                  {plannerFlowSteps.map((item, index) => {
                    const isLocationStep = index === 0;
                    const isPending = isLocationStep && !hasLocation;

                    return (
                      <article
                        key={item.step}
                        style={{
                          borderRadius: "18px",
                          padding: "0.8rem 0.9rem",
                          background: isPending
                            ? "rgba(243, 221, 175, 0.12)"
                            : "rgba(255,255,255,0.06)",
                          border: isPending
                            ? "1px solid rgba(243, 221, 175, 0.28)"
                            : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.72rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(248,245,236,0.58)",
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}. {item.step}
                        </p>
                        <p
                          style={{
                            margin: "0.32rem 0 0",
                            fontSize: "1rem",
                            lineHeight: 1.15,
                            color: "#f8f5ec",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {item.value}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div
                className="planner-output-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: "0.65rem",
                  marginTop: "1rem",
                }}
              >
                {[
                  {
                    label: "Local mix",
                    copy: "Plants tuned to your patch and region.",
                  },
                  {
                    label: "Simple layout",
                    copy: "A starting arrangement you can actually plant.",
                  },
                  {
                    label: "Weekend steps",
                    copy: "Buying guide and first-season care.",
                  },
                ].map((item) => (
                  <article
                    key={item.label}
                    style={{
                      borderRadius: "20px",
                      padding: "0.95rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.74rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(248,245,236,0.56)",
                        fontWeight: 700,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        margin: "0.42rem 0 0",
                        color: "#f8f5ec",
                        lineHeight: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {item.copy}
                    </p>
                  </article>
                ))}
              </div>

              <p
                style={{
                  margin: "0.95rem 0 0",
                  color: "rgba(248,245,236,0.62)",
                  lineHeight: 1.55,
                  fontSize: "0.92rem",
                }}
              >
                You can still refine the mix on the next screen without losing your
                location.
              </p>
            </section>
          </div>
        </section>

        {isPlannerOpen ? (
          <div
            className="planner-modal-backdrop"
            onClick={closePlanner}
            role="presentation"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(13, 18, 14, 0.52)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <div
              className="planner-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="planner-modal-title"
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "min(780px, 100%)",
                maxHeight: "calc(100vh - 2rem)",
                overflow: "auto",
                borderRadius: "32px",
                padding: "1.1rem",
                background:
                  "linear-gradient(180deg, rgba(25, 43, 31, 0.98), rgba(49, 79, 50, 0.96))",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 34px 90px rgba(12, 20, 15, 0.34)",
                color: "#f8f5ec",
              }}
            >
              <div
                className="planner-modal-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.76rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(248,245,236,0.58)",
                      fontWeight: 700,
                    }}
                  >
                    Guided planner
                  </p>
                  <p
                    style={{
                      margin: "0.45rem 0 0",
                      color: "rgba(248,245,236,0.58)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Step {plannerStep + 1} of {plannerFlowSteps.length}
                  </p>
                  <h3
                    id="planner-modal-title"
                    style={{
                      margin: "0.35rem 0 0",
                      fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {currentPlannerStep.title}
                  </h3>
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: "rgba(248,245,236,0.76)",
                      lineHeight: 1.6,
                      maxWidth: "32rem",
                    }}
                  >
                    {currentPlannerStep.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePlanner}
                  aria-label="Close guided planner"
                  style={{
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#f8f5ec",
                    width: "2.7rem",
                    height: "2.7rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "1.15rem",
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <div
                className="planner-modal-progress"
                style={{
                  display: "grid",
                  gap: "0.7rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  className="planner-modal-progress-track"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: "0.45rem",
                  }}
                >
                  {plannerFlowSteps.map((item, index) => {
                    const isActive = index === plannerStep;
                    const isComplete = index < plannerStep || (index === 0 && hasLocation);

                    return (
                      <span
                        key={item.step}
                        style={{
                          display: "block",
                          height: "0.5rem",
                          borderRadius: "999px",
                          background: isActive || isComplete
                            ? "#f3ddaf"
                            : "rgba(255,255,255,0.12)",
                          boxShadow: isActive
                            ? "0 0 0 1px rgba(243, 221, 175, 0.22)"
                            : "none",
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.45rem",
                  }}
                >
                  {plannerFlowSteps.map((item, index) => {
                    const isActive = index === plannerStep;
                    const isComplete = index < plannerStep || (index === 0 && hasLocation);

                    return (
                      <span
                        key={item.step}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          borderRadius: "999px",
                          padding: "0.38rem 0.62rem",
                          background: isActive
                            ? "rgba(243, 221, 175, 0.16)"
                            : "rgba(255,255,255,0.05)",
                          border: isActive
                            ? "1px solid rgba(243, 221, 175, 0.28)"
                            : "1px solid rgba(255,255,255,0.08)",
                          color: isActive || isComplete
                            ? "#f8f5ec"
                            : "rgba(248,245,236,0.56)",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        <span>{index + 1}.</span>
                        <span>{item.step}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                {plannerStep === 0 ? (
                  <div
                    className="planner-modal-option-grid planner-modal-option-grid-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.8rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleLocation}
                      disabled={isLocating}
                      style={{
                        textAlign: "left",
                        borderRadius: "24px",
                        padding: "1rem",
                        border: geoCoords
                          ? "1px solid rgba(243, 221, 175, 0.34)"
                          : "1px solid rgba(255,255,255,0.12)",
                        background: geoCoords
                          ? "linear-gradient(180deg, rgba(243, 221, 175, 0.18), rgba(255,255,255,0.06))"
                          : "rgba(255,255,255,0.05)",
                        color: "#f8f5ec",
                        cursor: isLocating ? "progress" : "pointer",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.72rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(248,245,236,0.56)",
                          fontWeight: 700,
                        }}
                      >
                        Fastest route
                      </p>
                      <h4
                        style={{
                          margin: "0.42rem 0 0",
                          fontSize: "1.35rem",
                          lineHeight: 1.02,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {isLocating
                          ? "Finding your patch..."
                          : geoCoords
                            ? "Using current location"
                            : "Use current location"}
                      </h4>
                      <p
                        style={{
                          margin: "0.55rem 0 0",
                          color: "rgba(248,245,236,0.76)",
                          lineHeight: 1.55,
                        }}
                      >
                        Let the planner localize the plant list from where the patch
                        actually is.
                      </p>
                    </button>

                    <div
                      style={{
                        borderRadius: "24px",
                        padding: "1rem",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.72rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(248,245,236,0.56)",
                          fontWeight: 700,
                        }}
                      >
                        Manual option
                      </p>
                      <label
                        htmlFor="planner-zip"
                        style={{
                          display: "block",
                          marginTop: "0.42rem",
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        Enter ZIP
                      </label>
                      <input
                        id="planner-zip"
                        value={zip}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="5-digit ZIP"
                        onChange={(event) => handleZipChange(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && hasZip) {
                            event.preventDefault();
                            goToNextPlannerStep();
                          }
                        }}
                        style={{
                          width: "100%",
                          marginTop: "0.7rem",
                          padding: "0.95rem 1rem",
                          borderRadius: "18px",
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(255,255,255,0.08)",
                          color: "#f8f5ec",
                          fontSize: "1rem",
                          outline: "none",
                        }}
                      />
                      <p
                        style={{
                          margin: "0.55rem 0 0",
                          color: "rgba(248,245,236,0.72)",
                          lineHeight: 1.55,
                        }}
                      >
                        Best if you know the ZIP where the patch sits. Continue once
                        it looks right.
                      </p>
                    </div>
                  </div>
                ) : null}

                {plannerStep === 1 ? (
                  <div
                    className="planner-modal-option-grid planner-modal-option-grid-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))",
                      gap: "0.75rem",
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
                            borderRadius: "22px",
                            padding: "1rem",
                            border: isActive
                              ? "1px solid rgba(243, 221, 175, 0.34)"
                              : "1px solid rgba(255,255,255,0.12)",
                            background: isActive
                              ? "linear-gradient(180deg, rgba(243, 221, 175, 0.18), rgba(255,255,255,0.06))"
                              : "rgba(255,255,255,0.05)",
                            color: "#f8f5ec",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "2.7rem",
                              height: "2.7rem",
                              borderRadius: "999px",
                              background: isActive
                                ? "rgba(243, 221, 175, 0.18)"
                                : "rgba(255,255,255,0.08)",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <LightIcon type={option.value} />
                          </div>
                          <div style={{ fontWeight: 700, fontSize: "1.02rem" }}>
                            {option.label}
                          </div>
                          <p
                            style={{
                              margin: "0.42rem 0 0",
                              color: "rgba(248,245,236,0.74)",
                              lineHeight: 1.55,
                            }}
                          >
                            {option.notes}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {plannerStep === 2 ? (
                  <div
                    className="planner-modal-option-grid planner-modal-option-grid-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {spaceOptions.map((option) => {
                      const isActive = option.value === space;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSpace(option.value)}
                          style={{
                            textAlign: "left",
                            borderRadius: "22px",
                            padding: "1rem",
                            border: isActive
                              ? "1px solid rgba(243, 221, 175, 0.34)"
                              : "1px solid rgba(255,255,255,0.12)",
                            background: isActive
                              ? "linear-gradient(180deg, rgba(243, 221, 175, 0.18), rgba(255,255,255,0.06))"
                              : "rgba(255,255,255,0.05)",
                            color: "#f8f5ec",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: "1.02rem" }}>
                            {option.label}
                          </div>
                          <p
                            style={{
                              margin: "0.48rem 0 0",
                              color: "rgba(248,245,236,0.74)",
                              lineHeight: 1.55,
                            }}
                          >
                            {option.notes}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {plannerStep === 3 ? (
                  <div
                    className="planner-modal-option-grid planner-modal-option-grid-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.75rem",
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
                            borderRadius: "22px",
                            padding: "1rem",
                            border: isActive
                              ? "1px solid rgba(243, 221, 175, 0.34)"
                              : "1px solid rgba(255,255,255,0.12)",
                            background: isActive
                              ? "linear-gradient(180deg, rgba(243, 221, 175, 0.18), rgba(255,255,255,0.06))"
                              : "rgba(255,255,255,0.05)",
                            color: "#f8f5ec",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: "1.02rem" }}>
                            {option.label}
                          </div>
                          <p
                            style={{
                              margin: "0.48rem 0 0",
                              color: "rgba(248,245,236,0.74)",
                              lineHeight: 1.55,
                            }}
                          >
                            {option.notes}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <article
                style={{
                  marginTop: "0.95rem",
                  borderRadius: "22px",
                  padding: "0.95rem 1rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(248,245,236,0.56)",
                    fontWeight: 700,
                  }}
                >
                  Current choice
                </p>
                <p
                  style={{
                    margin: "0.35rem 0 0",
                    color: "#f8f5ec",
                    lineHeight: 1.55,
                  }}
                >
                  <strong>{currentPlannerStep.value}</strong>
                  {plannerStep === 1 ? `. ${selectedSun.notes}` : null}
                  {plannerStep === 2 ? `. ${selectedSpace.notes}` : null}
                  {plannerStep === 3 ? `. ${selectedGoal.notes}` : null}
                  {plannerStep === 0 && hasLocation
                    ? ". This is the patch we will localize the plant list for."
                    : null}
                </p>
              </article>

              {locationError ? (
                <p
                  style={{
                    margin: "0.85rem 0 0",
                    color: "#f3ddaf",
                    lineHeight: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {locationError}
                </p>
              ) : null}

              <div
                className="planner-modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.8rem",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={plannerStep === 0 ? closePlanner : goToPreviousPlannerStep}
                  style={{
                    padding: "0.95rem 1rem",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#f8f5ec",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {plannerStep === 0 ? "Close" : "Back"}
                </button>

                <button
                  type="button"
                  onClick={goToNextPlannerStep}
                  disabled={plannerStep === 0 && (!hasLocation || isLocating)}
                  style={{
                    padding: "0.95rem 1.15rem",
                    borderRadius: "18px",
                    border: "none",
                    background:
                      plannerStep === 0 && (!hasLocation || isLocating)
                        ? "rgba(255,255,255,0.08)"
                        : "#f3ddaf",
                    color:
                      plannerStep === 0 && (!hasLocation || isLocating)
                        ? "rgba(248,245,236,0.42)"
                        : "#213426",
                    fontWeight: 700,
                    cursor:
                      plannerStep === 0 && (!hasLocation || isLocating)
                        ? "default"
                        : "pointer",
                    boxShadow:
                      plannerStep === 0 && (!hasLocation || isLocating)
                        ? "none"
                        : "0 18px 36px rgba(15, 24, 17, 0.18)",
                  }}
                >
                  {plannerPrimaryActionLabel}
                </button>
              </div>
            </div>
          </div>
        ) : null}

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

          .planner-form-panel,
          .planner-modal {
            border-radius: 24px !important;
            padding: 1rem !important;
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

          .planner-launch-row,
          .planner-modal-header,
          .planner-modal-footer {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .planner-open-button {
            width: 100% !important;
          }

          .planner-intro-grid {
            grid-template-columns: 1fr !important;
          }

          .planner-modal-backdrop {
            padding: 0.7rem !important;
            align-items: flex-end !important;
          }

          .planner-modal {
            width: 100% !important;
            max-height: calc(100vh - 0.7rem) !important;
          }

          .planner-modal-option-grid-2,
          .planner-modal-option-grid-3,
          .planner-summary-grid,
          .planner-output-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 560px) {
          .planner-modal-progress-track {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .planner-section,
          .planner-modal {
            padding: 0.95rem !important;
          }
        }
      `}</style>
    </main>
  );
}
