import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchPrGp } from "../services/prGpService";
import PRGPFilter from "../components/PRGPFilter";
import PRGPTable from "../components/PRGPTable";

  export default function PRGP() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (payload) => {
    setLoading(true);
    setError("");
    setData([]);

    try {
      const result = await fetchPrGp(payload);
      setData(result);
    } catch (err) {
      console.error("Error fetch PR GP:", err);
      setError("Gagal mengambil data PR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4">
        <h4 className="mb-3">PR GP</h4>

        {/* Filter */}
        <PRGPFilter onSubmit={handleSearch} loading={loading} />

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Table */}
        <div className="card shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="alert alert-info m-3">Loading...</div>
            ) : (
              <PRGPTable data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
