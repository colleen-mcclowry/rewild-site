import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getGardenPlans, saveGardenPlan } from "../lib/my-garden";

type SunPreference = "full-sun" | "part-shade" | "mostly-shade";
type SpacePreference = "small-patch" | "medium-yard" | "large-yard";
type GoalPreference = "pollinators" | "low-maintenance" | "bird-habitat" | "color";

type Plant = {
  name: string;
  latin?: string;
  benefit: string;
  role?: string;
  fitReasons?: string[];
  placementNote?: string;
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
  goal: GoalPreference;
  goalLabel: string;
  sizeRange: string;
  strategy: string;
  title: string;
};

type LayoutZone = {
  key: "front" | "center" | "back";
  title: string;
  summary: string;
  plantEntries: Array<{ plant: Plant; index: number }>;
};

type SeasonalMoment = {
  key: "spring" | "summer" | "fall" | "structure";
  title: string;
  summary: string;
  plantEntries: Array<{ plant: Plant; index: number }>;
};

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
    notes: "Protected from hot afternoon sun",
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
    notes: "About 200 to 1,000 sq ft",
  },
  {
    value: "large-yard",
    label: "Large yard / plot",
    notes: "About 1,000 sq ft+",
  },
];

const goalOptions: Array<{ value: GoalPreference; label: string; notes: string }> = [
  {
    value: "pollinators",
    label: "Pollinators",
    notes: "More nectar and insect activity",
  },
  {
    value: "low-maintenance",
    label: "Low maintenance",
    notes: "Forgiving structure and easier care",
  },
  {
    value: "bird-habitat",
    label: "Bird habitat",
    notes: "More cover, seed, and shelter",
  },
  {
    value: "color",
    label: "Color",
    notes: "A brighter, bloom-forward mix",
  },
];

function parseSunPreference(value: string | undefined): SunPreference {
  if (value === "part-shade" || value === "mostly-shade" || value === "full-sun") {
    return value;
  }

  return "full-sun";
}

function parseSpacePreference(value: string | undefined): SpacePreference {
  if (value === "medium-yard" || value === "large-yard" || value === "small-patch") {
    return value;
  }

  return "small-patch";
}

function parseGoalPreference(value: string | undefined): GoalPreference {
  if (
    value === "pollinators" ||
    value === "low-maintenance" ||
    value === "bird-habitat" ||
    value === "color"
  ) {
    return value;
  }

  return "pollinators";
}

const planDetailsDefaults: PlanDetails = {
  sun: "full-sun",
  sunLabel: "Full sun",
  space: "small-patch",
  spaceLabel: "Small patch",
  goal: "pollinators",
  goalLabel: "Pollinators",
  sizeRange: "About 3 x 6 ft to 8 x 10 ft",
  strategy: "Start with one compact habitat pocket that looks intentional fast.",
  title: "Starter plan",
};

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function getLayoutZoneKey(plant: Plant): LayoutZone["key"] {
  const haystack = `${plant.role ?? ""} ${plant.notes} ${plant.placementNote ?? ""}`.toLowerCase();

  if (
    includesAny(haystack, [
      "ground layer",
      "groundcover",
      "front edge",
      "front-of-bed",
      "front of bed",
      "lower layer",
      "carpet",
      "matrix",
    ])
  ) {
    return "front";
  }

  if (
    includesAny(haystack, [
      "structure plant",
      "habitat layer",
      "back edge",
      "backbone",
      "shrub",
      "grass",
      "sedge",
      "fern",
      "outer edge",
      "silhouette",
    ])
  ) {
    return "back";
  }

  return "center";
}

function getSeasonalMomentKey(plant: Plant): SeasonalMoment["key"] {
  const haystack = `${plant.name} ${plant.benefit} ${plant.notes} ${plant.role ?? ""}`.toLowerCase();

  if (includesAny(haystack, ["spring", "early"])) {
    return "spring";
  }

  if (includesAny(haystack, ["late-season", "late season", "fall", "seed"])) {
    return "fall";
  }

  if (
    includesAny(haystack, [
      "evergreen",
      "year-round",
      "structure",
      "grass",
      "sedge",
      "fern",
      "shelter",
      "cover",
      "habitat layer",
      "structure plant",
    ])
  ) {
    return "structure";
  }

  return "summer";
}

export default function Plan() {
  const router = useRouter();
  const { zip, lat, lon, lng, sun, space, goal } = router.query;
  const longitude = typeof lon === "string" ? lon : typeof lng === "string" ? lng : undefined;
  const currentSun = parseSunPreference(
    typeof sun === "string" ? sun : planDetailsDefaults.sun
  );
  const currentSpace = parseSpacePreference(
    typeof space === "string" ? space : planDetailsDefaults.space
  );
  const currentGoal = parseGoalPreference(
    typeof goal === "string" ? goal : planDetailsDefaults.goal
  );

  const [geoInfo, setGeoInfo] = useState<GeoInfo | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantsLoading, setPlantsLoading] = useState(false);
  const [ecosystem, setEcosystem] = useState("Local native plant ecosystem");
  const [gardenMessage, setGardenMessage] = useState("");
  const [isSavedToGarden, setIsSavedToGarden] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [planDetails, setPlanDetails] = useState<PlanDetails>({
    ...planDetailsDefaults,
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
        if (typeof goal === "string" && goal.length > 0) {
          params.set("goal", goal);
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
  }, [goal, region, router.isReady, space, sun, zip]);

  useEffect(() => {
    if (!shareMessage) return;

    const timeout = window.setTimeout(() => {
      setShareMessage("");
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [shareMessage]);

  useEffect(() => {
    if (!gardenMessage) return;

    const timeout = window.setTimeout(() => {
      setGardenMessage("");
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [gardenMessage]);

  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;

    const currentPlanUrl = `${window.location.pathname}${window.location.search}`;
    const isSaved = getGardenPlans().some((plan) => plan.planUrl === currentPlanUrl);

    setIsSavedToGarden(isSaved);
  }, [router.asPath, router.isReady]);

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
  const shareTitle = `My Rewild plan for ${regionLabel}`;
  const shareText = `A ${planDetails.sunLabel.toLowerCase()} native planting plan for a ${planDetails.spaceLabel.toLowerCase()} with a ${planDetails.goalLabel.toLowerCase()} focus.`;
  const cardSurface = "rgba(255,255,255,0.78)";
  const warmBorder = "1px solid rgba(104, 130, 90, 0.16)";
  const selectionMessage = plantsLoading
    ? "Refreshing your starter palette..."
    : "Tap a choice to update the plan without losing your location.";
  const isRefineDisabled = plantsLoading || !router.isReady;
  const layoutZones = useMemo<LayoutZone[]>(() => {
    const zones: LayoutZone[] = [
      {
        key: "front",
        title: "Front edge",
        summary: "Keep the lowest or softest plants near the path so the patch feels finished.",
        plantEntries: [],
      },
      {
        key: "center",
        title: "Center drift",
        summary: "Cluster your anchor blooms here so the starter bed reads clearly from a distance.",
        plantEntries: [],
      },
      {
        key: "back",
        title: "Backbone",
        summary: "Let taller or more structural plants hold the outline and habitat value together.",
        plantEntries: [],
      },
    ];

    plants.forEach((plant, index) => {
      const zone = zones.find((candidate) => candidate.key === getLayoutZoneKey(plant));

      zone?.plantEntries.push({ plant, index });
    });

    return zones.filter((zone) => zone.plantEntries.length > 0);
  }, [plants]);
  const seasonalMoments = useMemo<SeasonalMoment[]>(() => {
    const moments: SeasonalMoment[] = [
      {
        key: "spring",
        title: "Spring wake-up",
        summary: "Early color or foliage that makes the patch feel alive fast.",
        plantEntries: [],
      },
      {
        key: "summer",
        title: "Summer peak",
        summary: "Main bloom and pollinator traffic when the garden is working hardest.",
        plantEntries: [],
      },
      {
        key: "fall",
        title: "Late-season support",
        summary: "Plants that keep habitat value going after the first big flush.",
        plantEntries: [],
      },
      {
        key: "structure",
        title: "Year-round shape",
        summary: "Leaves, stems, or seed structure that help the patch hold together over time.",
        plantEntries: [],
      },
    ];

    plants.forEach((plant, index) => {
      const moment = moments.find(
        (candidate) => candidate.key === getSeasonalMomentKey(plant)
      );

      moment?.plantEntries.push({ plant, index });
    });

    return moments.filter((moment) => moment.plantEntries.length > 0);
  }, [plants]);

  const renderChoiceGroup = (
    label: string,
    helper: string,
    options: Array<{ value: string; label: string; notes: string }>,
    activeValue: string,
    onSelect: (value: string) => void
  ) => (
    <section
      style={{
        borderRadius: "22px",
        padding: "1rem",
        background: "rgba(255,255,255,0.58)",
        border: "1px solid rgba(104, 130, 90, 0.12)",
      }}
    >
      <p
        style={{
          margin: "0 0 0.3rem",
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#667260",
          fontWeight: 700,
        }}
      >
        {label}
      </p>
      <p style={{ margin: "0 0 0.8rem", color: "#5d6a58", lineHeight: 1.55 }}>{helper}</p>
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {options.map((option) => {
          const isActive = option.value === activeValue;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(option.value)}
              disabled={isRefineDisabled || isActive}
              style={{
                borderRadius: "16px",
                border: isActive
                  ? "1px solid rgba(54, 85, 45, 0.26)"
                  : "1px solid rgba(104, 130, 90, 0.12)",
                background: isActive ? "rgba(233, 241, 226, 0.96)" : "rgba(255,255,255,0.9)",
                color: "#31422d",
                padding: "0.85rem 0.9rem",
                textAlign: "left",
                cursor: isActive ? "default" : isRefineDisabled ? "not-allowed" : "pointer",
                opacity: isRefineDisabled && !isActive ? 0.65 : 1,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {option.label}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: "0.18rem",
                  fontSize: "0.86rem",
                  color: "#667260",
                  lineHeight: 1.4,
                }}
              >
                {option.notes}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );

  const updatePlanPreferences = (
    nextPreferences: Partial<{
      sun: SunPreference;
      space: SpacePreference;
      goal: GoalPreference;
    }>
  ) => {
    if (!router.isReady) return;

    const nextQuery: Record<string, string> = {
      sun: nextPreferences.sun ?? currentSun,
      space: nextPreferences.space ?? currentSpace,
      goal: nextPreferences.goal ?? currentGoal,
    };

    if (typeof zip === "string" && zip.length > 0) {
      nextQuery.zip = zip;
    }

    if (typeof lat === "string" && lat.length > 0) {
      nextQuery.lat = lat;
    }

    if (typeof lon === "string" && lon.length > 0) {
      nextQuery.lon = lon;
    } else if (typeof lng === "string" && lng.length > 0) {
      nextQuery.lng = lng;
    }

    setGardenMessage("");
    setShareMessage("");
    void router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  const savePlanToGarden = () => {
    if (typeof window === "undefined" || plants.length === 0) return;

    try {
      const currentPlanUrl = `${window.location.pathname}${window.location.search}`;
      const result = saveGardenPlan({
        title: planTitle,
        region: regionLabel,
        locationSource,
        ecosystem,
        planUrl: currentPlanUrl,
        sunLabel: planDetails.sunLabel,
        spaceLabel: planDetails.spaceLabel,
        goalLabel: planDetails.goalLabel,
        sizeRange: planDetails.sizeRange,
        plantCount: plants.length,
        plants: plants.map((plant) => ({
          name: plant.name,
          latin: plant.latin,
          benefit: plant.benefit,
          image: plant.image,
        })),
      });

      setIsSavedToGarden(true);
      setGardenMessage(
        result.mode === "created"
          ? "Saved to My Garden as an idea"
          : "Updated in My Garden"
      );
    } catch (error) {
      console.error("save to my garden failed", error);
      setGardenMessage("Couldn’t save this plan");
    }
  };

  const copyPlanLink = async () => {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setShareMessage("Plan link copied");
    } catch (error) {
      console.error("copy plan link failed", error);
      setShareMessage("Couldn’t copy the link");
    }
  };

  const sharePlan = async () => {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
        setShareMessage("Plan shared");
        return;
      }

      await copyPlanLink();
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        return;
      }

      console.error("share plan failed", error);
      setShareMessage("Couldn’t share the plan");
    }
  };

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
      className="plan-page"
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
      <div className="plan-shell" style={{ maxWidth: "1120px", margin: "0 auto" }}>
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
            onClick={() => router.push("/garden")}
            style={{
              borderRadius: "999px",
              border: "1px solid rgba(104, 130, 90, 0.16)",
              background: "rgba(255,255,255,0.66)",
              color: "#31442e",
              fontSize: "0.92rem",
              fontWeight: 600,
              padding: "0.7rem 1rem",
              cursor: "pointer",
            }}
          >
            My Garden
          </button>
        </div>
        <section
          className="plan-top-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.9fr)",
            gap: "1.25rem",
            alignItems: "stretch",
            marginBottom: "1.75rem",
          }}
        >
          <header
            className="plan-hero"
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
              className="plan-hero-tags"
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
                {planDetails.goalLabel}
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
              plan for a {planDetails.spaceLabel.toLowerCase()} with a {planDetails.goalLabel.toLowerCase()} focus. Expect a curated set of
              native plants that support pollinators while staying manageable for the
              space you picked.
            </p>

            <div
              className="plan-hero-stats"
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
              <div
                style={{
                  borderRadius: "18px",
                  padding: "0.95rem",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.72 }}>Priority</p>
                <p style={{ margin: "0.3rem 0 0", fontSize: "1.2rem", lineHeight: 1.25 }}>
                  {planDetails.goalLabel}
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
            className="plan-sidebar"
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
              quickly without outgrowing your {planDetails.spaceLabel.toLowerCase()}, while
              leaning toward {planDetails.goalLabel.toLowerCase()}.
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

            <div
              style={{
                marginTop: "1.2rem",
                paddingTop: "1.15rem",
                borderTop: "1px solid rgba(104, 130, 90, 0.12)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.45rem",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#61725d",
                  fontWeight: 700,
                }}
              >
                My Garden
              </p>
              <p style={{ margin: "0 0 0.85rem", color: "#4f5d4d", lineHeight: 1.6 }}>
                Turn this starter plan into a conservation project you can revisit and grow.
              </p>
              <div
                className="plan-action-group"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.7rem",
                }}
              >
                <button
                  type="button"
                  onClick={savePlanToGarden}
                  style={{
                    borderRadius: "999px",
                    border: "none",
                    background:
                      plantsLoading || plants.length === 0 ? "rgba(48, 77, 46, 0.38)" : "#304d2e",
                    color: "#f8f5ec",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.78rem 1rem",
                    cursor:
                      plantsLoading || plants.length === 0 ? "not-allowed" : "pointer",
                  }}
                  disabled={plantsLoading || plants.length === 0}
                >
                  {isSavedToGarden ? "Update saved plan" : "Save to My Garden"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/garden")}
                  style={{
                    borderRadius: "999px",
                    border: "1px solid rgba(76, 100, 67, 0.18)",
                    background: "rgba(255,255,255,0.94)",
                    color: "#30412c",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.78rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Open My Garden
                </button>
              </div>
              <p
                aria-live="polite"
                style={{
                  minHeight: "1.25rem",
                  margin: "0.75rem 0 0",
                  fontSize: "0.88rem",
                  color: "#6a7766",
                }}
              >
                {gardenMessage ||
                  (isSavedToGarden
                    ? "This plan already lives in My Garden."
                    : "Save this plan to come back to it later.")}
              </p>
            </div>

            <div
              style={{
                marginTop: "1.2rem",
                paddingTop: "1.15rem",
                borderTop: "1px solid rgba(104, 130, 90, 0.12)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.45rem",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#61725d",
                  fontWeight: 700,
                }}
              >
                Share
              </p>
              <p style={{ margin: "0 0 0.85rem", color: "#4f5d4d", lineHeight: 1.6 }}>
                Keep this version handy or send it to someone you want to rewild with.
              </p>
              <div
                className="plan-action-group"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.7rem",
                }}
              >
                <button
                  type="button"
                  onClick={copyPlanLink}
                  style={{
                    borderRadius: "999px",
                    border: "1px solid rgba(76, 100, 67, 0.18)",
                    background: "rgba(255,255,255,0.94)",
                    color: "#30412c",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.78rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Copy plan link
                </button>
                <button
                  type="button"
                  onClick={sharePlan}
                  style={{
                    borderRadius: "999px",
                    border: "none",
                    background: "#304d2e",
                    color: "#f8f5ec",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.78rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Share this plan
                </button>
              </div>
              <p
                aria-live="polite"
                style={{
                  minHeight: "1.25rem",
                  margin: "0.75rem 0 0",
                  fontSize: "0.88rem",
                  color: "#6a7766",
                }}
              >
                {shareMessage || "Your plan link keeps your location, light, size, and goal choices."}
              </p>
            </div>
          </aside>
        </section>

        <section
          className="refine-section"
          style={{
            borderRadius: "28px",
            padding: "1.35rem",
            background: cardSurface,
            border: warmBorder,
            boxShadow: "0 18px 40px rgba(59, 82, 42, 0.08)",
            backdropFilter: "blur(14px)",
            marginBottom: "1.6rem",
          }}
        >
          <div
            style={{
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
                Refine this plan
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.9rem",
                  lineHeight: 1.04,
                  letterSpacing: "-0.05em",
                  color: "#243323",
                }}
              >
                Adjust the habitat recipe without starting over
              </h2>
            </div>
            <p
              aria-live="polite"
              style={{
                margin: 0,
                maxWidth: "30rem",
                color: "#5d6a58",
                lineHeight: 1.6,
              }}
            >
              {selectionMessage}
            </p>
          </div>

          <div
            className="refine-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "0.9rem",
              marginTop: "1rem",
            }}
          >
            {renderChoiceGroup(
              "Light",
              "Match the actual conditions in the patch you want to start with.",
              sunOptions,
              currentSun,
              (value) => updatePlanPreferences({ sun: value as SunPreference })
            )}
            {renderChoiceGroup(
              "Space",
              "Scale the starter set to what you can realistically plant next.",
              spaceOptions,
              currentSpace,
              (value) => updatePlanPreferences({ space: value as SpacePreference })
            )}
            {renderChoiceGroup(
              "Priority",
              "Shift the mix toward the outcome you care most about right now.",
              goalOptions,
              currentGoal,
              (value) => updatePlanPreferences({ goal: value as GoalPreference })
            )}
          </div>
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
        ) : plants.length === 0 ? (
          <section
            style={{
              borderRadius: "26px",
              background: "rgba(255,255,255,0.82)",
              border: warmBorder,
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 12px 28px rgba(41, 63, 34, 0.06)",
              marginBottom: "1.75rem",
            }}
          >
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
              No starter set yet
            </p>
            <h3
              style={{
                margin: 0,
                fontSize: "1.9rem",
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
                color: "#233224",
              }}
            >
              Try a different light, size, or priority mix.
            </h3>
            <p
              style={{
                margin: "0.85rem auto 0",
                maxWidth: "34rem",
                color: "#566453",
                lineHeight: 1.65,
              }}
            >
              We couldn&apos;t build a strong starter palette for this exact combination
              yet, but the controls above will refresh the plan without losing your
              location.
            </p>
          </section>
        ) : (
          <section
            className="plant-grid"
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
                {plant.image ? (
                  <div style={{ position: "relative" }}>
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
                  </div>
                ) : null}
                <div style={{ padding: "1.15rem" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.3rem",
                      height: "2.3rem",
                      borderRadius: "999px",
                      marginBottom: "0.85rem",
                      background: "rgba(237, 242, 231, 0.92)",
                      color: "#2f4328",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                    }}
                  >
                    0{index + 1}
                  </div>
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
                  {plant.role && (
                    <p
                      style={{
                        margin: "0 0 0.7rem",
                        fontSize: "0.84rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#73806e",
                        fontWeight: 700,
                      }}
                    >
                      {plant.role}
                    </p>
                  )}
                  <p style={{ margin: 0, color: "#566453", lineHeight: 1.6 }}>
                    {plant.notes}
                  </p>
                  {plant.fitReasons && plant.fitReasons.length > 0 && (
                    <div
                      style={{
                        marginTop: "0.85rem",
                        paddingTop: "0.85rem",
                        borderTop: "1px solid rgba(104, 130, 90, 0.12)",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 0.45rem",
                          fontSize: "0.8rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#6b7867",
                          fontWeight: 700,
                        }}
                      >
                        Why it fits
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                        {plant.fitReasons.map((reason) => (
                          <span
                            key={reason}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              borderRadius: "999px",
                              padding: "0.38rem 0.65rem",
                              background: "rgba(235, 241, 229, 0.95)",
                              color: "#446040",
                              fontSize: "0.82rem",
                            }}
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {plant.placementNote && (
                    <p
                      style={{
                        margin: "0.85rem 0 0",
                        padding: "0.85rem 0 0",
                        borderTop: "1px solid rgba(104, 130, 90, 0.12)",
                        color: "#5b6857",
                        lineHeight: 1.6,
                      }}
                    >
                      <strong style={{ color: "#40503d" }}>Placement:</strong> {plant.placementNote}
                    </p>
                  )}
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

        {plants.length > 0 && (
          <section
            className="plan-layout-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.05fr) minmax(280px, 0.95fr)",
              gap: "1rem",
              marginBottom: "1rem",
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
                Simple layout
              </p>
              <h2
                style={{
                  margin: "0 0 0.8rem",
                  fontSize: "1.9rem",
                  lineHeight: 1.03,
                  letterSpacing: "-0.05em",
                }}
              >
                A starter bed you can actually picture
              </h2>
              <p style={{ margin: "0 0 1rem", color: "#596655", lineHeight: 1.6 }}>
                Use the numbered plants from the cards above and group them by zone instead
                of spacing everything evenly like a checklist.
              </p>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {layoutZones.map((zone) => (
                  <section
                    key={zone.key}
                    style={{
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.7)",
                      padding: "1rem",
                      border: "1px solid rgba(104, 130, 90, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        gap: "0.8rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "1.2rem",
                            lineHeight: 1.1,
                            color: "#243323",
                          }}
                        >
                          {zone.title}
                        </h3>
                        <p style={{ margin: "0.35rem 0 0", color: "#5f6d58", lineHeight: 1.55 }}>
                          {zone.summary}
                        </p>
                      </div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "2rem",
                          height: "2rem",
                          borderRadius: "999px",
                          background: "rgba(232, 240, 223, 0.92)",
                          color: "#31422d",
                          fontWeight: 700,
                        }}
                      >
                        {zone.plantEntries.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.85rem" }}>
                      {zone.plantEntries.map(({ plant, index }) => (
                        <span
                          key={`${zone.key}-${plant.name}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            borderRadius: "999px",
                            padding: "0.42rem 0.68rem",
                            background: "rgba(235, 241, 229, 0.95)",
                            color: "#3f5539",
                            fontSize: "0.86rem",
                          }}
                        >
                          <strong style={{ color: "#2c4028" }}>{String(index + 1).padStart(2, "0")}</strong>
                          {plant.name}
                        </span>
                      ))}
                    </div>
                  </section>
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
                Seasonal rhythm
              </p>
              <h2
                style={{
                  margin: "0 0 0.8rem",
                  fontSize: "1.9rem",
                  lineHeight: 1.03,
                  letterSpacing: "-0.05em",
                }}
              >
                What this patch is doing through the year
              </h2>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {seasonalMoments.map((moment) => (
                  <section
                    key={moment.key}
                    style={{
                      borderRadius: "18px",
                      background: "linear-gradient(180deg, #eef3e6 0%, #f8f5ec 100%)",
                      padding: "1rem",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.08rem",
                        lineHeight: 1.15,
                        color: "#2b3f2c",
                      }}
                    >
                      {moment.title}
                    </h3>
                    <p style={{ margin: "0.35rem 0 0.75rem", color: "#596655", lineHeight: 1.55 }}>
                      {moment.summary}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                      {moment.plantEntries.map(({ plant, index }) => (
                        <span
                          key={`${moment.key}-${plant.name}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            borderRadius: "999px",
                            padding: "0.38rem 0.62rem",
                            background: "rgba(255,255,255,0.82)",
                            color: "#3d503a",
                            fontSize: "0.84rem",
                          }}
                        >
                          <strong style={{ color: "#2c4028" }}>{String(index + 1).padStart(2, "0")}</strong>
                          {plant.name}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          </section>
        )}

        <section
          className="plan-weekend-grid"
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
          .plan-shell {
            padding-bottom: 0.5rem;
          }

          .plan-top-grid {
            grid-template-columns: 1fr !important;
          }

          .plan-layout-grid,
          .plan-weekend-grid {
            grid-template-columns: 1fr !important;
          }

          .refine-grid {
            grid-template-columns: 1fr !important;
          }

          .plan-hero-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .plan-page {
            padding: 1rem 0.85rem 2.5rem !important;
          }

          .plan-shell {
            padding: 0 0.05rem 0.5rem !important;
          }

          .plan-hero,
          .plan-sidebar,
          .refine-section {
            border-radius: 24px !important;
            padding: 1.1rem !important;
          }

          .plan-hero-tags {
            gap: 0.45rem !important;
          }

          .plan-action-group {
            flex-direction: column !important;
          }

          .plan-action-group button {
            width: 100% !important;
          }

          .plant-grid {
            grid-template-columns: 1fr !important;
          }

          .plan-layout-grid,
          .plan-weekend-grid {
            grid-template-columns: 1fr !important;
          }

          .plan-hero-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
