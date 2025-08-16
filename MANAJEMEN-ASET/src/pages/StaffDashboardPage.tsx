import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import StatCards from "../components/StatCards";
import StaffAssetFilters from "../components/StaffAssetFilters";
import StaffAssetTable from "../components/StaffAssetTable";
import StaffViewAssetModal from "../components/StaffViewAssetModal";

import { Asset } from "../types";

const StaffDashboardPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [currentFilters, setCurrentFilters] = useState({
    jenis: "",
    merk: "",
    model: "",
  });

  useEffect(() => {
    refreshAssets();
  }, []);

  const refreshAssets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assets");
      setAssets(res.data);
    } catch (err) {
      console.error("Gagal ambil data aset:", err);
    }
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      return (
        (!currentFilters.jenis || asset.jenis === currentFilters.jenis) &&
        (!currentFilters.merk || asset.merk === currentFilters.merk) &&
        (!currentFilters.model || asset.model === currentFilters.model)
      );
    });
  }, [assets, currentFilters]);

  const uniqueTypes = useMemo(
    () => new Set(assets.map((a) => a.jenis)).size,
    [assets]
  );

  const handleOpenViewAssetModal = (id: number) => {
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      setSelectedAsset(asset);
    }
  };

  const handleCloseViewAssetModal = () => {
    setSelectedAsset(null);
  };

  const handleUpdateStatus = (id: number, newStatus: "Stok" | "Terpasang") => {
    const updatedAssets: Asset[] = assets.map((asset) =>
      asset.id === id ? { ...asset, status: newStatus } : asset
    );
    setAssets(updatedAssets);
  };

  return (
    <div>
      <StatCards uniqueTypes={uniqueTypes} />
      <StaffAssetFilters
        allAssets={assets}
        onFilterChange={setCurrentFilters}
        currentFilters={currentFilters}
      />
      <StaffAssetTable
        assets={filteredAssets}
        onView={handleOpenViewAssetModal}
        onUpdateStatus={handleUpdateStatus}
        refreshAssets={refreshAssets}
      />
      {selectedAsset && (
        <StaffViewAssetModal
          isOpen={true}
          onClose={handleCloseViewAssetModal}
          asset={selectedAsset}
        />
      )}
    </div>
  );
};

export default StaffDashboardPage;
