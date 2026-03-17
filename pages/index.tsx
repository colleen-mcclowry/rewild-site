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
  const [showZip, setShowZip] = useState(false);
  const [sun, setSun] = useState<SunPreference>("full-sun");
  const [space, setSpace] = useState<SpacePreference>("small-patch");
  const [goal, setGoal] = useState<GoalPreference>("pollinators");
  const [activeStep, setActiveStep] = useState(0);
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
      setShowZip(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(buildPlanUrl({ lat: String(latitude), lon: String(longitude) }));
      },
      () => {
        alert("We couldn't access your location. Please enter your ZIP instead.");
        setShowZip(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
      }
    );
  };

  const onboardingSteps = ["Light", "Space", "What matters most"] as const;

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
            Tell us about your space. We&apos;ll turn it into a simple, personalized
            conservation plan.
          </p>
        </section>

        <section
          className="fade-up delay-2"
          style={{
            marginTop: "1rem",
            borderRadius: "40px",
            padding: "2rem 1.5rem",
            background:
              "linear-gradient(180deg, rgba(248, 246, 239, 0.9), rgba(241, 245, 234, 0.88))",
            border: "1px solid rgba(125, 146, 108, 0.14)",
            boxShadow: "0 24px 44px rgba(59, 79, 44, 0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 auto auto 50%",
              width: "46rem",
              height: "22rem",
              transform: "translateX(-50%)",
              borderRadius: "999px",
              background:
                "radial-gradient(circle, rgba(172, 198, 156, 0.18) 0%, rgba(172, 198, 156, 0.06) 36%, transparent 72%)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                textAlign: "center",
                maxWidth: "42rem",
                margin: "0 auto",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.6rem",
                  fontSize: "0.82rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#697867",
                  fontWeight: 700,
                }}
              >
                What is rewilding?
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(2.35rem, 6vw, 4.7rem)",
                  lineHeight: 0.93,
                  letterSpacing: "-0.07em",
                  color: "#203126",
                  textWrap: "balance",
                }}
              >
                Nature knows how to heal.
              </h2>
              <p
                style={{
                  margin: "1rem auto 0",
                  maxWidth: "34rem",
                  fontSize: "1.05rem",
                  lineHeight: 1.72,
                  color: "#556451",
                }}
              >
                Rewilding gives it the space. Replace a little lawn with native life,
                and the ecosystem starts rebuilding itself.
              </p>
            </div>

            <div
              style={{
                marginTop: "1.8rem",
                borderRadius: "32px",
                padding: "1.25rem",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(214, 221, 208, 0.9)",
                boxShadow: "0 12px 36px rgba(32, 49, 38, 0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "stretch",
                  justifyContent: "center",
                  gap: "0.9rem",
                }}
              >
                {[
                  {
                    kind: "leaf" as const,
                    title: "Replace lawn with life",
                    copy: "Native plants create habitat where it was missing.",
                  },
                  {
                    kind: "bee" as const,
                    title: "Pollinators return",
                    copy: "Bees and butterflies find food again.",
                  },
                  {
                    kind: "bird" as const,
                    title: "The web of life grows",
                    copy: "Insects support birds, shelter, and seasonal cycles.",
                  },
                  {
                    kind: "globe" as const,
                    title: "Ecosystems get stronger",
                    copy: "Healthier soil, water, and resilience build over time.",
                  },
                ].map((item, index, items) => (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      flex: "1 1 210px",
                      minWidth: "210px",
                      maxWidth: "250px",
                    }}
                  >
                    <article
                      style={{
                        flex: 1,
                        minHeight: "100%",
                        borderRadius: "26px",
                        padding: "1rem",
                        background:
                          "linear-gradient(180deg, rgba(248, 250, 244, 0.96), rgba(243, 238, 226, 0.94))",
                        border: "1px solid rgba(207, 216, 199, 0.9)",
                      }}
                    >
                      <div
                        style={{
                          width: "3rem",
                          height: "3rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "999px",
                          background: "rgba(221, 232, 214, 0.92)",
                          marginBottom: "0.8rem",
                        }}
                      >
                        <StoryGlyph kind={item.kind} />
                      </div>
                      <h3
                        style={{
                          margin: "0 0 0.45rem",
                          fontSize: "1.18rem",
                          lineHeight: 1.05,
                          letterSpacing: "-0.04em",
                          color: "#223425",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p style={{ margin: 0, color: "#5a6856", lineHeight: 1.55 }}>
                        {item.copy}
                      </p>
                    </article>

                    {index < items.length - 1 ? (
                      <div
                        aria-hidden="true"
                        style={{
                          width: "2.4rem",
                          height: "2.4rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "999px",
                          background: "rgba(233, 238, 226, 0.9)",
                          color: "#7b8d74",
                          fontSize: "1.25rem",
                          flexShrink: 0,
                        }}
                      >
                        →
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="fade-up delay-3"
          style={{
            marginTop: "0.95rem",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
            gap: "0.95rem",
          }}
        >
          <article
            style={{
              borderRadius: "30px",
              padding: "1.6rem",
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(125, 146, 108, 0.14)",
              boxShadow: "0 16px 34px rgba(59, 79, 44, 0.05)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.82rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#697867",
                fontWeight: 700,
              }}
            >
              Why it matters
            </p>
            <h3
              style={{
                margin: 0,
                fontSize: "clamp(2rem, 4.6vw, 3.6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
                color: "#203126",
                textWrap: "balance",
              }}
            >
              Biodiversity starts in small places.
            </h3>
            <p
              style={{
                margin: "1rem 0 0",
                maxWidth: "34rem",
                color: "#556451",
                lineHeight: 1.72,
                fontSize: "1.02rem",
              }}
            >
              Even a modest patch of native planting can feed insects, support birds,
              and help restore the relationships that keep ecosystems stable.
            </p>
          </article>

          <article
            style={{
              borderRadius: "30px",
              padding: "1.6rem",
              background:
                "linear-gradient(180deg, rgba(231, 238, 224, 0.98), rgba(246, 241, 229, 0.98))",
              border: "1px solid rgba(125, 146, 108, 0.16)",
              boxShadow: "0 14px 28px rgba(59, 79, 44, 0.05)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.82rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#677564",
                fontWeight: 700,
              }}
            >
              The big idea
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.6rem",
                lineHeight: 1.12,
                letterSpacing: "-0.05em",
                color: "#213224",
                fontWeight: 700,
              }}
            >
              A backyard does not have to be large to become habitat.
            </p>
            <p
              style={{
                margin: "0.95rem 0 0",
                color: "#576653",
                lineHeight: 1.65,
              }}
            >
              Rewilding is not about perfection. It is about making room for life to
              return, one patch at a time.
            </p>
          </article>
        </section>

        <section
          className="fade-up delay-4"
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
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div>
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
                  fontSize: "1.9rem",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}
              >
                Three quick choices, then your plan
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.7rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={handleLocation}
                className="cta-pop"
                style={{
                  padding: "0.9rem 1.3rem",
                  fontSize: "0.98rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: "#f3ddaf",
                  color: "#213426",
                  cursor: "pointer",
                  boxShadow: "0 18px 36px rgba(15, 24, 17, 0.18)",
                }}
              >
                Use my location
              </button>

              <button
                type="button"
                onClick={() => setShowZip((current) => !current)}
                style={{
                  padding: "0.9rem 1.2rem",
                  fontSize: "0.96rem",
                  fontWeight: 600,
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#f8f5ec",
                  cursor: "pointer",
                }}
              >
                {showZip ? "Hide ZIP" : "Enter ZIP instead"}
              </button>
            </div>
          </div>

          {showZip && (
            <section
              style={{
                marginBottom: "1rem",
                borderRadius: "24px",
                padding: "1.1rem",
                background:
                  "linear-gradient(135deg, rgba(249, 238, 209, 0.96), rgba(244, 226, 185, 0.92))",
                border: "1px solid rgba(192, 160, 101, 0.22)",
                boxShadow: "0 18px 34px rgba(126, 97, 44, 0.12)",
                color: "#2c2b21",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.4rem",
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#7a6332",
                  fontWeight: 700,
                }}
              >
                ZIP fallback
              </p>
              <p
                style={{
                  margin: "0 0 0.8rem",
                  color: "#62573a",
                  lineHeight: 1.55,
                }}
              >
                Prefer typing your location? Start with your ZIP and we&apos;ll build the same
                personalized plan from there.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <input
                  placeholder="60302"
                  value={zip}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setZip(value);

                    if (value.length === 5) {
                      goWithZip(value);
                    }
                  }}
                  style={{
                    padding: "0.9rem 1rem",
                    fontSize: "1rem",
                    borderRadius: "16px",
                    border: "1px solid rgba(192, 160, 101, 0.3)",
                    width: "220px",
                    background: "rgba(255,255,255,0.9)",
                    color: "#213224",
                    outline: "none",
                  }}
                />
                <p style={{ margin: 0, color: "#62573a", lineHeight: 1.55 }}>
                  Great if you want to browse without enabling geolocation.
                </p>
              </div>
            </section>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.55rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            {onboardingSteps.map((step, index) => {
              const isActive = index === activeStep;

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  style={{
                    borderRadius: "999px",
                    border: isActive
                      ? "1px solid rgba(243, 221, 175, 0.9)"
                      : "1px solid rgba(255,255,255,0.14)",
                    background: isActive
                      ? "rgba(243, 221, 175, 0.18)"
                      : "rgba(255,255,255,0.08)",
                    color: "#f8f5ec",
                    padding: "0.58rem 0.9rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {step}
                </button>
              );
            })}
          </div>

          <section
            style={{
              borderRadius: "28px",
              padding: "1rem",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
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
              {onboardingSteps[activeStep]}
            </p>
            <p
              style={{
                margin: "0 0 0.9rem",
                color: "rgba(248,245,236,0.74)",
                lineHeight: 1.55,
              }}
            >
              {activeStep === 0
                ? "Choose the kind of light your planting area gets most often."
                : activeStep === 1
                  ? "Pick the scale that feels closest to the patch you want to start with."
                  : "Tell Rewild what you want this first planting to do best."}
            </p>

            {activeStep === 0 && (
              <div
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
                        boxShadow: isActive ? "0 12px 26px rgba(19, 29, 21, 0.16)" : "none",
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
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{option.label}</div>
                      <div style={{ fontSize: "0.88rem", opacity: 0.78, lineHeight: 1.45 }}>
                        {option.notes}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeStep === 1 && (
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
                        boxShadow: isActive ? "0 12px 26px rgba(19, 29, 21, 0.16)" : "none",
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{option.label}</div>
                      <div style={{ fontSize: "0.9rem", opacity: 0.8, lineHeight: 1.5 }}>
                        {option.notes}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeStep === 2 && (
              <div
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
                        boxShadow: isActive ? "0 12px 26px rgba(19, 29, 21, 0.16)" : "none",
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{option.label}</div>
                      <div style={{ fontSize: "0.88rem", opacity: 0.8, lineHeight: 1.45 }}>
                        {option.notes}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.8rem",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
                disabled={activeStep === 0}
                style={{
                  padding: "0.82rem 1rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: activeStep === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
                  color: activeStep === 0 ? "rgba(248,245,236,0.38)" : "#f8f5ec",
                  cursor: activeStep === 0 ? "default" : "pointer",
                }}
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setActiveStep((step) => Math.min(onboardingSteps.length - 1, step + 1))}
                disabled={activeStep === onboardingSteps.length - 1}
                style={{
                  padding: "0.82rem 1rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background:
                    activeStep === onboardingSteps.length - 1
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    activeStep === onboardingSteps.length - 1
                      ? "rgba(248,245,236,0.38)"
                      : "#f8f5ec",
                  cursor: activeStep === onboardingSteps.length - 1 ? "default" : "pointer",
                  marginLeft: "auto",
                }}
              >
                Next
              </button>
            </div>
          </section>

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

          section[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }

          section[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }

          section[style*="grid-template-columns: minmax(0, 1.05fr)"] {
            grid-template-columns: 1fr !important;
          }

          section[style*="grid-template-columns: minmax(0, 1.15fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
