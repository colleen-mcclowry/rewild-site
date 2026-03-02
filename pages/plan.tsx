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

    if (latitude > 40 && latitude < 43) {
      region = "Midwest";
    } else if (latitude > 36 && latitude < 39) {
      region = "Northern California";
    } else if (latitude > 40 && latitude < 42) {
      region = "Northeast";
    }
  }

 return (
  <main style={{ padding: 40 }}>
    <h1>Your Rewild Plan</h1>
    <p style={{ fontSize: 18 }}>
      Based on your location, you're in the <strong>{region}</strong>.
    </p>
    <p>
      Here’s what thrives in your area:
    </p>
  </main>
);