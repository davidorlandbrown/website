import dynamic from "next/dynamic";

const MermaidComponent = dynamic(() => import("./index"), {
  loading: () => (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "#6b7280",
        backgroundColor: "#f9fafb",
        borderRadius: "0.5rem",
      }}
    >
      Loading diagram...
    </div>
  ),
  ssr: false,
});

export default MermaidComponent;
