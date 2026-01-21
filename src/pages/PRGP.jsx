import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import { fetchPrGp } from "../services/prGpService";
import PRGPFilter from "../components/prgp-pr/PRGPFilter";
import PRGPTable from "../components/prgp-pr/PRGPTable";
import PRGPComparison from "../components/prgp-pr/PRGPComparison";
import LoadingSpinner from "../components/loader-animation/LoadingSpinner";

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
  const [showComparison, setShowComparison] = useState(false);
  
  console.log("PRGP Rendered");

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
    <div className="d-flex min-vh-100 bg-light">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* CONTENT */}
      <div className="flex-grow-1 w-100 d-flex flex-column position-relative">
        {/* MOBILE MENU BUTTON */}
        <div className="d-lg-none p-3 bg-white border-bottom">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setMobileOpen(true)}
          >
            <i className="fas fa-bars me-2"></i>
            Menu
          </button>
        </div>

        {/* LOADING OVERLAY */}
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

        {/* MAIN CONTENT */}
        <div className="flex-grow-1 d-flex flex-column">
          {/* TOP NAV */}
          <nav className="navbar navbar-light bg-white shadow-sm px-4">
            <span className="navbar-brand h5 mb-0">PR GP</span>
            
            {/* Toggle Comparison Button */}
            <button
              className={`btn btn-sm ${showComparison ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setShowComparison(!showComparison)}
            >
              <i className={`fas ${showComparison ? 'fa-table' : 'fa-balance-scale'} me-2`}></i>
              {showComparison ? 'Lihat Tabel' : 'Perbandingan Data'}
            </button>
          </nav>

          {/* MAIN CONTENT */}
          <main className="container-fluid p-3 p-lg-4 flex-grow-1">
            {/* Conditional Rendering: Show Filter only when Table mode */}
            {!showComparison && (
              <PRGPFilter onSubmit={handleSearch} loading={loading} />
            )}

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {/* Toggle between Table and Comparison */}
            {!showComparison ? (
              <div className="card shadow-sm mt-3">
                <div className="card-body p-0">
                  <PRGPTable data={data} />
                </div>
              </div>
            ) : (
              <PRGPComparison />
            )}
          </main>
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}