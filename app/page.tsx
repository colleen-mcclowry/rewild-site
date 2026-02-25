"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (zip.length >= 5) {
      router.push(`/plan?zip=${zip}`);
    }
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
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Rewild 🌿
      </h1>

      <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
        Turn your yard into habitat.
      </p>

      <input
        type="text"
        placeholder="Enter your ZIP code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        style={{
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "1rem",
          width: "250px"
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#2e7d32",
          color: "white",
          cursor: "pointer"
        }}
      >
        Get My Native Plan
      </button>
    </main>
  );
}