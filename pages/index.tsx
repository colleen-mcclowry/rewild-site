import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const go = () => {
    const cleaned = zip.trim();
    if (cleaned.length >= 5) router.push(`/plan?zip=${cleaned}`);
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

      <p style={{ fontSize: "1.25rem", marginBottom: "2rem", maxWidth: 640 }}>
        Turn your yard into habitat.<br />
        Native plants. Simple plans. Local community.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <input
          inputMode="numeric"
          placeholder="Enter ZIP (e.g., 60302)"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          style={{
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "260px"
          }}
        />

        <button
          onClick={go}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "black",
            color: "white",
            cursor: "pointer"
          }}
        >
          Get my plan
        </button>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "0.95rem", opacity: 0.75 }}>
        Start small: 5 plants you can actually find and grow.
      </p>
    </main>
  );
}