import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [zip, setZip] = useState("");
  const [showZip, setShowZip] = useState(false);
  const router = useRouter();

  const goWithZip = (value?: string) => {
    const cleaned = (value ?? zip).trim();

    if (cleaned.length === 5) {
      router.push(`/plan?zip=${cleaned}`);
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
        router.push(`/plan?lat=${latitude}&lon=${longitude}`);
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
          "radial-gradient(circle at top left, rgba(219, 233, 209, 0.98), transparent 32%), radial-gradient(circle at 85% 20%, rgba(246, 225, 188, 0.8), transparent 24%), linear-gradient(180deg, #f3efe4 0%, #faf8f1 52%, #f4f6ee 100%)",
        color: "#1c2d22",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
        }}
      >
        <div
          aria-hidden="true"
          className="float-slow"
          style={{
            position: "absolute",
            top: "5.5rem",
            left: "-3rem",
            width: "12rem",
            height: "12rem",
            borderRadius: "999px",
            background: "rgba(173, 204, 157, 0.24)",
            filter: "blur(8px)",
          }}
        />
        <div
          aria-hidden="true"
          className="float-delayed"
          style={{
            position: "absolute",
            right: "-2rem",
            top: "12rem",
            width: "15rem",
            height: "15rem",
            borderRadius: "999px",
            background: "rgba(235, 206, 153, 0.22)",
            filter: "blur(8px)",
          }}
        />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, 0.85fr)",
            gap: "1.25rem",
            alignItems: "stretch",
          }}
        >
          <div
            className="fade-up"
            style={{
              position: "relative",
              borderRadius: "34px",
              padding: "2rem",
              background:
                "linear-gradient(145deg, rgba(29, 47, 34, 0.97), rgba(53, 79, 48, 0.92))",
              color: "#f8f5ec",
              boxShadow: "0 28px 70px rgba(30, 46, 33, 0.18)",
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
                background: "rgba(246, 210, 146, 0.12)",
              }}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                borderRadius: "999px",
                padding: "0.5rem 0.9rem",
                background: "rgba(255,255,255,0.1)",
                fontSize: "0.82rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Native planting, made simple
            </div>

            <h1
              style={{
                fontSize: "clamp(3.2rem, 9vw, 6.2rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.08em",
                margin: "1rem 0 0.9rem",
                fontWeight: 700,
                maxWidth: "11ch",
              }}
            >
              Rewild your yard one patch at a time.
            </h1>

            <p
              style={{
                maxWidth: "35rem",
                margin: 0,
                fontSize: "1.06rem",
                lineHeight: 1.72,
                color: "rgba(248, 245, 236, 0.82)",
              }}
            >
              Tell us where you are and Rewild turns that into a gentle first step:
              native plants, habitat value, and a garden plan that feels actually doable.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.85rem",
                marginTop: "1.4rem",
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
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "0.8rem",
                marginTop: "1.6rem",
              }}
            >
              <div
                style={{
                  borderRadius: "20px",
                  padding: "0.95rem",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.72 }}>Starts with</p>
                <p style={{ margin: "0.28rem 0 0", fontSize: "1.35rem", fontWeight: 700 }}>
                  Your location
                </p>
              </div>
              <div
                style={{
                  borderRadius: "20px",
                  padding: "0.95rem",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.72 }}>Delivers</p>
                <p style={{ margin: "0.28rem 0 0", fontSize: "1.35rem", fontWeight: 700 }}>
                  3 native picks
                </p>
              </div>
              <div
                style={{
                  borderRadius: "20px",
                  padding: "0.95rem",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.72 }}>Built for</p>
                <p style={{ margin: "0.28rem 0 0", fontSize: "1.35rem", fontWeight: 700 }}>
                  Small wins
                </p>
              </div>
            </div>
          </div>

          <aside
            className="fade-up delay-2"
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <div
              style={{
                borderRadius: "30px",
                padding: "1.45rem",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(98, 126, 86, 0.15)",
                boxShadow: "0 22px 45px rgba(59, 79, 44, 0.08)",
                backdropFilter: "blur(14px)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.55rem",
                  fontSize: "0.82rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#667561",
                  fontWeight: 700,
                }}
              >
                What you get
              </p>
              <h2
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "1.8rem",
                  lineHeight: 1.03,
                  letterSpacing: "-0.05em",
                }}
              >
                A native plan that feels personal immediately
              </h2>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {[
                  "A region-aware starter plant set",
                  "A simple patch-size recommendation",
                  "A clearer first weekend action plan",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: "18px",
                      background: "#f6f4eb",
                      padding: "0.95rem 1rem",
                      color: "#42513d",
                      lineHeight: 1.55,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: "30px",
                padding: "1.45rem",
                background:
                  "linear-gradient(180deg, rgba(245, 241, 228, 0.98), rgba(238, 243, 229, 0.98))",
                border: "1px solid rgba(125, 146, 108, 0.18)",
                boxShadow: "0 18px 36px rgba(59, 79, 44, 0.06)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem",
                  color: "#677564",
                  fontSize: "0.82rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Gentle onboarding
              </p>
              <p style={{ margin: 0, color: "#475544", lineHeight: 1.65 }}>
                Rewild is designed to feel more like a thoughtful guide than a dense tool.
                Start with one sunny patch, watch what shows up, and grow from there.
              </p>
            </div>
          </aside>
        </section>

        {showZip && (
          <section
            className="fade-up delay-3"
            style={{
              maxWidth: "540px",
              marginTop: "1.2rem",
              borderRadius: "30px",
              padding: "1.4rem",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(109, 137, 97, 0.16)",
              boxShadow: "0 18px 34px rgba(58, 77, 43, 0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.55rem",
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#667561",
                fontWeight: 700,
              }}
            >
              ZIP fallback
            </p>
            <h3
              style={{
                margin: "0 0 0.75rem",
                fontSize: "1.5rem",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Use your ZIP to start your plan
            </h3>
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

        @media (max-width: 900px) {
          section {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
