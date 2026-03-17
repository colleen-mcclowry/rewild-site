export type GardenPlanStatus = "idea" | "planned" | "planted";

export type SavedGardenPlant = {
  name: string;
  latin?: string;
  benefit: string;
  image?: string;
};

export type SavedGardenPlan = {
  id: string;
  title: string;
  region: string;
  locationSource: string;
  ecosystem: string;
  planUrl: string;
  sunLabel: string;
  spaceLabel: string;
  goalLabel: string;
  sizeRange: string;
  plantCount: number;
  plants: SavedGardenPlant[];
  status: GardenPlanStatus;
  savedAt: string;
  updatedAt: string;
};

export type SaveGardenPlanInput = Omit<
  SavedGardenPlan,
  "id" | "status" | "savedAt" | "updatedAt"
>;

const STORAGE_KEY = "rewild.myGardenPlans";

export const gardenStatusLabels: Record<GardenPlanStatus, string> = {
  idea: "Idea",
  planned: "Planned",
  planted: "Planted",
};

function sortPlans(plans: SavedGardenPlan[]) {
  return [...plans].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function readPlans(): SavedGardenPlan[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return sortPlans(
      parsed.filter((item): item is SavedGardenPlan => {
        return (
          Boolean(item) &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.planUrl === "string" &&
          typeof item.status === "string" &&
          typeof item.savedAt === "string" &&
          typeof item.updatedAt === "string"
        );
      })
    );
  } catch (error) {
    console.error("my garden read failed", error);
    return [];
  }
}

function writePlans(plans: SavedGardenPlan[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortPlans(plans)));
  } catch (error) {
    console.error("my garden write failed", error);
  }
}

function createPlanId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getGardenPlans() {
  return readPlans();
}

export function saveGardenPlan(input: SaveGardenPlanInput) {
  const plans = readPlans();
  const timestamp = new Date().toISOString();
  const existingPlan = plans.find((plan) => plan.planUrl === input.planUrl);

  if (existingPlan) {
    const updatedPlan: SavedGardenPlan = {
      ...existingPlan,
      ...input,
      updatedAt: timestamp,
    };
    const nextPlans = sortPlans(
      plans.map((plan) => (plan.id === existingPlan.id ? updatedPlan : plan))
    );

    writePlans(nextPlans);

    return {
      mode: "updated" as const,
      plans: nextPlans,
      savedPlan: updatedPlan,
    };
  }

  const savedPlan: SavedGardenPlan = {
    ...input,
    id: createPlanId(),
    status: "idea",
    savedAt: timestamp,
    updatedAt: timestamp,
  };
  const nextPlans = sortPlans([savedPlan, ...plans]);

  writePlans(nextPlans);

  return {
    mode: "created" as const,
    plans: nextPlans,
    savedPlan,
  };
}

export function updateGardenPlanStatus(id: string, status: GardenPlanStatus) {
  const plans = readPlans();
  const updatedAt = new Date().toISOString();
  const nextPlans = sortPlans(
    plans.map((plan) => (plan.id === id ? { ...plan, status, updatedAt } : plan))
  );

  writePlans(nextPlans);

  return nextPlans;
}

export function removeGardenPlan(id: string) {
  const nextPlans = readPlans().filter((plan) => plan.id !== id);

  writePlans(nextPlans);

  return nextPlans;
}
