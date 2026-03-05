import { useRouter } from "next/router";

export default function Plan() {
  const router = useRouter();
  const { zip, lat, lng } = router.query;

  let region = "Your Region";

  if (zip === "60302") {
    region = "Oak Park, IL";
  } else if (typeof zip === "string" && zip.startsWith("60")) {
    region = "Midwest";
  }

  if (lat && lng) {
    const latitude = parseFloat(lat as string);

    if (latitude > 39 && latitude < 45) {
      region = "Midwest";
    } else if (latitude > 36 && latitude < 39) {
      region = "Northern California";
    } else if (latitude > 40 && latitude < 45) {
      region = "Northeast";
    }
  }

  let plants: string[] = [];

  if (region === "Midwest" || region === "Oak Park, IL") {
    plants = [
      "Purple Coneflower",
      "Butterfly Milkweed",
      "Little Bluestem"
    ];
  }

  if (region === "Northern California") {
    plants = [
      "California Poppy",
      "Yarrow",
      "Blue Wildrye"
    ];
  }

  if (region === "Northeast") {
    plants = [
      "Wild Bergamot",
      "Black Eyed Susan",
      "Switchgrass"
    ];
  }

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Your Rewild Plan</h1>

      <p style={{ fontSize: 18 }}>
        Based on your location, you're in the <strong>{region}</strong>.
      </p>

      <h2 style={{ marginTop: 30 }}>Native Starter Plants</h2>

      <ul style={{ fontSize: 18, lineHeight: 1.8 }}>
        {plants.map((plant) => (
          <li key={plant}>{plant}</li>
        ))}
      </ul>
    </main>
  );
}