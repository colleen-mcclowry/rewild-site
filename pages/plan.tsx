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

type PlantRoleKey =
  | "anchor"
  | "pollinator"
  | "ground"
  | "seasonal"
  | "habitat"
  | "structure";

type QuantityRange = {
  min: number;
  max: number;
};

type PlantingGuide = {
  plant: Plant;
  index: number;
  quantity: QuantityRange;
  quantityLabel: string;
  spacing: string;
  grouping: string;
  zoneLabel: string;
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

const layoutZoneLabels: Record<LayoutZone["key"], string> = {
  front: "Front edge",
  center: "Center drift",
  back: "Backbone",
};

const seasonalMomentLabels: Record<SeasonalMoment["key"], string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Late season",
  structure: "Year-round",
};

const realGardenScenes = [
  {
    title: "Real garden, real momentum",
    copy: "Not a render. Not a perfect meadow. Just one planted corner starting to feel alive.",
    image: "/home/hero-garden.jpg",
    tags: ["Real garden", "First patch", "Color + habitat"],
  },
  {
    title: "Who shows up",
    copy: "Butterflies and other pollinators start finding the flowers.",
    image: "/home/hero-butterfly.jpg",
  },
  {
    title: "Native bloom",
    copy: "One pocket of bloom can make the whole yard feel more alive.",
    image: "/home/hero-milkweed.jpg",
  },
] as const;

const plantingHeuristics: Record<
  PlantRoleKey,
  {
    spacing: string;
    grouping: string;
    quantities: Record<SpacePreference, QuantityRange>;
  }
> = {
  anchor: {
    spacing: "18-24 in apart",
    grouping: "Cluster this in one bold middle drift so the bed reads fast.",
    quantities: {
      "small-patch": { min: 1, max: 2 },
      "medium-yard": { min: 3, max: 5 },
      "large-yard": { min: 5, max: 7 },
    },
  },
  pollinator: {
    spacing: "18-24 in apart",
    grouping: "Repeat near the anchor so bloom and pollinator traffic land together.",
    quantities: {
      "small-patch": { min: 2, max: 3 },
      "medium-yard": { min: 3, max: 5 },
      "large-yard": { min: 5, max: 7 },
    },
  },
  ground: {
    spacing: "12-18 in apart",
    grouping: "Thread this along the front edge and between taller plants.",
    quantities: {
      "small-patch": { min: 3, max: 4 },
      "medium-yard": { min: 5, max: 7 },
      "large-yard": { min: 7, max: 10 },
    },
  },
  seasonal: {
    spacing: "18-24 in apart",
    grouping: "Echo this through the middle so color is not stuck in one corner.",
    quantities: {
      "small-patch": { min: 1, max: 2 },
      "medium-yard": { min: 3, max: 4 },
      "large-yard": { min: 4, max: 6 },
    },
  },
  habitat: {
    spacing: "18-24 in apart",
    grouping: "Tuck this into side pockets for extra shelter and cover.",
    quantities: {
      "small-patch": { min: 1, max: 2 },
      "medium-yard": { min: 3, max: 4 },
      "large-yard": { min: 4, max: 6 },
    },
  },
  structure: {
    spacing: "24-36 in apart",
    grouping: "Place this toward the back or outer edge for silhouette and shape.",
    quantities: {
      "small-patch": { min: 1, max: 2 },
      "medium-yard": { min: 2, max: 3 },
      "large-yard": { min: 3, max: 5 },
    },
  },
};

const spaceImpactDetails: Record<
  SpacePreference,
  { footprint: string; areaNote: string; climateNote: string }
> = {
  "small-patch": {
    footprint: "18 to 80 sq ft",
    areaNote: "A starter bed you can realistically plant and keep up with.",
    climateNote:
      "If this replaces turf, it usually means fewer weekly mowing passes for one starter zone.",
  },
  "medium-yard": {
    footprint: "200 to 1,000 sq ft",
    areaNote: "Enough planted area to make the yard feel different, not just decorated.",
    climateNote:
      "If this replaces turf, the drop in mowing and bare-soil exposure starts to feel noticeable.",
  },
  "large-yard": {
    footprint: "1,000+ sq ft",
    areaNote: "A larger footprint where habitat and lower-input care can start stacking up.",
    climateNote:
      "On a bigger patch, reduced mowing and deeper perennial roots have more room to matter.",
  },
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

function getPlantPreviewTags(plant: Plant) {
  const tags = [
    layoutZoneLabels[getLayoutZoneKey(plant)],
    seasonalMomentLabels[getSeasonalMomentKey(plant)],
    ...(plant.fitReasons ?? []).slice(0, 2),
  ];

  return [...new Set(tags)];
}

function getSeasonSpanValue(moments: SeasonalMoment[]) {
  const activeMoments = moments.filter((moment) => moment.key !== "structure");

  if (activeMoments.length >= 3) {
    return "Spring to fall";
  }

  if (activeMoments.length === 2) {
    return `${seasonalMomentLabels[activeMoments[0].key]} to ${
      seasonalMomentLabels[activeMoments[1].key]
    }`;
  }

  if (activeMoments.length === 1) {
    return seasonalMomentLabels[activeMoments[0].key];
  }

  return "Growing season";
}

function getPlantRoleKey(plant: Plant): PlantRoleKey {
  const role = (plant.role ?? "").toLowerCase();

  if (role.includes("anchor")) {
    return "anchor";
  }

  if (role.includes("pollinator")) {
    return "pollinator";
  }

  if (role.includes("ground")) {
    return "ground";
  }

  if (role.includes("seasonal")) {
    return "seasonal";
  }

  if (role.includes("habitat")) {
    return "habitat";
  }

  return "structure";
}

function formatQuantityLabel(quantity: QuantityRange) {
  return quantity.min === quantity.max
    ? `${quantity.min} plant${quantity.min === 1 ? "" : "s"}`
    : `${quantity.min}-${quantity.max} plants`;
}

function getStarterPlantCountLabel(guides: PlantingGuide[]) {
  const totals = guides.reduce(
    (sum, guide) => ({
      min: sum.min + guide.quantity.min,
      max: sum.max + guide.quantity.max,
    }),
    { min: 0, max: 0 }
  );

  return totals.min === totals.max
    ? `${totals.min} plants`
    : `${totals.min}-${totals.max} plants`;
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
    : "Tap a choice to refresh the mix.";
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
  const impactCards = useMemo(() => {
    const footprint = spaceImpactDetails[currentSpace];
    const seasonSpanValue = getSeasonSpanValue(seasonalMoments);
    const habitatLayersValue =
      layoutZones.length >= 3 ? "3 layers" : `${Math.max(layoutZones.length, 1)} layer${layoutZones.length === 1 ? "" : "s"}`;
    const habitatLayersNote =
      layoutZones.length >= 3
        ? "Low, middle, and structural plants create more ways to feed and shelter wildlife."
        : layoutZones.length === 2
          ? "Even two layers give the patch more habitat value than a flat planting."
          : "One clear layer still starts replacing blank space with living cover.";
    const seasonSpanNote =
      seasonalMoments.filter((moment) => moment.key !== "structure").length >= 3
        ? "The plan keeps food and habitat value moving through most of the growing season."
        : "More than one garden moment helps the patch stay useful longer.";

    return [
      {
        label: "Footprint",
        value: footprint.footprint,
        note: footprint.areaNote,
      },
      {
        label: "Habitat layers",
        value: habitatLayersValue,
        note: habitatLayersNote,
      },
      {
        label: "Season spread",
        value: seasonSpanValue,
        note: seasonSpanNote,
      },
      {
        label: "Climate signal",
        value: "Less mowing + roots",
        note: footprint.climateNote,
      },
    ];
  }, [currentSpace, layoutZones.length, seasonalMoments]);
  const plantingGuides = useMemo<PlantingGuide[]>(
    () =>
      plants.map((plant, index) => {
        const roleKey = getPlantRoleKey(plant);
        const guide = plantingHeuristics[roleKey];

        return {
          plant,
          index,
          quantity: guide.quantities[currentSpace],
          quantityLabel: formatQuantityLabel(guide.quantities[currentSpace]),
          spacing: guide.spacing,
          grouping: guide.grouping,
          zoneLabel: layoutZoneLabels[getLayoutZoneKey(plant)],
        };
      }),
    [currentSpace, plants]
  );
  const starterPlantCountLabel = useMemo(
    () => getStarterPlantCountLabel(plantingGuides),
    [plantingGuides]
  );
  const weekendChecklist = useMemo(() => {
    const zoneLabel = currentSpace === "small-patch" ? "starter patch" : "first planted zone";
    const layersLabel =
      layoutZones.length >= 3
        ? "three loose layers"
        : layoutZones.length === 2
          ? "two clear layers"
          : "one clear layer";

    if (plants.length === 0) {
      return [
        {
          title: "Claim one starter zone",
          detail: `Start with one ${planDetails.sunLabel.toLowerCase()} ${zoneLabel} you can actually maintain.`,
        },
        {
          title: "Mark the outline first",
          detail: "Use a hose, rope, or a few stakes so the bed has a clear shape before you buy anything.",
        },
        {
          title: "Go for one bed, not the whole yard",
          detail: "A single finished patch teaches you more than scattering a few plants across the whole space.",
        },
        {
          title: "Refresh the mix if needed",
          detail: "If this combination is thin, use the refine controls above to adjust light, size, or priority without losing your location.",
        },
      ];
    }

    return [
      {
        title: "Claim one starter zone",
        detail: `Start with one ${planDetails.sunLabel.toLowerCase()} ${zoneLabel} instead of spreading effort across the whole yard.`,
      },
      {
        title: "Set everything out first",
        detail: `Use the numbered cards to arrange ${layersLabel}: lower plants to the edge, anchor blooms in the middle, structure toward the back.`,
      },
      {
        title: "Buy repeats, not singles",
        detail: `Plan on about ${starterPlantCountLabel} total across ${plants.length} species for this first zone, using the quantities and spacing on each card.`,
      },
      {
        title: "Plant, water, then mulch",
        detail: "Water each plant in deeply right away, then add about 2 inches of mulch while keeping stems and crowns clear.",
      },
    ];
  }, [
    currentSpace,
    layoutZones.length,
    planDetails.sunLabel,
    plants.length,
    starterPlantCountLabel,
  ]);
  const firstSeasonCare = useMemo(() => {
    const weekOneWatering =
      currentSun === "full-sun"
        ? "every 2 to 3 days"
        : currentSun === "part-shade"
          ? "every 3 to 4 days"
          : "every 4 to 5 days";
    const hotSpellWatering =
      currentSun === "full-sun" ? "once or twice a week" : "about once a week";

    return [
      {
        title: "Week 1",
        detail: `If you do not get a soaking rain, water ${weekOneWatering} so the roots settle in.`,
      },
      {
        title: "Weeks 2-6",
        detail: "Pull obvious lawn grass and fast weeds early so the young natives are not crowded out.",
      },
      {
        title: "Hot spells",
        detail: `During heat, soak the bed ${hotSpellWatering} instead of giving it a light daily sprinkle.`,
      },
      {
        title: "Fall to spring",
        detail: "Leave stems and seedheads standing through winter, then cut back in early spring if you want a cleaner reset.",
      },
    ];
  }, [currentSun]);

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
              A native starter patch for {regionLabel}, matched to {planDetails.sunLabel.toLowerCase()}, sized for a{" "}
              {planDetails.spaceLabel.toLowerCase()}, and tilted toward{" "}
              {planDetails.goalLabel.toLowerCase()}.
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
              Why this mix works
            </p>
            <h2
              style={{
                margin: "0 0 0.8rem",
                fontSize: "1.55rem",
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
              }}
            >
              Built to look good fast
            </h2>
            <p style={{ margin: 0, color: "#4f5d4d", lineHeight: 1.65 }}>
              Enough bloom, enough structure, and enough habitat to make one patch feel
              alive quickly.
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
                Save it now. Revisit it later.
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
                Send this version to yourself or someone else.
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
          className="plan-real-garden"
          style={{
            borderRadius: "30px",
            padding: "1rem",
            background: "rgba(255,255,255,0.72)",
            border: warmBorder,
            boxShadow: "0 18px 40px rgba(59, 82, 42, 0.08)",
            backdropFilter: "blur(14px)",
            marginBottom: "1.55rem",
          }}
        >
          <div
            className="plan-real-garden-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.08fr) minmax(280px, 0.92fr)",
              gap: "0.9rem",
              alignItems: "stretch",
            }}
          >
            <article
              className="plan-real-garden-main"
              style={{
                borderRadius: "24px",
                minHeight: "360px",
                overflow: "hidden",
                position: "relative",
                color: "#f6f5ee",
              }}
            >
              <Image
                src={realGardenScenes[0].image}
                alt={realGardenScenes[0].title}
                fill
                priority
                sizes="(max-width: 920px) 100vw, 58vw"
                style={{ objectFit: "cover" }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(15, 24, 18, 0.08) 0%, rgba(15, 24, 18, 0.32) 48%, rgba(15, 24, 18, 0.82) 100%)",
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
                    fontSize: "0.76rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(246,245,238,0.76)",
                    fontWeight: 700,
                  }}
                >
                  Real Garden Cue
                </p>
                <h2
                  style={{
                    margin: "0.45rem 0 0",
                    maxWidth: "24rem",
                    fontSize: "clamp(1.95rem, 4vw, 2.75rem)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {realGardenScenes[0].title}
                </h2>
                <p
                  style={{
                    margin: "0.6rem 0 0",
                    maxWidth: "26rem",
                    color: "rgba(246,245,238,0.84)",
                    lineHeight: 1.55,
                  }}
                >
                  {realGardenScenes[0].copy}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginTop: "0.9rem",
                  }}
                >
                  {realGardenScenes[0].tags.map((tag) => (
                    <span
                      key={tag}
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
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <div
              className="plan-real-garden-side"
              style={{
                display: "grid",
                gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr) auto",
                gap: "0.8rem",
              }}
            >
              {realGardenScenes.slice(1).map((scene) => (
                <article
                  key={scene.title}
                  className="plan-real-garden-scene"
                  style={{
                    borderRadius: "24px",
                    minHeight: "170px",
                    position: "relative",
                    overflow: "hidden",
                    color: "#f6f5ee",
                  }}
                >
                  <Image
                    src={scene.image}
                    alt={scene.title}
                    fill
                    sizes="(max-width: 920px) 100vw, 36vw"
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
                        margin: "0.35rem 0 0",
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
                  color: "#30422d",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.35rem",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#697867",
                    fontWeight: 700,
                  }}
                >
                  Ground Truth
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.45rem",
                    lineHeight: 1.03,
                    letterSpacing: "-0.05em",
                    color: "#243424",
                  }}
                >
                  Your exact species may differ. The feeling should not.
                </h3>
                <p style={{ margin: "0.6rem 0 0", color: "#5b6a57", lineHeight: 1.55 }}>
                  The plan is local to your yard. The goal is this same sense of color,
                  movement, and life in one real patch.
                </p>
              </article>
            </div>
          </div>
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
                Tune the mix without starting over
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
            A short, local plant list shaped by your choices.
          </p>
        </section>

        {!plantsLoading && plantingGuides.length > 0 && (
          <section
            style={{
              borderRadius: "24px",
              padding: "1.15rem 1.2rem",
              background: "linear-gradient(135deg, rgba(240,245,234,0.92), rgba(250,245,235,0.9))",
              border: warmBorder,
              boxShadow: "0 14px 32px rgba(49, 68, 38, 0.06)",
              marginBottom: "1.2rem",
            }}
          >
            <p
              style={{
                margin: "0 0 0.35rem",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#667260",
                fontWeight: 700,
              }}
            >
              Starter buying guide
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "1.55rem",
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
                color: "#243323",
              }}
            >
              Plan on {starterPlantCountLabel} for the first zone
            </h2>
            <p style={{ margin: "0.55rem 0 0", color: "#586653", lineHeight: 1.6 }}>
              Use repeats and small drifts, not one of everything. The per-plant quantities
              below are for the first bed or starter zone, not the whole yard at once.
            </p>
          </section>
        )}

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
              Matching your area with a small, useful native mix.
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
              Try a different mix.
            </h3>
            <p
              style={{
                margin: "0.85rem auto 0",
                maxWidth: "34rem",
                color: "#566453",
                lineHeight: 1.65,
              }}
            >
              We don&apos;t have a strong starter set for this exact combination yet, but
              the controls above will refresh the plan without losing your location.
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
            {plants.map((plant, index) => {
              const guide = plantingGuides[index];

              return (
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
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "0.85rem",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "2.3rem",
                          height: "2.3rem",
                          borderRadius: "999px",
                          background: "rgba(237, 242, 231, 0.92)",
                          color: "#2f4328",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      {plant.role && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            padding: "0.36rem 0.65rem",
                            background: "rgba(235, 241, 229, 0.95)",
                            color: "#42563d",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {plant.role}
                        </span>
                      )}
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
                        margin: "0 0 0.75rem",
                        fontWeight: 600,
                        color: "#35552d",
                        lineHeight: 1.45,
                        fontSize: "1rem",
                      }}
                    >
                      {plant.benefit}
                    </p>
                    {guide && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.45rem",
                          margin: "0 0 0.75rem",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            padding: "0.38rem 0.65rem",
                            background: "rgba(232, 240, 223, 0.92)",
                            color: "#35512f",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                          }}
                        >
                          Buy {guide.quantityLabel}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            padding: "0.38rem 0.65rem",
                            background: "rgba(246, 242, 232, 0.96)",
                            color: "#5b6250",
                            fontSize: "0.82rem",
                          }}
                        >
                          {guide.spacing}
                        </span>
                      </div>
                    )}
                    <p
                      style={{
                        margin: 0,
                        color: "#566453",
                        lineHeight: 1.58,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {plant.notes}
                    </p>
                    {guide && (
                      <p
                        style={{
                          margin: "0.7rem 0 0",
                          color: "#4b5b46",
                          lineHeight: 1.55,
                          fontSize: "0.93rem",
                        }}
                      >
                        {guide.grouping} Keep it in the {guide.zoneLabel.toLowerCase()}.
                      </p>
                    )}
                    <div
                      style={{
                        marginTop: "0.85rem",
                        paddingTop: "0.85rem",
                        borderTop: "1px solid rgba(104, 130, 90, 0.12)",
                      }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                        {getPlantPreviewTags(plant).map((tag) => (
                          <span
                            key={`${plant.name}-${tag}`}
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
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {plant.imageSourceUrl && (
                      <div
                        style={{
                          marginTop: "0.8rem",
                          fontSize: "0.85rem",
                          color: "#687565",
                        }}
                      >
                        <a
                          href={plant.imageSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#687565" }}
                        >
                          Photo source: {plant.imageSourceLabel}
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
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
                A layout you can picture
              </h2>
              <p style={{ margin: "0 0 1rem", color: "#596655", lineHeight: 1.6 }}>
                Group the numbered plants by zone instead of spacing everything evenly.
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
                What the patch is doing through the year
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
              Weekend checklist
            </p>
            <h2
              style={{
                margin: "0 0 0.8rem",
                fontSize: "1.9rem",
                lineHeight: 1.03,
                letterSpacing: "-0.05em",
              }}
            >
              What to do first
            </h2>
            <p style={{ margin: "0 0 1rem", color: "#596655", lineHeight: 1.6 }}>
              {planDetails.sizeRange}. Start with one clear zone and let the rest of the
              yard wait.
            </p>
            <div style={{ display: "grid", gap: "0.7rem" }}>
              {weekendChecklist.map((step, index) => (
                <article
                  key={step.title}
                  style={{
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.68)",
                    padding: "0.95rem 1rem",
                    color: "#41503f",
                    lineHeight: 1.55,
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "0.8rem",
                    alignItems: "start",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "999px",
                      background: "rgba(232, 240, 223, 0.92)",
                      color: "#31422d",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                    }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                        lineHeight: 1.2,
                        color: "#243323",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ margin: "0.3rem 0 0", color: "#5a6756", lineHeight: 1.55 }}>
                      {step.detail}
                    </p>
                  </div>
                </article>
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
            {plants.length > 0 ? (
              <>
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
                  Impact snapshot
                </p>
                <h2
                  style={{
                    margin: "0 0 0.8rem",
                    fontSize: "1.9rem",
                    lineHeight: 1.03,
                    letterSpacing: "-0.05em",
                  }}
                >
                  What this patch starts changing
                </h2>
                <p style={{ margin: "0 0 1rem", color: "#596655", lineHeight: 1.6 }}>
                  More habitat is the headline. The climate upside is a lighter-input
                  patch with more rooted perennial cover over time.
                </p>
                <div
                  className="impact-mini-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {impactCards.map((item) => (
                    <article
                      key={item.label}
                      style={{
                        borderRadius: "18px",
                        background: "linear-gradient(180deg, #eef3e6 0%, #f8f5ec 100%)",
                        padding: "0.95rem",
                        color: "#3f5139",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 0.3rem",
                          fontSize: "0.74rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#718069",
                          fontWeight: 700,
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          margin: "0 0 0.45rem",
                          fontSize: "1.2rem",
                          lineHeight: 1.05,
                          letterSpacing: "-0.04em",
                          color: "#243323",
                          fontWeight: 700,
                        }}
                      >
                        {item.value}
                      </p>
                      <p style={{ margin: 0, lineHeight: 1.55, color: "#586653" }}>{item.note}</p>
                    </article>
                  ))}
                </div>
                <p
                  style={{
                    margin: "0.95rem 0 0",
                    fontSize: "0.9rem",
                    lineHeight: 1.55,
                    color: "#687565",
                  }}
                >
                  Directional, not exact: we don&apos;t turn this into a single CO2 number,
                  because that depends on what the patch replaces.
                </p>
              </>
            ) : (
              <>
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
                  Native plants feed insects. Insects feed birds. Your yard starts acting
                  like habitat.
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
                  Start small, notice what shows up, and let the next patch happen from
                  there.
                </div>
              </>
            )}
          </section>
        </section>

        {plants.length > 0 && (
          <section
            style={{
              borderRadius: "26px",
              padding: "1.5rem",
              background: "rgba(247, 244, 234, 0.92)",
              border: warmBorder,
              marginTop: "1rem",
              marginBottom: "0.5rem",
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
              First-season care
            </p>
            <h2
              style={{
                margin: "0 0 0.8rem",
                fontSize: "1.9rem",
                lineHeight: 1.03,
                letterSpacing: "-0.05em",
              }}
            >
              What to do after planting
            </h2>
            <p style={{ margin: "0 0 1rem", color: "#596655", lineHeight: 1.6 }}>
              Keep the first season simple: help roots establish, keep weeds from taking
              over, and let the patch start behaving like a living planting.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.8rem",
              }}
            >
              {firstSeasonCare.map((step) => (
                <article
                  key={step.title}
                  style={{
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(104, 130, 90, 0.1)",
                    padding: "1rem",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.3rem",
                      fontSize: "0.76rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#6e7b69",
                      fontWeight: 700,
                    }}
                  >
                    {step.title}
                  </p>
                  <p style={{ margin: 0, color: "#566453", lineHeight: 1.6 }}>{step.detail}</p>
                </article>
              ))}
            </div>
          </section>
        )}
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

          .plan-real-garden-grid {
            grid-template-columns: 1fr !important;
          }

          .plan-real-garden-main {
            min-height: 320px !important;
          }

          .plan-real-garden-side {
            grid-template-rows: none !important;
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
          .refine-section,
          .plan-real-garden {
            border-radius: 24px !important;
            padding: 1.1rem !important;
          }

          .plan-hero-tags {
            gap: 0.45rem !important;
          }

          .plan-real-garden-main {
            min-height: 280px !important;
          }

          .plan-real-garden-scene {
            min-height: 180px !important;
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

          .impact-mini-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
