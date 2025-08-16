import React, { useState, useMemo, useCallback, useEffect } from "react";
import StatCards from "../components/StatCards";
import AssetFilters from "../components/AssetFilters";
import AssetTable from "../components/AssetTable";
import AddAssetModal from "../components/AddAssetModal";
import EditAssetModal from "../components/EditAssetModal";
import ViewAssetModal from "../components/ViewAssetModal";
import { formatDateTime } from "../utils/helpers";

import { getAssets } from "../utils/api";

import { Asset, AdminLog } from "../types";

const AssetManagementPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);

  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isEditAssetModalOpen, setIsEditAssetModalOpen] = useState(false);
  const [isViewAssetModalOpen, setIsViewAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<
    (Asset & { latestHistoryDate?: string }) | null
  >(null);
  const [currentFilters, setCurrentFilters] = useState({
    jenis: "",
    merk: "",
    model: "",
  });

  useEffect(() => {
    const storedLogs = localStorage.getItem("adminLogs");
    if (storedLogs) {
      setAdminLogs(JSON.parse(storedLogs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminLogs", JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getAssets();
        setAssets(data);
      } catch (err) {
        console.error("Gagal fetch aset:", err);
      }
    };
    fetchAssets();
  }, []);

  const addLog = useCallback((type: string, description: string) => {
    const timestamp = formatDateTime(new Date());
    setAdminLogs((prev) => {
      const filtered = prev.filter((log) => log.type !== type);
      return [{ type, description, timestamp }, ...filtered];
    });
  }, []);

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

  const handleOpenAddAssetModal = () => setIsAddAssetModalOpen(true);
  const handleCloseAddAssetModal = () => setIsAddAssetModalOpen(false);

  const handleOpenEditAssetModal = (
    asset: Asset & { latestHistoryDate?: string }
  ) => {
    setSelectedAsset(asset);
    setIsEditAssetModalOpen(true);
  };

  const handleCloseEditAssetModal = () => {
    setIsEditAssetModalOpen(false);
    setSelectedAsset(null);
  };

  const handleOpenViewAssetModal = (id: number) => {
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      setSelectedAsset(asset);
      setIsViewAssetModalOpen(true);
    }
  };

  const handleCloseViewAssetModal = () => {
    setIsViewAssetModalOpen(false);
    setSelectedAsset(null);
  };

  const handleAddAsset = (newAsset: Asset) => {
    setAssets((prev) => [...prev, newAsset]);
    addLog(
      "add_asset",
      `Menambahkan ${newAsset.jenis} ${newAsset.merk} ${newAsset.model} (${newAsset.kodeLokal})`
    );
  };

  const handleEditAsset = async (updated: Asset) => {
    try {
      const updatedData = updated;

      setAssets((prev) =>
        prev.map((a) =>
          a.id === updatedData.id ? { ...a, ...updatedData } : a
        )
      );

      addLog(
        "edit_asset",
        `Memperbarui ${updatedData.jenis} ${updatedData.merk} ${updatedData.model} (${updatedData.kodeLokal})`
      );

      handleCloseEditAssetModal();
    } catch (err: any) {
      console.error(err);
      alert(
        `Gagal mengedit aset: ${
          err?.response?.data?.message || "Terjadi kesalahan server"
        }`
      );
    }
  };

  useEffect(() => {
    addLog("login", "Admin masuk sistem");
  }, [addLog]);

  return (
    <div>
      <StatCards uniqueTypes={uniqueTypes} />
      <AssetFilters
        allAssets={assets}
        onFilterChange={setCurrentFilters}
        currentFilters={currentFilters}
      />
      <AssetTable
        assets={filteredAssets}
        onView={handleOpenViewAssetModal}
        onEdit={handleOpenEditAssetModal}
        onAddAsset={handleOpenAddAssetModal}
      />
      <AddAssetModal
        isOpen={isAddAssetModalOpen}
        onClose={handleCloseAddAssetModal}
        onAddAsset={handleAddAsset}
      />
      {selectedAsset && (
        <ViewAssetModal
          isOpen={isViewAssetModalOpen}
          onClose={handleCloseViewAssetModal}
          asset={selectedAsset}
          role="admin"
        />
      )}
      {selectedAsset && (
        <EditAssetModal
          isOpen={isEditAssetModalOpen}
          onClose={handleCloseEditAssetModal}
          asset={selectedAsset}
          latestHistoryDate={selectedAsset.latestHistoryDate}
          onEditAsset={handleEditAsset}
        />
      )}
    </div>
  );
};

export default AssetManagementPage;
