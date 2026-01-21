import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { fetchPrGp } from "../../services/prGpService";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

export default function PRGPComparison() {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [prgpData, setPrgpData] = useState([]);
    const [masterPrData, setMasterPrData] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            alert("Masukkan PR Number terlebih dahulu");
            return;
        }

        setLoading(true);
        setSearched(true);
        setPrgpData([]);
        setMasterPrData([]);

        try {
            // Fetch from PRGP API using service
            const prgpResult = await fetchPrGp({
                Departement: "",
                PR_Desc: searchValue.trim(),
            });

            if (prgpResult && prgpResult.length > 0) {
                setPrgpData(prgpResult);
            }

            // Fetch from Supabase
            const cleanSearch = searchValue.trim().replace(/\/$/, '');

            const { data: masterDataArray, error } = await supabase
                .from("master_pr")
                .select("*")
                .ilike("pr_number", `${cleanSearch}%`);

            if (!error && masterDataArray && masterDataArray.length > 0) {
                setMasterPrData(masterDataArray);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Terjadi kesalahan saat mengambil data");
        } finally {
            setLoading(false);
        }
    };

    // Badge helper untuk PRGP
    const getStatusBadge = (status, type) => {
        if (!status || status === "None") {
            return <span className="badge bg-secondary">None</span>;
        }

        const colorMap = {
            PRStatus: {
                New: "bg-info",
                Partial: "bg-warning text-dark",
                Closed: "bg-success",
                Open: "bg-primary",
            },
            POStatus: {
                New: "bg-info",
                Open: "bg-primary",
                Closed: "bg-success",
            },
            RCVStatus: {
                New: "bg-info",
                Open: "bg-warning text-dark",
                Closed: "bg-success",
            },
        };

        const color = colorMap[type]?.[status] || "bg-secondary";
        return <span className={`badge ${color}`}>{status}</span>;
    };

    // PRGP Table columns
    const prgpColumns = [
        { accessorKey: "PR_Desc", header: "PR Admin" },
        { accessorKey: "PR_Number", header: "PR Number" },
        { accessorKey: "Tahun", header: "Tahun" },
        { accessorKey: "Site", header: "Site" },
        {
            accessorKey: "ITEMDESC",
            header: "Item",
            cell: ({ getValue }) => (
                <div style={{ maxWidth: 300 }} className="text-truncate">
                    {getValue()}
                </div>
            ),
        },
        { accessorKey: "Qty_PR_CM", header: "Qty PR" },
        {
            accessorKey: "PRStatus",
            header: "PR Status",
            cell: ({ getValue }) => getStatusBadge(getValue(), "PRStatus"),
        },
        {
            accessorKey: "POStatus",
            header: "PO Status",
            cell: ({ getValue }) => getStatusBadge(getValue(), "POStatus"),
        },
        {
            accessorKey: "RCVStatus",
            header: "RCV Status",
            cell: ({ getValue }) => getStatusBadge(getValue(), "RCVStatus"),
        },
    ];

    // Master PR Table columns
    const masterPrColumns = [
        { accessorKey: "pr_number", header: "PR Number" },
        { accessorKey: "company", header: "Company" },
        {
            accessorKey: "item_specification",
            header: "Item",
            cell: ({ getValue }) => (
                <div style={{ maxWidth: 300 }} className="text-truncate">
                    {getValue()}
                </div>
            ),
        },
        { accessorKey: "category", header: "Category" },
        { accessorKey: "qty", header: "Qty" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const val = getValue();
                const colorMap = {
                    Completed: "bg-success",
                    "On Going": "bg-warning",
                    Canceled: "bg-secondary",
                    Rejected: "bg-danger",
                    "Submit to Purchasing": "bg-info",
                    "PO Issued": "bg-primary",
                };
                return val ? (
                    <span className={`badge ${colorMap[val] || "bg-secondary"}`}>
                        {val}
                    </span>
                ) : (
                    "-"
                );
            },
        },
    ];

    const prgpTable = useReactTable({
        data: prgpData,
        columns: prgpColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const masterPrTable = useReactTable({
        data: masterPrData,
        columns: masterPrColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div>
            {/* Search Section */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">PR Number</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Contoh: "PR/0049/XI/25/"'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <small className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Masukkan PR Number yang ingin dibandingkan
                            </small>
                        </div>
                        <div className="col-md-4">
                            <button
                                onClick={handleSearch}
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                <i className="fas fa-search me-2"></i>
                                {loading ? "Mencari..." : "Cari & Bandingkan"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Results */}
            {searched && (
                <>
                    {/* Status Overview */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div
                                className={`alert ${prgpData.length > 0 ? "alert-success" : "alert-warning"
                                    } mb-0`}
                            >
                                <i
                                    className={`fas ${prgpData.length > 0 ? "fa-check-circle" : "fa-exclamation-triangle"
                                        } me-2`}
                                ></i>
                                <strong>PRGP (IP 172.20.4.40):</strong>{" "}
                                {prgpData.length > 0 ? `${prgpData.length} Data Ditemukan ✓` : "Data Tidak Ditemukan ✗"}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div
                                className={`alert ${masterPrData.length > 0 ? "alert-success" : "alert-warning"
                                    } mb-0`}
                            >
                                <i
                                    className={`fas ${masterPrData.length > 0 ? "fa-check-circle" : "fa-exclamation-triangle"
                                        } me-2`}
                                ></i>
                                <strong>Master PR (Supabase):</strong>{" "}
                                {masterPrData.length > 0 ? `${masterPrData.length} Data Ditemukan ✓` : "Data Tidak Ditemukan ✗"}
                            </div>
                        </div>
                    </div>

                    {/* PRGP Table */}
                    <div className="card shadow-sm border-0 mb-4 border-start border-primary border-4">
                        <div className="card-header bg-white">
                            <h6 className="mb-0 fw-semibold">
                                <i className="fas fa-table me-2"></i>
                                PRGP Data (IP 172.20.4.40)
                            </h6>
                        </div>
                        <div className="card-body p-0">
                            {prgpData.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="fas fa-inbox fa-3x mb-3 opacity-50"></i>
                                    <p className="mb-0 fw-semibold">Belum ada data</p>
                                    <small>Data tidak ditemukan di PRGP</small>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                {prgpTable.getHeaderGroups().map((hg) => (
                                                    <tr key={hg.id}>
                                                        {hg.headers.map((header) => (
                                                            <th key={header.id} style={{ whiteSpace: "nowrap" }}>
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody>
                                                {prgpTable.getRowModel().rows.map((row) => (
                                                    <tr key={row.id}>
                                                        {row.getVisibleCells().map((cell) => (
                                                            <td key={cell.id} style={{ whiteSpace: "nowrap" }}>
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Pagination */}
                                    <div className="card-footer bg-white border-top">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => prgpTable.previousPage()}
                                                disabled={!prgpTable.getCanPreviousPage()}
                                            >
                                                Previous
                                            </button>
                                            <span className="small text-muted">
                                                Page {prgpTable.getState().pagination.pageIndex + 1} of{" "}
                                                {prgpTable.getPageCount()} | Total: {prgpData.length} rows
                                            </span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => prgpTable.nextPage()}
                                                disabled={!prgpTable.getCanNextPage()}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Master PR Table */}
                    <div className="card shadow-sm border-0 border-start border-success border-4">
                        <div className="card-header bg-white">
                            <h6 className="mb-0 fw-semibold">
                                <i className="fas fa-table me-2"></i>
                                Master PR Data (Supabase)
                            </h6>
                        </div>
                        <div className="card-body p-0">
                            {masterPrData.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="fas fa-inbox fa-3x mb-3 opacity-50"></i>
                                    <p className="mb-0 fw-semibold">Belum ada data</p>
                                    <small>Data tidak ditemukan di Master PR</small>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                {masterPrTable.getHeaderGroups().map((hg) => (
                                                    <tr key={hg.id}>
                                                        {hg.headers.map((header) => (
                                                            <th key={header.id} style={{ whiteSpace: "nowrap" }}>
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody>
                                                {masterPrTable.getRowModel().rows.map((row) => (
                                                    <tr key={row.id}>
                                                        {row.getVisibleCells().map((cell) => (
                                                            <td key={cell.id} style={{ whiteSpace: "nowrap" }}>
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Pagination */}
                                    <div className="card-footer bg-white border-top">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => masterPrTable.previousPage()}
                                                disabled={!masterPrTable.getCanPreviousPage()}
                                            >
                                                Previous
                                            </button>
                                            <span className="small text-muted">
                                                Page {masterPrTable.getState().pagination.pageIndex + 1} of{" "}
                                                {masterPrTable.getPageCount()} | Total: {masterPrData.length} rows
                                            </span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => masterPrTable.nextPage()}
                                                disabled={!masterPrTable.getCanNextPage()}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info Footer */}
                    {prgpData.length === 0 && masterPrData.length === 0 && (
                        <div className="alert alert-info mt-4">
                            <i className="fas fa-lightbulb me-2"></i>
                            <strong>Tips:</strong> Pastikan PR Number yang Anda masukkan
                            sudah benar dan sesuai dengan format yang ada di kedua sistem.
                        </div>
                    )}
                </>
            )}

            {/* Initial State */}
            {!searched && (
                <div className="text-center py-5">
                    <i className="fas fa-search fa-4x text-muted opacity-25 mb-3"></i>
                    <h5 className="text-muted">
                        Masukkan PR Number untuk membandingkan data
                    </h5>
                    <p className="text-muted">
                        Sistem akan mencari data dari PRGP dan Master PR secara bersamaan
                    </p>
                </div>
            )}
        </div>
    );
}