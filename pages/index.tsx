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
    label: "Part shade",
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

export default function Home() {
  const [zip, setZip] = useState("");
  const [showZip, setShowZip] = useState(false);
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

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily:
          '"Avenir Next", Avenir, Montserrat, "Segoe UI", "Helvetica Neue", sans-serif',
        background:
          "radial-gradient(circle at top left, rgba(219, 233, 209, 0.98), transparent 30%), radial-gradient(circle at 84% 14%, rgba(246, 225, 188, 0.72), transparent 22%), linear-gradient(180deg, #f3efe4 0%, #fbf8f2 50%, #f4f6ee 100%)",
        color: "#1c2d22",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "980px",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 4rem",
        }}
      >
        <div
          aria-hidden="true"
          className="float-slow"
          style={{
            position: "absolute",
            top: "3.5rem",
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
            top: "8rem",
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
            position: "relative",
            borderRadius: "38px",
            padding: "2rem",
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
              inset: "auto -5rem -5rem auto",
              width: "15rem",
              height: "15rem",
              borderRadius: "999px",
              background: "rgba(246, 210, 146, 0.1)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "1.2rem",
              right: "1.2rem",
              width: "19rem",
              height: "13rem",
              opacity: 0.95,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 auto auto 0",
                width: "10rem",
                height: "6.5rem",
                borderRadius: "70% 30% 65% 35% / 55% 35% 65% 45%",
                background: "rgba(164, 194, 124, 0.28)",
                transform: "rotate(-10deg)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "1.8rem",
                left: "4rem",
                width: "11rem",
                height: "6rem",
                borderRadius: "43% 57% 34% 66% / 49% 36% 64% 51%",
                background: "rgba(230, 189, 116, 0.26)",
                transform: "rotate(9deg)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "0.6rem",
                bottom: "0.5rem",
                width: "11rem",
                height: "5rem",
                borderRadius: "63% 37% 55% 45% / 52% 52% 48% 48%",
                background: "rgba(117, 154, 94, 0.24)",
              }}
            />
            <svg
              viewBox="0 0 300 180"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <path
                d="M14 112 C56 88, 84 132, 126 108 S198 72, 286 110"
                fill="none"
                stroke="rgba(248,245,236,0.34)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M42 134 C86 106, 112 150, 152 129 S226 95, 280 128"
                fill="none"
                stroke="rgba(248,245,236,0.2)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="78" cy="94" r="6" fill="rgba(248,245,236,0.84)" />
              <circle cx="164" cy="80" r="5" fill="rgba(248,245,236,0.7)" />
              <circle cx="226" cy="114" r="7" fill="rgba(248,245,236,0.75)" />
            </svg>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "999px",
              padding: "0.5rem 0.9rem",
              background: "rgba(255,255,255,0.12)",
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Native planting, made simple
          </div>

          <h1
            style={{
              fontSize: "clamp(3.1rem, 8vw, 5.9rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.095em",
              margin: "1.1rem 0 0.8rem",
              fontWeight: 700,
              maxWidth: "9ch",
              textWrap: "balance",
            }}
          >
            Rewild your yard one patch at a time.
          </h1>

          <p
            style={{
              maxWidth: "35rem",
              margin: 0,
              fontSize: "1.05rem",
              lineHeight: 1.74,
              color: "rgba(248, 245, 236, 0.82)",
            }}
          >
            Your backyard can be part of nature&apos;s best hope. Pick your light and yard
            size, then we&apos;ll turn your location into a native planting plan that feels
            doable, personal, and wildlife-friendly.
          </p>

          <div
            style={{
              position: "relative",
              display: "grid",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "0.78rem",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  opacity: 0.76,
                }}
              >
                Light
              </p>
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
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{option.label}</div>
                      <div style={{ fontSize: "0.88rem", opacity: 0.78, lineHeight: 1.45 }}>
                        {option.notes}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "0.78rem",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  opacity: 0.76,
                }}
              >
                Space
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
            </div>

            <div>
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "0.78rem",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  opacity: 0.76,
                }}
              >
                What matters most
              </p>
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
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.85rem",
              alignItems: "center",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="button"
              onClick={handleLocation}
              className="cta-pop"
              style={{
                padding: "0.95rem 1.55rem",
                fontSize: "1rem",
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
              onClick={() => setShowZip(true)}
              style={{
                padding: "0.95rem 1.35rem",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
                color: "#f8f5ec",
                cursor: "pointer",
              }}
            >
              Enter ZIP instead
            </button>

            <p
              style={{
                margin: 0,
                fontSize: "0.92rem",
                color: "rgba(248, 245, 236, 0.76)",
              }}
            >
              Personalized native picks tailored for{" "}
              {sunOptions.find((option) => option.value === sun)?.label.toLowerCase()} with a{" "}
              {goalOptions.find((option) => option.value === goal)?.label.toLowerCase()} focus
            </p>
          </div>
        </section>

        {showZip && (
          <section
            className="fade-up delay-2"
            style={{
              marginTop: "1rem",
              borderRadius: "28px",
              padding: "1.35rem",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(109, 137, 97, 0.16)",
              boxShadow: "0 18px 34px rgba(58, 77, 43, 0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.45rem",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#667561",
                fontWeight: 700,
              }}
            >
              ZIP fallback
            </p>
            <h2
              style={{
                margin: "0 0 0.8rem",
                fontSize: "1.35rem",
                lineHeight: 1.06,
                letterSpacing: "-0.04em",
              }}
            >
              Use your ZIP to start your plan
            </h2>
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
                  border: "1px solid #d6ddd0",
                  width: "220px",
                  background: "rgba(255,255,255,0.88)",
                  color: "#213224",
                  outline: "none",
                }}
              />
              <p style={{ margin: 0, color: "#596756", lineHeight: 1.55 }}>
                Perfect if you want to browse with a location instead of enabling geolocation.
              </p>
            </div>
          </section>
        )}

        <section
          className="fade-up delay-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.9rem",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              borderRadius: "26px",
              padding: "1.25rem 1.35rem",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(98, 126, 86, 0.15)",
              boxShadow: "0 16px 30px rgba(59, 79, 44, 0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: "-1.2rem",
                bottom: "-1.8rem",
                width: "7rem",
                height: "7rem",
                borderRadius: "999px",
                background: "rgba(199, 221, 181, 0.34)",
              }}
            />
            <p
              style={{
                margin: "0 0 0.45rem",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#667561",
                fontWeight: 700,
              }}
            >
              What you get
            </p>
            <p style={{ margin: 0, color: "#475544", lineHeight: 1.65 }}>
              A region-aware native plant set, example dimensions for your yard size, and a
              first weekend plan that feels manageable.
            </p>
          </div>

          <div
            style={{
              borderRadius: "26px",
              padding: "1.25rem 1.35rem",
              background: "rgba(247, 244, 234, 0.9)",
              border: "1px solid rgba(125, 146, 108, 0.16)",
              boxShadow: "0 14px 28px rgba(59, 79, 44, 0.05)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-1.4rem",
                top: "-1.2rem",
                width: "6rem",
                height: "6rem",
                borderRadius: "999px",
                background: "rgba(234, 214, 168, 0.28)",
              }}
            />
            <p
              style={{
                margin: "0 0 0.45rem",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#677564",
                fontWeight: 700,
              }}
            >
              Why it feels lighter
            </p>
            <p style={{ margin: 0, color: "#475544", lineHeight: 1.65 }}>
              Rewild is designed to help you start with one good patch, not master your whole
              yard at once.
            </p>
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

          section[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
