import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import PRGPFilter from "../components/prgp-pr/PRGPFilter";
import PRGPChecklistTable from "../components/prgp-pr/PRGPChecklistTable";
import LoadingSpinner from "../components/loader-animation/LoadingSpinner";

import { syncPrGpToChecklist } from "../services/prGpChecklistService";
import { supabase } from "../services/supabaseClient";

export default function PRGPChecklist() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastPayload, setLastPayload] = useState(null);
    
    const [activeTab, setActiveTab] = useState("ongoing");
    const [ongoingData, setOngoingData] = useState([]);

    useEffect(() => {
        loadOngoingPR();
    }, []);

    const loadOngoingPR = async () => {
        try {
            const { data: headers, error: headerError } = await supabase
                .from("pr_gp_headers")
                .select("*")
                .order("created_at", { ascending: false });

            if (headerError) throw headerError;

            const headersWithProgress = await Promise.all(
                headers.map(async (header) => {
                    const { data: items } = await supabase
                        .from("pr_gp_items")
                        .select("*")
                        .eq("pr_gp_header_id", header.id);
                        
                    const totalItems = items?.length || 0;
                    const completedItems = items?.filter((i) => i.is_completed).length || 0;
                    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                    return {
                        ...header,
                        totalItems,
                        completedItems,
                        progress,
                        items: items || [],
                    };
                })
            );

            setOngoingData(headersWithProgress);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (payload) => {
        if (loading) return;

        setLoading(true);
        setLastPayload(payload);
        
        try {
            const result = await syncPrGpToChecklist(payload);
            setData(result);
            setActiveTab("search"); 
            
            console.log(`✅ Berhasil load ${result.length} items`);
        } catch (err) {
            console.error("❌ Error:", err);
            alert("Gagal load checklist PR GP: " + (err.message || err));
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (activeTab === "search" && lastPayload) {
            setLoading(true);
            try {
                const result = await syncPrGpToChecklist(lastPayload);
                setData(result);
            } finally {
                setLoading(false);
            }
        }
        await loadOngoingPR(); 
    };

    const handleViewItems = (header) => {
        setData(header.items);
        setActiveTab("search");
    };

    const totalOngoing = ongoingData.length;
    const totalCompleted = ongoingData.filter((h) => h.progress === 100).length;
    const overallProgress = totalOngoing > 0 
        ? Math.round((totalCompleted / totalOngoing) * 100) 
        : 0;

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
                        <span className="navbar-brand h5 mb-0">
                            PR GP Checklist
                        </span>
                    </nav>

                    {/* PAGE CONTENT */}
                    <main className="container-fluid p-3 p-lg-4 flex-grow-1">
                        <PRGPFilter onSubmit={handleSearch} loading={loading} />

                        {/* SUMMARY */}
                        {totalOngoing > 0 && (
                            <div className="row g-3 mt-3">
                                <div className="col-md-3">
                                    <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                            <div className="text-muted small">Total PR Ongoing</div>
                                            <div className="fs-4 fw-bold">{totalOngoing}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                            <div className="text-muted small">PR Completed</div>
                                            <div className="fs-4 fw-bold text-success">
                                                {totalCompleted}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                            <div className="text-muted small">Overall Progress</div>
                                            <div className="fs-4 fw-bold">{overallProgress}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                            <div className="text-muted small">Status</div>
                                            {overallProgress === 100 ? (
                                                <span className="badge bg-success fs-6">
                                                    ALL COMPLETED
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning text-dark fs-6">
                                                    ON PROGRESS
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TABS */}
                        <div className="card shadow-sm mt-3">
                            <div className="card-header bg-white">
                                <ul className="nav nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                                            onClick={() => setActiveTab("ongoing")}
                                        >
                                            <i className="bi bi-list-check me-2"></i>
                                            On Going ({totalOngoing})
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === "search" ? "active" : ""}`}
                                            onClick={() => setActiveTab("search")}
                                        >
                                            <i className="bi bi-search me-2"></i>
                                            Search Results ({data.length})
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body">
                                {activeTab === "ongoing" ? (
                                    ongoingData.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>PR Number</th>
                                                        <th>PR Description</th>
                                                        <th>Departement</th>
                                                        <th>Site</th>
                                                        <th className="text-center">Total Items</th>
                                                        <th>Progress</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ongoingData.map((header) => (
                                                        <tr key={header.id}>
                                                            <td>
                                                                <code className="text-primary">{header.pr_number}</code>
                                                            </td>
                                                            <td>{header.pr_desc}</td>
                                                            <td>
                                                                <span className="badge bg-secondary">
                                                                    {header.departement}
                                                                </span>
                                                            </td>
                                                            <td><small>{header.site}</small></td>
                                                            <td className="text-center">
                                                                <strong>{header.totalItems}</strong>
                                                            </td>
                                                            <td style={{ minWidth: "200px" }}>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div className="progress flex-grow-1" style={{ height: "25px" }}>
                                                                        <div
                                                                            className={`progress-bar ${header.progress === 100 ? "bg-success" : "bg-primary"}`}
                                                                            style={{ width: `${header.progress}%` }}
                                                                        >
                                                                            {header.progress}%
                                                                        </div>
                                                                    </div>
                                                                    <small className="text-nowrap">
                                                                        {header.completedItems}/{header.totalItems}
                                                                    </small>
                                                                </div>
                                                                {header.progress === 100 ? (
                                                                    <small className="text-success">
                                                                        <i className="bi bi-check-circle-fill me-1"></i>
                                                                        Complete
                                                                    </small>
                                                                ) : (
                                                                    <small className="text-warning">
                                                                        <i className="bi bi-clock-fill me-1"></i>
                                                                        On Progress
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleViewItems(header)}
                                                                >
                                                                    <i className="bi bi-eye me-1"></i>
                                                                    View Items
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted py-5">
                                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                            <p>Belum ada PR yang ditambahkan</p>
                                        </div>
                                    )
                                ) : (
                                    data.length > 0 ? (
                                        <PRGPChecklistTable 
                                            data={data} 
                                            onUpdate={handleUpdate} 
                                        />
                                    ) : (
                                        <div className="text-center text-muted py-5">
                                            <i className="bi bi-search fs-1 d-block mb-3"></i>
                                            <p>Gunakan filter untuk mencari data PR GP</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </main>
                </div>

                {/* FOOTER */}
                <Footer />
            </div>
        </div>
    );
}