export default function Home() {
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
      <p style={{ fontSize: "1.25rem", maxWidth: "600px" }}>
        Turn your yard into habitat.
        <br />
        Native plants. Simple plans. Local community.
      </p>
    </main>
  );
}
