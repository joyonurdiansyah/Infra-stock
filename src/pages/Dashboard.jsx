import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="flex-grow-1 w-100">
        {/* Top Bar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-3 px-lg-4">
          <div className="d-flex align-items-center gap-3">
            {/* Mobile toggle */}
            <button
              className="btn btn-outline-secondary d-lg-none"
              onClick={() => setMobileOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </button>

            <span className="navbar-brand mb-0 h5">Dashboard</span>
          </div>

          <span className="text-muted small d-none d-md-block">
            Admin Panel
          </span>
        </nav>

        {/* Content */}
        <div className="container-fluid p-3 p-lg-4">

          {/* Welcome */}
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-1">Selamat Datang 👋</h5>
              <p className="text-muted mb-0">
                Mantau PR GP dan inventarisasi barang dengan mudah di InfraStock.
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="row g-3 g-lg-4 mb-4">
            {[
              { title: "Total PR", value: 24 },
              { title: "PR On Going", value: 8, color: "warning" },
              { title: "PR Selesai", value: 16, color: "success" },
            ].map((item, i) => (
              <div key={i} className="col-12 col-md-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h6 className="text-muted">{item.title}</h6>
                    <h3 className={`fw-bold text-${item.color || "dark"}`}>
                      {item.value}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white fw-semibold">
              PR Terbaru
            </div>

            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>PR Number</th>
                    <th>Lokasi / Item</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>03/P12/X/25/IT</td>
                    <td>Upgrade CCTV P12</td>
                    <td><span className="badge bg-warning">On Going</span></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>PR/0056/XII/IT</td>
                    <td>Ruang Server P5</td>
                    <td><span className="badge bg-success">Selesai</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
