import React, { useMemo } from "react";
import StatCards from "../components/StatCards";
import useLocalStorage from "../hooks/useLocalStorage";
import { Asset } from "../types";

const DashboardPage: React.FC = () => {
  const [assets] = useLocalStorage<Asset[]>("assetsData", []);

  const uniqueTypes = useMemo(() => {
    const jenisSet = new Set(assets.map((asset) => asset.jenis));
    return jenisSet.size;
  }, [assets]);

  return (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Dashboard
      </h1>
      <StatCards uniqueTypes={uniqueTypes} />
    </div>
  );
};

export default DashboardPage;
