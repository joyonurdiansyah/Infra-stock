import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchPrGp } from "../services/prGpService";
import PRGPFilter from "../components/PRGPFilter";
import PRGPTable from "../components/PRGPTable";
import {
  alertSuccess,
  alertWarning,
  alertError,
} from "../utils/Alert";

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

      if (!result || result.length === 0) {
        alertWarning(
          "Data Tidak Ditemukan",
          "Coba pastikan Description dan No PR sesuai dengan yang dibuat oleh Admin IT"
        );
        setData([]);
        return;
      }

      setData(result);

      alertSuccess(
        "Data Ditemukan",
        `Berhasil menemukan ${result.length} data PR`
      );
    } catch (err) {
      console.error("Error fetch PR GP:", err);

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
      <Sidebar />

      <main className="app-content">
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
