import React from "react";
import { Boxes } from "lucide-react";

interface StatCardsProps {
  uniqueTypes: number;
}

const StatCards: React.FC<StatCardsProps> = ({ uniqueTypes }) => {
  return (
    <div
      style={{
        backgroundColor: "#002E5A",
        color: "white",
        borderRadius: "16px",
        padding: "1.5rem",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <Boxes size={20} strokeWidth={2.5} color="white" />
        Jenis Aset
      </div>

      <div
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#facc15",
        }}
      >
        {uniqueTypes}
      </div>
    </div>
  );
};

export default StatCards;
