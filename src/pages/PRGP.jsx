import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { fetchPrGp } from "../services/prGpService";

export default function PRGP() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchPrGp({
        Departement: "Digital & IT",
        PR_Desc: "Project",
      });

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

        
        {loading && <div className="alert alert-info">Loading...</div>}

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Table */}
        {!loading && !error && (
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>PR Number</th>
                    <th>Departement</th>
                    <th>Site</th>
                    <th>Item</th>
                    <th>Qty PR</th>
                    <th>Status PR</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}

                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.PR_Number}</td>
                      <td>{item.Departement}</td>
                      <td>{item.Site}</td>
                      <td>{item.ITEMDESC}</td>
                      <td>{item.Qty_PR_CM}</td>
                      <td>
                        <span className="badge bg-primary">
                          {item.PRStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
