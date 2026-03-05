import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [zip, setZip] = useState("");
  const [showZip, setShowZip] = useState(false);
  const router = useRouter();

  const goWithZip = (value?: string) => {
    const cleaned = (value ?? zip).trim();

    if (cleaned.length === 5) {
      console.log("ZIP submit:", cleaned);
      router.push(`/plan?zip=${cleaned}`);
    }
  };

  const handleLocation = () => {
    console.log("CTA clicked");

    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      alert("Geolocation not supported. Please enter your ZIP code instead.");
      setShowZip(true);
      return;
    }

    console.log("Requesting geolocation...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Location success:", latitude, longitude);

        router.push(`/plan?lat=${latitude}&lng=${longitude}`);
      },
      (error) => {
        console.log("Location error:", error);

        alert("We couldn't access your location. Please enter your ZIP instead.");
        setShowZip(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
      }
    );
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
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
        Rewild 🌿
      </h1>

      <p style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
        Your yard can be part of nature’s best hope.
      </p>

      <p style={{ marginBottom: "2rem", opacity: 0.75 }}>
        Find native plants and a simple plan to get started.
      </p>

      <button
        type="button"
        onClick={handleLocation}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
          color: "white",
          cursor: "pointer",
        }}
      >
        Start My Rewild Plan
      </button>

      <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", opacity: 0.6 }}>
        Uses your location to find native plants
      </p>

      {!showZip ? (
        <button
          type="button"
          onClick={() => setShowZip(true)}
          style={{
            marginTop: "1.25rem",
            fontSize: "0.95rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            opacity: 0.65,
          }}
        >
          Enter ZIP instead
        </button>
      ) : (
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ opacity: 0.6, marginBottom: "0.75rem" }}>
            Enter ZIP
          </p>

          <input
            placeholder="60302"
            value={zip}
            inputMode="numeric"
            autoComplete="postal-code"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              setZip(value);

              if (value.length === 5) {
                goWithZip(value);
              }
            }}
            style={{
              padding: "0.75rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "200px",
            }}
          />
        </div>
      )}
    </main>
  );
}