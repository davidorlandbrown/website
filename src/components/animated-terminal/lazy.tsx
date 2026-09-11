"use client";

import dynamic from "next/dynamic";

const AnimatedTerminalComponent = dynamic(() => import("./index"), {
  loading: () => (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "#6b7280",
        backgroundColor: "#f9fafb",
        borderRadius: "0.5rem",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading terminal...
    </div>
  ),
  ssr: false,
});

export default AnimatedTerminalComponent;
