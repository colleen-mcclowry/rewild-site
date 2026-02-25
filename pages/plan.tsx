import { useRouter } from "next/router";

export default function Plan() {
  const router = useRouter();
  const zip = (router.query.zip as string) || "";

  const region =
    zip === "60302"
      ? "Oak Park, IL"
      : zip.startsWith("60")
      ? "Midwest"
      : zip.startsWith("94")
      ? "Northern California"
      : "Your Region";

  const plants =
    region === "Oak Park, IL"
      ? ["Purple Coneflower", "Butterfly Milkweed", "Little Bluestem", "Wild Bergamot", "Prairie Dropseed"]
      : region === "Midwest"
      ? ["Black-Eyed Susan", "Goldenrod", "Switchgrass", "New England Aster", "Wild Lupine"]
      : region === "Northern California"
      ? ["California Poppy", "Coyote Mint", "Yarrow", "Ceanothus", "Douglas Iris"]
      : ["Native Wildflower Mix", "Local Milkweed", "Native Grass", "Goldenrod", "Aster"];

  return (
    <main style={{ minHeight: "100vh", padding: "2rem", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Your Rewild Starter Plan 🌿</h1>

      <p style={{ marginBottom: "1rem" }}>
        Based on ZIP code <strong>{zip}</strong>, you're in <strong>{region}</strong>.
      </p>

      <ul>
        {plants.map((p) => (
          <li key={p} style={{ marginBottom: "0.5rem" }}>
            {p}
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "2rem" }}>
        {region === "Oak Park, IL"
          ? "These native prairie plants thrive in Chicagoland soil, support monarchs and native bees, and reduce the need for watering and chemicals."
          : "These plants support pollinators, reduce water use, and build real habitat."}
      </p>
    </main>
  );
}