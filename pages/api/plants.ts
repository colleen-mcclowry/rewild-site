import type { NextApiRequest, NextApiResponse } from "next";

type Plant = {
  name: string;
  latin?: string;
  benefit: string;
  notes: string;
  image: string;
};

type PlantsResponse = {
  ecosystem: string;
  plants: Plant[];
};

function getRegionFromQuery(region: string | undefined, zip: string | undefined): string {
  if (region) {
    return region;
  }

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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlantsResponse | { error: string }>
) {
  const region = typeof req.query.region === "string" ? req.query.region : undefined;
  const zip = typeof req.query.zip === "string" ? req.query.zip : undefined;
  const resolvedRegion = getRegionFromQuery(region, zip);

  res.status(200).json({
    ecosystem: getEcosystemLabel(resolvedRegion),
    plants: getPlantsForRegion(resolvedRegion),
  });
}
