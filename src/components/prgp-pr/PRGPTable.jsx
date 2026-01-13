import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function PRGPTable({ data }) {
    const [columnFilters, setColumnFilters] = useState([]);

    const columns = useMemo(
        () => [
            {
                header: "No",
                cell: ({ row, table }) =>
                    row.index +
                    1 +
                    table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize,
                size: 60,
            },
            { accessorKey: "PR_Desc", header: "PR Admin" },
            { accessorKey: "PR_Number", header: "PR Number" },
            { accessorKey: "Tahun", header: "Tahun" },
            { accessorKey: "Site", header: "Site" },
            {
                accessorKey: "ITEMDESC",
                header: "Item",
                cell: ({ getValue }) => (
                    <div style={{ maxWidth: 300, minWidth: 200 }} className="text-truncate">
                        {getValue()}
                    </div>
                ),
            },
            { accessorKey: "Qty_PR_CM", header: "Qty PR" },
            {
                accessorKey: "PRStatus",
                header: "PR Status",
                cell: ({ getValue }) => (
                    <span className="badge bg-primary">{getValue()}</span>
                ),
            },
            {
                accessorKey: "POStatus",
                header: "PO Status",
                cell: ({ getValue }) =>
                    getValue() ? (
                        <span className="badge bg-success">{getValue()}</span>
                    ) : (
                        "-"
                    ),
            },
            {
                accessorKey: "RCVStatus",
                header: "RCV Status",
                cell: ({ getValue }) =>
                    getValue() ? (
                        <span className="badge bg-warning text-dark">{getValue()}</span>
                    ) : (
                        "-"
                    ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: { columnFilters },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (!data.length) {
        return (
            <div className="text-center py-4 text-muted">
                <i className="fas fa-folder-open mb-2"></i>
                <div>Data PR belum tersedia</div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0">
            {/* FILTER SECTION */}
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label small text-muted mb-1">PR Status</label>
                            <select
                                className="form-select form-select-sm"
                                value={table.getColumn("PRStatus")?.getFilterValue() ?? ""}
                                onChange={(e) =>
                                    table.getColumn("PRStatus")?.setFilterValue(e.target.value)
                                }
                            >
                                <option value="">All PR Status</option>
                                <option value="Closed">Closed</option>
                                <option value="Open">Open</option>
                            </select>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label small text-muted mb-1">PO Status</label>
                            <select
                                className="form-select form-select-sm"
                                value={table.getColumn("POStatus")?.getFilterValue() ?? ""}
                                onChange={(e) =>
                                    table.getColumn("POStatus")?.setFilterValue(e.target.value)
                                }
                            >
                                <option value="">All PO Status</option>
                                <option value="Closed">Closed</option>
                                <option value="Open">Open</option>
                            </select>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label small text-muted mb-1">RCV Status</label>
                            <select
                                className="form-select form-select-sm"
                                value={table.getColumn("RCVStatus")?.getFilterValue() ?? ""}
                                onChange={(e) =>
                                    table.getColumn("RCVStatus")?.setFilterValue(e.target.value)
                                }
                            >
                                <option value="">All RCV Status</option>
                                <option value="Closed">Closed</option>
                                <option value="Open">Open</option>
                            </select>
                        </div>

                        <div className="col-lg-3 col-md-12 col-sm-6">
                            {columnFilters.length > 0 && (
                                <button
                                    className="btn btn-sm btn-outline-secondary w-100"
                                    onClick={() => setColumnFilters([])}
                                >
                                    <i className="fas fa-times me-1"></i>
                                    Clear Filters ({columnFilters.length})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE WRAPPER - RESPONSIVE */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light sticky-top">
                                {table.getHeaderGroups().map((hg) => (
                                    <tr key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    position: "sticky",
                                                    top: 0,
                                                    backgroundColor: "#f8f9fa",
                                                    zIndex: 10
                                                }}
                                            >
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
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
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
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="text-center py-4 text-muted"
                                        >
                                            <i className="fas fa-filter mb-2 d-block"></i>
                                            Tidak ada data sesuai filter
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
                <div className="card-footer bg-white border-top">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <i className="fas fa-chevron-left me-1"></i>
                            Previous
                        </button>

                        <div className="text-center">
                            <span className="small text-muted">
                                Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                                <strong>{table.getPageCount()}</strong>
                            </span>
                            <span className="d-block d-sm-inline ms-sm-2 small text-muted">
                                | Total: <strong>{table.getFilteredRowModel().rows.length}</strong> rows
                            </span>
                        </div>

                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                            <i className="fas fa-chevron-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}