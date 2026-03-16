import type { NextApiRequest, NextApiResponse } from "next";

type SunPreference = "full-sun" | "part-shade" | "mostly-shade";
type SpacePreference = "small-patch" | "medium-yard" | "large-yard";

type Plant = {
  name: string;
  latin?: string;
  benefit: string;
  notes: string;
  image: string;
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

type PlantsResponse = {
  ecosystem: string;
  plants: Plant[];
  plan: PlanDetails;
};

const sunLabels: Record<SunPreference, string> = {
  "full-sun": "Full sun",
  "part-shade": "Part shade",
  "mostly-shade": "Mostly shade",
};

const spaceDetails: Record<
  SpacePreference,
  { label: string; sizeRange: string; strategy: string }
> = {
  "small-patch": {
    label: "Small patch",
    sizeRange: "About 3 x 6 ft to 8 x 10 ft",
    strategy: "Start with one compact habitat pocket that looks intentional fast.",
  },
  "medium-yard": {
    label: "Medium yard",
    sizeRange: "About 200 to 1,000 sq ft, roughly 10 x 20 ft to 20 x 50 ft",
    strategy: "Build one anchor bed first, then connect it to a second planting zone.",
  },
  "large-yard": {
    label: "Large yard / plot",
    sizeRange: "About 1,000 sq ft+ up to 1/4 acre or more",
    strategy: "Think in habitat zones so the planting feels manageable instead of overwhelming.",
  },
};

function getRegionFromQuery(region: string | undefined, zip: string | undefined): string {
  if (region) return region;
  if (zip === "60302") return "Oak Park, Illinois";
  if (zip?.startsWith("60")) return "Illinois";
  if (zip?.startsWith("94")) return "California";
  if (zip?.startsWith("10") || zip?.startsWith("11")) return "New York";
  return "Your Region";
}

function getEcosystemLabel(region: string): string {
  if (
    region.includes("Illinois") ||
    region.includes("Oak Park") ||
    region.includes("Chicago")
  ) {
    return "Prairie / Oak Savanna ecosystem";
  }

  if (region.includes("California")) {
    return "California grassland / chaparral ecosystem";
  }

  if (region.includes("New York") || region.includes("Northeast")) {
    return "Northeastern meadow / woodland ecosystem";
  }

  return "Local native plant ecosystem";
}

function getPlantsForRegion(region: string): Plant[] {
  const midwest: Plant[] = [
    {
      name: "Purple Coneflower",
      latin: "Echinacea purpurea",
      benefit: "Loved by bees and butterflies",
      notes: "Hardy, colorful, and excellent for pollinators.",
      image:
        "https://images.unsplash.com/photo-1627923109045-01caba5a8b71?auto=format&fit=crop&w=1200&q=70",
    },
    {
      name: "Wild Bergamot",
      latin: "Monarda fistulosa",
      benefit: "Brings pollinators into the garden fast",
      notes: "Fragrant blooms that thrive in sunny prairie-style plantings.",
      image:
        "https://images.unsplash.com/photo-1621619858360-7f79b3f3b2a9?auto=format&fit=crop&w=1200&q=70",
    },
    {
      name: "Prairie Dropseed",
      latin: "Sporobolus heterolepis",
      benefit: "Adds habitat structure and softness",
      notes: "A graceful native grass that anchors a low-maintenance planting.",
      image:
        "https://images.unsplash.com/photo-1625246333196-5b21f2bced1e?auto=format&fit=crop&w=1200&q=70",
    },
  ];

  const california: Plant[] = [
    {
      name: "California Poppy",
      latin: "Eschscholzia californica",
      benefit: "Bright nectar source for native insects",
      notes: "Iconic blooms that handle sun and dry conditions beautifully.",
      image:
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=70",
    },
    {
      name: "Yarrow",
      latin: "Achillea millefolium",
      benefit: "Supports beneficial insects across seasons",
      notes: "Adaptable and tough, with flat flower clusters pollinators love.",
      image:
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=70",
    },
    {
      name: "Deer Grass",
      latin: "Muhlenbergia rigens",
      benefit: "Creates shelter and year-round structure",
      notes: "A sculptural native grass that brings movement to dry gardens.",
      image:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=70",
    },
  ];

  const northeast: Plant[] = [
    {
      name: "Black-Eyed Susan",
      latin: "Rudbeckia hirta",
      benefit: "Easy color and pollinator value",
      notes: "Cheerful blooms that make a forgiving starter plant for new gardeners.",
      image:
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=70",
    },
    {
      name: "Bee Balm",
      latin: "Monarda didyma",
      benefit: "A magnet for bees and hummingbirds",
      notes: "Bold flowers and a cottage-garden feel with strong habitat value.",
      image:
        "https://images.unsplash.com/photo-1565019011521-b0575c2067b5?auto=format&fit=crop&w=1200&q=70",
    },
    {
      name: "Little Bluestem",
      latin: "Schizachyrium scoparium",
      benefit: "Adds texture and seasonal shelter",
      notes: "A native grass with beautiful color shifts through the year.",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=70",
    },
  ];

  if (region.includes("California")) return california;
  if (region.includes("New York") || region.includes("Northeast")) return northeast;
  return midwest;
}

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

function tailorPlants(
  plants: Plant[],
  sun: SunPreference,
  space: SpacePreference
): Plant[] {
  const sunGuidance: Record<SunPreference, string> = {
    "full-sun": "Best in a sunny spot with 6+ hours of light.",
    "part-shade": "Happy with softer light and some afternoon shade.",
    "mostly-shade": "A better fit for gentler light and cooler edges of the yard.",
  };

  const spaceGuidance: Record<SpacePreference, string> = {
    "small-patch": "Ideal for a compact starter planting.",
    "medium-yard": "Works well as part of a layered medium-size bed.",
    "large-yard": "Can anchor one zone within a larger rewilding plan.",
  };

  return plants.map((plant, index) => ({
    ...plant,
    notes: `${plant.notes} ${sunGuidance[sun]} ${spaceGuidance[space]}${
      index === 0 ? " This one makes a strong first anchor plant." : ""
    }`,
  }));
}

function buildPlanDetails(
  region: string,
  sun: SunPreference,
  space: SpacePreference
): PlanDetails {
  const regionLabel = region === "Your Region" ? "your area" : region;
  const spaceInfo = spaceDetails[space];

  return {
    sun,
    sunLabel: sunLabels[sun],
    space,
    spaceLabel: spaceInfo.label,
    sizeRange: spaceInfo.sizeRange,
    strategy: spaceInfo.strategy,
    title: `${sunLabels[sun]} plan for ${regionLabel}`,
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlantsResponse | { error: string }>
) {
  const region = typeof req.query.region === "string" ? req.query.region : undefined;
  const zip = typeof req.query.zip === "string" ? req.query.zip : undefined;
  const sun = parseSunPreference(
    typeof req.query.sun === "string" ? req.query.sun : undefined
  );
  const space = parseSpacePreference(
    typeof req.query.space === "string" ? req.query.space : undefined
  );
  const resolvedRegion = getRegionFromQuery(region, zip);
  const plants = tailorPlants(getPlantsForRegion(resolvedRegion), sun, space);

  res.status(200).json({
    ecosystem: getEcosystemLabel(resolvedRegion),
    plants,
    plan: buildPlanDetails(resolvedRegion, sun, space),
  });
}
