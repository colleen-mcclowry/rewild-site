import type { NextApiRequest, NextApiResponse } from "next";

type SunPreference = "full-sun" | "part-shade" | "mostly-shade";
type SpacePreference = "small-patch" | "medium-yard" | "large-yard";
type RegionKey = "midwest" | "california" | "northeast";

type Plant = {
  name: string;
  latin?: string;
  benefit: string;
  notes: string;
  role?: string;
  fitReasons?: string[];
  placementNote?: string;
  image?: string;
  imageSourceLabel?: string;
  imageSourceUrl?: string;
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

type PlantCatalog = Record<RegionKey, Record<SunPreference, Plant[]>>;

type PlantImageMeta = {
  image: string;
  imageSourceLabel: string;
  imageSourceUrl: string;
};

const sunLabels: Record<SunPreference, string> = {
  "full-sun": "Full sun",
  "part-shade": "Part shade",
  "mostly-shade": "Mostly shade",
};

const spaceDetails: Record<
  SpacePreference,
  { label: string; sizeRange: string; strategy: string; plantCount: number }
> = {
  "small-patch": {
    label: "Small patch",
    sizeRange: "About 3 x 6 ft to 8 x 10 ft",
    strategy: "Start with one compact habitat pocket that looks intentional fast.",
    plantCount: 3,
  },
  "medium-yard": {
    label: "Medium yard",
    sizeRange: "About 200 to 1,000 sq ft, roughly 10 x 20 ft to 20 x 50 ft",
    strategy: "Build one anchor bed first, then connect it to a second planting zone.",
    plantCount: 5,
  },
  "large-yard": {
    label: "Large yard / plot",
    sizeRange: "About 1,000 sq ft+ up to 1/4 acre or more",
    strategy: "Think in habitat zones so the planting feels manageable instead of overwhelming.",
    plantCount: 6,
  },
};

const plantCatalog: PlantCatalog = {
  midwest: {
    "full-sun": [
      {
        name: "Purple Coneflower",
        latin: "Echinacea purpurea",
        benefit: "Long bloom time for bees and butterflies",
        notes: "A dependable prairie flower that brings color and pollinator activity quickly.",
        image:
          "https://images.unsplash.com/photo-1627923109045-01caba5a8b71?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Wild Bergamot",
        latin: "Monarda fistulosa",
        benefit: "Heavy pollinator traffic in summer",
        notes: "Fragrant blooms that thrive in sunny prairie-style plantings.",
        image:
          "https://images.unsplash.com/photo-1621619858360-7f79b3f3b2a9?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Butterfly Milkweed",
        latin: "Asclepias tuberosa",
        benefit: "Supports monarch butterflies",
        notes: "Bright orange flowers with excellent wildlife value in drier sunny spots.",
        image:
          "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Prairie Dropseed",
        latin: "Sporobolus heterolepis",
        benefit: "Soft structure and nesting cover",
        notes: "A graceful native grass that anchors a planting with movement and texture.",
        image:
          "https://images.unsplash.com/photo-1625246333196-5b21f2bced1e?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Little Bluestem",
        latin: "Schizachyrium scoparium",
        benefit: "Year-round habitat and warm-season texture",
        notes: "A strong native grass that adds coppery fall color and upright form.",
        image:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Black-Eyed Susan",
        latin: "Rudbeckia hirta",
        benefit: "Fast color for a beginner-friendly bed",
        notes: "A cheerful, forgiving native that helps new plantings feel established early.",
        image:
          "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=70",
      },
    ],
    "part-shade": [
      {
        name: "Columbine",
        latin: "Aquilegia canadensis",
        benefit: "Early nectar for hummingbirds and bees",
        notes: "A woodland-edge favorite that handles part shade gracefully.",
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Wild Geranium",
        latin: "Geranium maculatum",
        benefit: "Gentle spring bloom for shady edges",
        notes: "A soft native perennial that fills in beautifully in dappled light.",
        image:
          "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Bee Balm",
        latin: "Monarda didyma",
        benefit: "Bold color in lighter shade",
        notes: "A pollinator magnet that performs well with morning sun and afternoon relief.",
        image:
          "https://images.unsplash.com/photo-1565019011521-b0575c2067b5?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Bottlebrush Grass",
        latin: "Elymus hystrix",
        benefit: "Texture for woodland-style planting",
        notes: "A shade-tolerant native grass that softens the edge of a more natural bed.",
        image:
          "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Jacob's Ladder",
        latin: "Polemonium reptans",
        benefit: "Early-season flowers for beneficial insects",
        notes: "A compact native that helps part-shade plantings feel layered and lush.",
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Solomon's Seal",
        latin: "Polygonatum biflorum",
        benefit: "Elegant foliage and woodland structure",
        notes: "Useful for calmer, more leaf-forward planting areas with gentle light.",
        image:
          "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=70",
      },
    ],
    "mostly-shade": [
      {
        name: "Virginia Bluebells",
        latin: "Mertensia virginica",
        benefit: "A spring woodland moment that feels magical",
        notes: "A beautiful ephemeral for cooler shady beds.",
        image:
          "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Foamflower",
        latin: "Tiarella cordifolia",
        benefit: "Soft ground-layer bloom for shade",
        notes: "A woodland native that helps fill a shady planting without feeling heavy.",
        image:
          "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Wild Ginger",
        latin: "Asarum canadense",
        benefit: "Living groundcover in deeper shade",
        notes: "Lush heart-shaped foliage that stabilizes a quiet shady bed.",
        image:
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Christmas Fern",
        latin: "Polystichum acrostichoides",
        benefit: "Evergreen texture for shade structure",
        notes: "A strong foliage plant for making shady beds feel intentional year-round.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "White Wood Aster",
        latin: "Eurybia divaricata",
        benefit: "Late-season flowers in bright shade",
        notes: "Adds pollinator value at the edges of shadier planting zones.",
        image:
          "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Penn Sedge",
        latin: "Carex pensylvanica",
        benefit: "Soft native matrix for woodland beds",
        notes: "A low, grassy native that helps larger shady areas feel cohesive.",
        image:
          "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=70",
      },
    ],
  },
  california: {
    "full-sun": [
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
      {
        name: "Cleveland Sage",
        latin: "Salvia clevelandii",
        benefit: "High fragrance and pollinator value",
        notes: "A sun-loving shrublet that gives California plantings a signature scent.",
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Buckwheat",
        latin: "Eriogonum fasciculatum",
        benefit: "Excellent habitat plant for dry gardens",
        notes: "Tough, airy, and one of the most useful plants for local insects.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Blue Fescue",
        latin: "Festuca californica",
        benefit: "Cool texture and durable structure",
        notes: "Helps larger sunny plantings feel composed and finished.",
        image:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=70",
      },
    ],
    "part-shade": [
      {
        name: "Coral Bells",
        latin: "Heuchera maxima",
        benefit: "Foliage interest and spring bloom",
        notes: "A strong plant for brighter shaded California gardens.",
        image:
          "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Douglas Iris",
        latin: "Iris douglasiana",
        benefit: "Elegant native bloom for filtered light",
        notes: "Brings a more refined woodland-coastal feel to part shade.",
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Woodland Strawberry",
        latin: "Fragaria vesca",
        benefit: "Living groundcover with seasonal interest",
        notes: "Useful for knitting together the front edge of a shadier bed.",
        image:
          "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "California Fuchsia",
        latin: "Epilobium canum",
        benefit: "Late color for hummingbirds",
        notes: "Handles some shade while still bringing strong wildlife appeal.",
        image:
          "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Redwood Sedge",
        latin: "Carex divulsa",
        benefit: "Soft matrix planting for part shade",
        notes: "Creates a calm, natural base for more colorful native flowers.",
        image:
          "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Coffeeberry",
        latin: "Frangula californica",
        benefit: "Shrub structure for larger habitat plans",
        notes: "Useful as a backbone plant in medium and large layered plantings.",
        image:
          "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=70",
      },
    ],
    "mostly-shade": [
      {
        name: "Western Sword Fern",
        latin: "Polystichum munitum",
        benefit: "Evergreen structure in deeper shade",
        notes: "A reliable west-coast native for creating lush woodland texture.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Redwood Sorrel",
        latin: "Oxalis oregana",
        benefit: "Soft, bright ground layer for shade",
        notes: "Makes shady spaces feel alive and coherent instead of empty.",
        image:
          "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Inside-Out Flower",
        latin: "Vancouveria hexandra",
        benefit: "Airy bloom for woodland-style planting",
        notes: "Adds delicate movement and keeps deeper shade from feeling flat.",
        image:
          "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Yerba Buena",
        latin: "Clinopodium douglasii",
        benefit: "Fragrant living carpet in cool shade",
        notes: "A groundcover choice that makes intimate shaded spaces feel special.",
        image:
          "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Goat's Beard",
        latin: "Aruncus dioicus",
        benefit: "Height and soft bloom in moister shade",
        notes: "Useful when a larger shady plan needs a little lift and drama.",
        image:
          "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Huckleberry",
        latin: "Vaccinium ovatum",
        benefit: "Wildlife-supporting shrub for layered shade",
        notes: "Helps larger shady spaces feel like habitat, not just a planting bed.",
        image:
          "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=70",
      },
    ],
  },
  northeast: {
    "full-sun": [
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
      {
        name: "New England Aster",
        latin: "Symphyotrichum novae-angliae",
        benefit: "Late-season bloom when pollinators need it most",
        notes: "A strong choice for extending the season in a sunny bed.",
        image:
          "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Switchgrass",
        latin: "Panicum virgatum",
        benefit: "Vertical structure and seed value",
        notes: "Helps medium and large sunny beds feel grounded and layered.",
        image:
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Butterfly Weed",
        latin: "Asclepias tuberosa",
        benefit: "Supports monarchs and other insects",
        notes: "A sun-loving wildlife plant with strong visual payoff.",
        image:
          "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=70",
      },
    ],
    "part-shade": [
      {
        name: "Wild Columbine",
        latin: "Aquilegia canadensis",
        benefit: "Early color in softer light",
        notes: "Brings delicate movement and hummingbird interest to part shade.",
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Foamflower",
        latin: "Tiarella cordifolia",
        benefit: "Useful front-of-bed woodland bloom",
        notes: "A strong native for making part-shade beds feel cohesive.",
        image:
          "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Jacob's Ladder",
        latin: "Polemonium reptans",
        benefit: "Spring flowers for beneficial insects",
        notes: "Gives a softer, more lush feel to gentler light conditions.",
        image:
          "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Penn Sedge",
        latin: "Carex pensylvanica",
        benefit: "Natural matrix plant for part shade",
        notes: "Useful for creating a calm base layer around showier flowers.",
        image:
          "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "White Wood Aster",
        latin: "Eurybia divaricata",
        benefit: "Late-season pollinator support in shade edges",
        notes: "Extends bloom season in brighter wooded spaces.",
        image:
          "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Blue-Stemmed Goldenrod",
        latin: "Solidago caesia",
        benefit: "Woodland-friendly late flowers",
        notes: "Brings fall habitat value without demanding full sun.",
        image:
          "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=70",
      },
    ],
    "mostly-shade": [
      {
        name: "Christmas Fern",
        latin: "Polystichum acrostichoides",
        benefit: "Evergreen structure in shady beds",
        notes: "A classic foundation plant for northeastern shade gardens.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Wild Ginger",
        latin: "Asarum canadense",
        benefit: "Ground-layer texture in deep shade",
        notes: "Useful for filling the quiet lower layer of a woodland planting.",
        image:
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Virginia Bluebells",
        latin: "Mertensia virginica",
        benefit: "A spring woodland reveal",
        notes: "Makes shaded beds feel seasonal and alive early in the year.",
        image:
          "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Partridgeberry",
        latin: "Mitchella repens",
        benefit: "Living groundcover with wildlife value",
        notes: "Ideal for making shady beds feel lush at the feet of taller plants.",
        image:
          "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Solomon's Seal",
        latin: "Polygonatum biflorum",
        benefit: "Elegant structure for layered shade",
        notes: "Adds height and calm rhythm to a low-light planting.",
        image:
          "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=70",
      },
      {
        name: "Foamflower",
        latin: "Tiarella cordifolia",
        benefit: "Soft bloom to brighten deeper shade",
        notes: "Repeats beautifully in larger shady patches and woodland edges.",
        image:
          "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=70",
      },
    ],
  },
};

function commonsImage(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
}

const curatedImageByPlantName: Partial<Record<string, PlantImageMeta>> = {
  "Purple Coneflower": {
    image: commonsImage("Purple coneflower (lat.echinacea purpurea) plant.jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Purple_coneflower_(lat.echinacea_purpurea)_plant.jpg",
  },
  "Wild Bergamot": {
    image: commonsImage("Monarda fistulosa - Wild Bergamot.jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Monarda_fistulosa_-_Wild_Bergamot.jpg",
  },
  "Butterfly Milkweed": {
    image: commonsImage("Asclepias tuberosa (butterfly milkweed) (54309755024).jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Asclepias_tuberosa_(butterfly_milkweed)_(54309755024).jpg",
  },
  "Little Bluestem": {
    image: commonsImage("Little bluestem (11672134614).jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Little_bluestem_(11672134614).jpg",
  },
  "Black-Eyed Susan": {
    image: commonsImage("Rudbeckia hirta - Black Eyed Susan.jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Rudbeckia_hirta_-_Black_Eyed_Susan.jpg",
  },
  "Bee Balm": {
    image: commonsImage("Monarda didyma (39371530400).jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Monarda_didyma_(39371530400).jpg",
  },
  Columbine: {
    image: commonsImage("Red Columbine acquilegia canadensis.jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Red_Columbine_acquilegia_canadensis.jpg",
  },
  "Wild Geranium": {
    image: commonsImage("Geranium maculatum, Kane Woods Nature Area, 2025-05-12.jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Geranium_maculatum,_Kane_Woods_Nature_Area,_2025-05-12.jpg",
  },
  "Jacob's Ladder": {
    image: commonsImage(
      "Jacob's Ladder (Polemonium reptans), close-up of flowers, New Jersey, 051520, Becky Laboy.jpg"
    ),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jacob%27s_Ladder_(Polemonium_reptans),_close-up_of_flowers,_New_Jersey,_051520,_Becky_Laboy.jpg",
  },
  "Solomon's Seal": {
    image: commonsImage("Smooth solomon's seal (Polygonatum biflorum) (47666983981).jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Smooth_solomon%27s_seal_(Polygonatum_biflorum)_(47666983981).jpg",
  },
  "Virginia Bluebells": {
    image: commonsImage("Virginia Bluebells (Mertensia virginica).jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Virginia_Bluebells_(Mertensia_virginica).jpg",
  },
  Foamflower: {
    image: commonsImage("Tiarella cordifolia - Foamflower (5760217966).jpg"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tiarella_cordifolia_-_Foamflower_(5760217966).jpg",
  },
  "Wild Ginger": {
    image: commonsImage("Wild Ginger (Asarum canadense) (1af1795b-155d-451f-6797-7cdfce9dfec9).JPG"),
    imageSourceLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wild_Ginger_(Asarum_canadense)_(1af1795b-155d-451f-6797-7cdfce9dfec9).JPG",
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

function getRegionKey(region: string): RegionKey {
  if (region.includes("California")) return "california";
  if (region.includes("New York") || region.includes("Northeast")) return "northeast";
  return "midwest";
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

function getPlantsForPlan(
  region: string,
  sun: SunPreference,
  space: SpacePreference
): Plant[] {
  const regionKey = getRegionKey(region);
  const availablePlants = plantCatalog[regionKey][sun];
  const targetCount = spaceDetails[space].plantCount;

  return availablePlants.slice(0, targetCount).map((plant, index) => {
    const curated = curatedImageByPlantName[plant.name];
    const role =
      index === 0
        ? "Anchor plant"
        : index === targetCount - 1
          ? "Structure plant"
          : "Supporting plant";
    const placementPrefix: Record<SpacePreference, string> = {
      "small-patch": "Use this in a tight cluster so the bed feels intentional quickly.",
      "medium-yard": "Repeat this in a few small drifts to make the planting feel connected.",
      "large-yard": "Use this as one layer within a larger habitat zone, not as a one-off.",
    };
    const fitReasons = [
      `${sunLabels[sun]} conditions`,
      `${spaceDetails[space].label.toLowerCase()} scale`,
      index === 0 ? "fast visual payoff" : index === targetCount - 1 ? "structure and habitat" : "supports pollinators and flow",
    ];
    const placementNote = `${placementPrefix[space]} ${spaceDetails[space].strategy}`;

    if (curated) {
      return { ...plant, ...curated, role, fitReasons, placementNote };
    }

    return {
      ...plant,
      role,
      fitReasons,
      placementNote,
      image: undefined,
      imageSourceLabel: undefined,
      imageSourceUrl: undefined,
    };
  });
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

  res.status(200).json({
    ecosystem: getEcosystemLabel(resolvedRegion),
    plants: getPlantsForPlan(resolvedRegion, sun, space),
    plan: buildPlanDetails(resolvedRegion, sun, space),
  });
}
