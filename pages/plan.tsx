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