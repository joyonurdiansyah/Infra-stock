import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchPrGp } from "../services/prGpService";
import PRGPFilter from "../components/PRGPFilter";
import PRGPTable from "../components/PRGPTable";

export default function PRGP() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = async (payload) => {
    setLoading(true);
    setError("");
    setData([]);

    try {
      const result = await fetchPrGp(payload);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data PR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Content */}
      <main className="app-content">
        {/* Mobile Hamburger */}
        <button
          className="btn btn-purple d-lg-none mb-3"
          onClick={() => setMobileOpen(true)}
        >
          <i className="fas fa-bars"></i>
        </button>

        <h4 className="mb-3">PR GP</h4>

        <PRGPFilter onSubmit={handleSearch} loading={loading} />

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="alert alert-info m-3">Loading...</div>
            ) : (
              <PRGPTable data={data} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
