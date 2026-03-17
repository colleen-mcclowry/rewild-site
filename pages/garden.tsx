import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  gardenStatusLabels,
  getGardenPlans,
  type GardenPlanStatus,
  type SavedGardenPlan,
  updateGardenPlanStatus,
} from "../lib/my-garden";

const statusOptions: GardenPlanStatus[] = ["idea", "planned", "planted"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function Garden() {
  const router = useRouter();
  const [plans, setPlans] = useState<SavedGardenPlan[] | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPlans(getGardenPlans());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const stats = useMemo(() => {
    const safePlans = plans ?? [];
    const plantedCount = safePlans.filter((plan) => plan.status === "planted").length;
    const nativePickCount = safePlans.reduce((sum, plan) => sum + plan.plantCount, 0);

    return {
      savedCount: safePlans.length,
      plantedCount,
      nativePickCount,
    };
  }, [plans]);

  const handleStatusChange = (id: string, status: GardenPlanStatus) => {
    setPlans(updateGardenPlanStatus(id, status));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily:
          '"Avenir Next", Avenir, Montserrat, "Segoe UI", "Helvetica Neue", sans-serif',
        padding: "2rem 1.25rem 4rem",
        margin: "0 auto",
        background:
          "radial-gradient(circle at top left, rgba(220, 234, 212, 0.98), transparent 30%), radial-gradient(circle at 88% 14%, rgba(246, 224, 188, 0.8), transparent 22%), linear-gradient(180deg, #f3efe4 0%, #fbfaf3 42%, #f2f5ec 100%)",
        color: "#1d2a1d",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
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
              color: "#4e6249",
              fontSize: "0.95rem",
              letterSpacing: "0.01em",
              fontWeight: 600,
            }}
          >
            ← Back home
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              borderRadius: "999px",
              border: "1px solid rgba(104, 130, 90, 0.16)",
              background: "rgba(255,255,255,0.7)",
              color: "#31442e",
              fontSize: "0.92rem",
              fontWeight: 600,
              padding: "0.72rem 1rem",
              cursor: "pointer",
            }}
          >
            Start another plan
          </button>
        </div>

        <section
          style={{
            borderRadius: "30px",
            padding: "1.8rem",
            background:
              "linear-gradient(145deg, rgba(28, 46, 33, 0.97), rgba(57, 85, 49, 0.92))",
            color: "#f6f5ee",
            boxShadow: "0 24px 56px rgba(37, 58, 33, 0.18)",
            position: "relative",
            overflow: "hidden",
            marginBottom: "1.4rem",
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
          <p
            style={{
              margin: "0 0 0.45rem",
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(246,245,238,0.7)",
              fontWeight: 700,
            }}
          >
            My Garden
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.3rem, 6vw, 4.6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
              maxWidth: "40rem",
            }}
          >
            Your saved plans become living conservation projects here.
          </h1>
          <p
            style={{
              margin: "0.95rem 0 0",
              maxWidth: "38rem",
              color: "rgba(246,245,238,0.8)",
              lineHeight: 1.7,
            }}
          >
            Save ideas you want to come back to, mark what you&apos;re planning next, and
            track the patches you&apos;ve already put in the ground.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "0.9rem",
            marginBottom: "1.4rem",
          }}
        >
          {[
            { label: "Plans saved", value: stats.savedCount },
            { label: "Patches planted", value: stats.plantedCount },
            { label: "Native picks", value: stats.nativePickCount },
          ].map((stat) => (
            <article
              key={stat.label}
              style={{
                borderRadius: "22px",
                padding: "1.1rem 1.2rem",
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(104, 130, 90, 0.16)",
                boxShadow: "0 14px 34px rgba(59, 82, 42, 0.06)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.82rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#667260",
                  fontWeight: 700,
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "2rem",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  color: "#233224",
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        {plans === null ? (
          <section
            style={{
              borderRadius: "26px",
              padding: "1.8rem",
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(104, 130, 90, 0.16)",
              textAlign: "center",
            }}
          >
            Loading your garden...
          </section>
        ) : plans.length === 0 ? (
          <section
            style={{
              borderRadius: "28px",
              padding: "2rem",
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(104, 130, 90, 0.16)",
              boxShadow: "0 18px 44px rgba(42, 59, 32, 0.08)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#667260",
                fontWeight: 700,
              }}
            >
              Nothing saved yet
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
                color: "#233224",
              }}
            >
              Your first plan will show up here.
            </h2>
            <p
              style={{
                margin: "0.85rem auto 0",
                maxWidth: "32rem",
                color: "#566453",
                lineHeight: 1.65,
              }}
            >
              Generate a plan, save it to My Garden, and you&apos;ll be able to keep tabs on
              what you want to plant next.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              style={{
                marginTop: "1rem",
                borderRadius: "999px",
                border: "none",
                background: "#304d2e",
                color: "#f8f5ec",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "0.82rem 1.1rem",
                cursor: "pointer",
              }}
            >
              Create my first plan
            </button>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            {plans.map((plan) => (
              <article
                key={plan.id}
                style={{
                  borderRadius: "28px",
                  padding: "1.35rem",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(104, 130, 90, 0.16)",
                  boxShadow: "0 18px 40px rgba(59, 82, 42, 0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ maxWidth: "42rem" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.55rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          padding: "0.4rem 0.72rem",
                          background: "rgba(235, 241, 229, 0.95)",
                          color: "#3d5536",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        {gardenStatusLabels[plan.status]}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          padding: "0.4rem 0.72rem",
                          background: "rgba(247, 244, 234, 0.92)",
                          color: "#52624d",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                        }}
                      >
                        {plan.locationSource}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "999px",
                          padding: "0.4rem 0.72rem",
                          background: "rgba(247, 244, 234, 0.92)",
                          color: "#52624d",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                        }}
                      >
                        {plan.ecosystem}
                      </span>
                    </div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.8rem",
                        lineHeight: 1.02,
                        letterSpacing: "-0.05em",
                        color: "#213124",
                      }}
                    >
                      {plan.title}
                    </h2>
                    <p
                      style={{
                        margin: "0.65rem 0 0",
                        color: "#556352",
                        lineHeight: 1.6,
                      }}
                    >
                      Saved {dateFormatter.format(new Date(plan.savedAt))} for {plan.region}.
                      This plan is sized for a {plan.spaceLabel.toLowerCase()} with a{" "}
                      {plan.goalLabel.toLowerCase()} focus.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(plan.planUrl)}
                    style={{
                      borderRadius: "999px",
                      border: "none",
                      background: "#304d2e",
                      color: "#f8f5ec",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      padding: "0.82rem 1.05rem",
                      cursor: "pointer",
                    }}
                  >
                    View plan
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  {[
                    { label: "Light", value: plan.sunLabel },
                    { label: "Space", value: plan.spaceLabel },
                    { label: "Priority", value: plan.goalLabel },
                    { label: "Plant count", value: String(plan.plantCount) },
                  ].map((detail) => (
                    <div
                      key={detail.label}
                      style={{
                        borderRadius: "18px",
                        padding: "0.9rem",
                        background: "rgba(247, 244, 234, 0.88)",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.78rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#697566",
                          fontWeight: 700,
                        }}
                      >
                        {detail.label}
                      </p>
                      <p
                        style={{
                          margin: "0.3rem 0 0",
                          color: "#33452f",
                          fontWeight: 600,
                          lineHeight: 1.35,
                        }}
                      >
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
                    gap: "0.9rem",
                    marginTop: "1rem",
                  }}
                >
                  <section
                    style={{
                      borderRadius: "20px",
                      padding: "1rem",
                      background: "rgba(255,255,255,0.66)",
                      border: "1px solid rgba(104, 130, 90, 0.12)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 0.55rem",
                        fontSize: "0.8rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#697566",
                        fontWeight: 700,
                      }}
                    >
                      Plant preview
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {plan.plants.slice(0, 4).map((plant) => (
                        <span
                          key={plant.name}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            padding: "0.42rem 0.72rem",
                            background: "rgba(235, 241, 229, 0.95)",
                            color: "#3f5539",
                            fontSize: "0.86rem",
                          }}
                        >
                          {plant.name}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section
                    style={{
                      borderRadius: "20px",
                      padding: "1rem",
                      background: "rgba(255,255,255,0.66)",
                      border: "1px solid rgba(104, 130, 90, 0.12)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 0.55rem",
                        fontSize: "0.8rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#697566",
                        fontWeight: 700,
                      }}
                    >
                      Progress
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                      {statusOptions.map((status) => {
                        const isActive = status === plan.status;

                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleStatusChange(plan.id, status)}
                            style={{
                              borderRadius: "999px",
                              border: isActive
                                ? "1px solid rgba(243, 221, 175, 0.9)"
                                : "1px solid rgba(104, 130, 90, 0.14)",
                              background: isActive
                                ? "rgba(243, 221, 175, 0.28)"
                                : "rgba(255,255,255,0.88)",
                              color: "#33452f",
                              fontSize: "0.88rem",
                              fontWeight: 600,
                              padding: "0.55rem 0.82rem",
                              cursor: "pointer",
                            }}
                          >
                            {gardenStatusLabels[status]}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 920px) {
          section[style*="grid-template-columns: repeat(3, minmax(0, 1fr))"] {
            grid-template-columns: 1fr !important;
          }

          div[style*="grid-template-columns: repeat(4, minmax(0, 1fr))"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          div[style*="grid-template-columns: minmax(0, 1.15fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
