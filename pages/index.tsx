import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const useLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/plan?lat=${latitude}&lng=${longitude}`);
      },
      () => {
        alert("Location permission denied.");
      }
    );
  };

  const goWithZip = () => {
    const cleaned = zip.trim();
    if (cleaned.length >= 5) {
      router.push(`/plan?zip=${cleaned}`);
    } else {
      alert("Please enter a 5-digit ZIP code.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🌿 Rewild</h1>

      <p style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
        Your yard can be part of nature’s best hope.
      </p>

      <p style={{ marginBottom: "2rem", opacity: 0.75 }}>
        Find native plants and a simple plan to get started.
      </p>

      <button
        onClick={useLocation}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
          color: "white",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Start My Rewild Plan
      </button>

   <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", opacity: 0.6 }}>
  Uses your location to find native plants
</p>

<p style={{ marginTop: "2rem", opacity: 0.6 }}>or enter ZIP</p>

<input
  placeholder="60302"
  value={zip}
  onChange={(e) => setZip(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && goWithZip()}
  style={{
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "200px",
    marginTop: "0.5rem"
  }}
/>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", opacity: 0.6 }}>
        Inspired by <em>Nature’s Best Hope</em>.
      </p>
    </main>
  );
}