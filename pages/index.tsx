import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const goWithZip = () => {
    <button onClick={useLocation}>
  Use my location
</button>
    const cleaned = zip.trim();
    if (cleaned.length >= 5) {
      router.push(`/plan?zip=${cleaned}`);
    }
  };

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

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "system-ui",
      padding: "2rem",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
        Rewild 🌿
      </h1>

      <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
        Turn your yard into habitat.
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
          marginBottom: "1rem"
        }}
      >
        Use My Location
      </button>

      <p style={{ marginBottom: "0.5rem", opacity: 0.7 }}>or enter ZIP</p>

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
          marginBottom: "0.5rem"
        }}
      />

      <button
        onClick={goWithZip}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "1px solid black",
          background: "white",
          cursor: "pointer"
        }}
      >
        Get Plan
      </button>
    </main>
  );
}