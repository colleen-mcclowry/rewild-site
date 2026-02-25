"use client";
import { useSearchParams } from "next/navigation";

export default function Plan() {
  const searchParams = useSearchParams();
  const zip = searchParams.get("zip") || "";

  const region = zip.startsWith("60")
    ? "Midwest"
    : zip.startsWith("94")
    ? "Northern California"
    : "Your Region";

  const plants =
    region === "Midwest"
      ? ["Purple Coneflower", "Butterfly Milkweed", "Little Bluestem", "Wild Bergamot", "Black-Eyed Susan"]
      : region === "Northern California"
      ? ["California Poppy", "Coyote Mint", "Yarrow", "Ceanothus", "Douglas Iris"]
      : ["Native Wildflower Mix", "Local Milkweed", "Native Grass", "Goldenrod", "Aster"];

  return (
    <main style={{
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "system-ui"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Your Rewild Starter Plan 🌿
      </h1>

      <p style={{ marginBottom: "1rem" }}>
        Based on ZIP code <strong>{zip}</strong>, you're in the <strong>{region}</strong>.
      </p>

      <ul>
        {plants.map((plant) => (
          <li key={plant} style={{ marginBottom: "0.5rem" }}>
            {plant}
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "2rem" }}>
        These plants support pollinators, reduce water use, and build real habitat.
      </p>
    </main>
  );
}