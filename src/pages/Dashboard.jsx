import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { supabase } from "../services/supabaseClient";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Footer from "../components/common/Footer";

const STATUS_LIST = [
  "Canceled",
  "Rejected",
  "Submit to Purchasing",
  "PO Issued",
  "Completed",
];

const STATUS_COLOR = {
  Completed: "#198754",
  "PO Issued": "#0d6efd",
  "Submit to Purchasing": "#ffc107",
  Rejected: "#dc3545",
  Canceled: "#6c757d",
};

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
  });

  const [statusChart, setStatusChart] = useState([]);
  const [companyChart, setCompanyChart] = useState([]);
  const [latestPR, setLatestPR] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("master_pr")
        .select(
          "id, pr_number, item_specification, status, company, received_date"
        )
        .order("received_date", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const total = data.length;
      const completed = data.filter((d) => d.status === "Completed").length;
      const inProgress = data.filter(
        (d) =>
          d.status === "Submit to Purchasing" || d.status === "PO Issued"
      ).length;

      setStats({ total, completed, inProgress });

      const statusCount = {};
      STATUS_LIST.forEach((s) => (statusCount[s] = 0));

      data.forEach((d) => {
        if (statusCount[d.status] !== undefined) {
          statusCount[d.status]++;
        }
      });

      setStatusChart(
        Object.entries(statusCount).map(([name, value]) => ({
          name,
          value,
        }))
      );

      const companyMap = {};
      data.forEach((d) => {
        if (!d.company) return;
        companyMap[d.company] = (companyMap[d.company] || 0) + 1;
      });

      setCompanyChart(
        Object.entries(companyMap).map(([name, value]) => ({
          name,
          value,
        }))
      );

      setLatestPR(data.slice(0, 5));
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-grow-1 w-100">
        <nav className="navbar navbar-light bg-white shadow-sm px-3 px-lg-4">
          <span className="navbar-brand mb-0 h5">Dashboard</span>
        </nav>

        <div className="container-fluid p-3 p-lg-4">
          {/* KPI */}
          <div className="row g-3 g-lg-4 mb-4">
            <StatCard title="Total PR" value={stats.total} />
            <StatCard
              title="PR In Progress"
              value={stats.inProgress}
              color="warning"
            />
            <StatCard
              title="PR Completed"
              value={stats.completed}
              color="success"
            />
          </div>

          {/* CHART */}
          <div className="row g-3 g-lg-4 mb-4">
            {/* PIE */}
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-semibold">
                  Status PR
                </div>

                <div className="card-body" style={{ height: 300 }}>
                  {loading ? (
                    <div className="text-muted text-center">Loading...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChart}
                          dataKey="value"
                          cx="50%"
                          cy="45%"
                          innerRadius="55%"
                          outerRadius="75%"
                        >
                          {statusChart.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={STATUS_COLOR[entry.name]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "12px",
                            paddingTop: 10,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* BAR */}
            <div className="col-12 col-lg-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-semibold">
                  PR per Company
                </div>
                <div className="card-body" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={companyChart}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
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
                    <th>Item</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestPR.map((pr, i) => (
                    <tr key={pr.id}>
                      <td>{i + 1}</td>
                      <td>{pr.pr_number}</td>
                      <td className="text-truncate" style={{ maxWidth: 300 }}>
                        {pr.item_specification}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              STATUS_COLOR[pr.status],
                          }}
                        >
                          {pr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function StatCard({ title, value, color = "dark" }) {
  return (
    <div className="col-12 col-md-4">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <h6 className="text-muted">{title}</h6>
          <h3 className={`fw-bold text-${color}`}>{value}</h3>
        </div>
      </div>
    </div>
  );
}
