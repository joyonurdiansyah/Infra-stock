import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchPrGp } from "../services/prGpService";
import PRGPFilter from "../components/PRGPFilter";
import PRGPTable from "../components/PRGPTable";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  alertSuccess,
  alertWarning,
  alertError,
} from "../utils/Alert";

export default function PRGP() {
  const [collapsed, setCollapsed] = useState(false);   
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (payload) => {
    setLoading(true);
    setError("");
    setData([]);

    try {
      const result = await fetchPrGp(payload);

      if (!result || result.length === 0) {
        alertWarning(
          "Data Tidak Ditemukan",
          "Coba pastikan Description dan No PR sesuai"
        );
        return;
      }

      setData(result);
      alertSuccess(
        "Data Ditemukan",
        `Berhasil menemukan ${result.length} data PR`
      );
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal Mengambil Data",
        "Terjadi kesalahan saat mengambil data PR"
      );
      setError("Gagal mengambil data PR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="app-content position-relative">
        <div className="d-lg-none mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setMobileOpen(true)}
          >
            <i className="fas fa-bars me-2"></i>
            Menu
          </button>
        </div>

        {loading && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.7)",
              zIndex: 99,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingSpinner />
          </div>
        )}

        <h4 className="mb-3">PR GP</h4>

        <PRGPFilter onSubmit={handleSearch} loading={loading} />

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card shadow-sm">
          <div className="card-body p-0">
            <PRGPTable data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
