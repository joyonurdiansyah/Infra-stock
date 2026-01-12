import { useEffect, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { supabase } from "../services/supabaseClient";
import EditPRModal from "./master-pr/EditPRModal";

export default function MasterPRTable({ reloadKey }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columnFilters, setColumnFilters] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPR, setSelectedPR] = useState(null);

    useEffect(() => {
        fetchMasterPR();
    }, [reloadKey]);

    const fetchMasterPR = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("master_pr")
            .select("*")
            .order("received_date", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
        } else {
            setData(data || []);
        }

        setLoading(false);
    };

    const handleEdit = (row) => {
        setSelectedPR(row.original);
        setShowEditModal(true);
    };

    const handleDelete = async (row) => {
        if (!window.confirm(`Hapus PR ${row.original.pr_number}?`)) return;

        const { error } = await supabase
            .from("master_pr")
            .delete()
            .eq("id", row.original.id);

        if (error) {
            console.error("Delete error:", error);
            alert("Gagal menghapus data");
        } else {
            fetchMasterPR();
        }
    };

    const columns = [
        {
            header: "PR Number",
            accessorKey: "pr_number",
        },
        {
            header: "Company",
            accessorKey: "company",
        },
        {
            header: "Item",
            accessorKey: "item_specification",
            cell: ({ getValue }) => (
                <div style={{ maxWidth: 300 }} className="text-truncate">
                    {getValue()}
                </div>
            ),
        },
        {
            header: "Category",
            accessorKey: "category",
        },
        {
            header: "Qty",
            accessorKey: "qty",
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ getValue }) =>
                getValue() ? (
                    <span
                        className={`badge ${
                            getValue() === "Completed"
                                ? "bg-success"
                                : getValue() === "On Going"
                                ? "bg-warning"
                                : "bg-secondary"
                        }`}
                    >
                        {getValue()}
                    </span>
                ) : (
                    "-"
                ),
        },
        {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => (
                <div className="btn-group btn-group-sm">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEdit(row)}
                        title="Edit"
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(row)}
                        title="Delete"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (loading) {
        return (
            <div className="text-center py-5 text-muted">
                Loading data PR...
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="text-center py-5 text-muted">
                <i className="fas fa-folder-open fa-2x mb-3"></i>
                <div>Belum ada data Master PR</div>
            </div>
        );
    }

    return (
        <div>
            {/* FILTER SECTION */}
            <div className="row g-2 mb-3">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Filter PR Number..."
                        value={table.getColumn("pr_number")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table.getColumn("pr_number")?.setFilterValue(e.target.value)
                        }
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Filter Company..."
                        value={table.getColumn("company")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table.getColumn("company")?.setFilterValue(e.target.value)
                        }
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Filter Category..."
                        value={table.getColumn("category")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table.getColumn("category")?.setFilterValue(e.target.value)
                        }
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select form-select-sm"
                        value={table.getColumn("status")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table.getColumn("status")?.setFilterValue(e.target.value)
                        }
                    >
                        <option value="">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Submit to Purchasing">Submit to Purchasing</option>
                        <option value="PO Issued">PO Issued</option>
                    </select>
                </div>
            </div>

            {/* CLEAR FILTER BUTTON */}
            {columnFilters.length > 0 && (
                <div className="mb-3">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setColumnFilters([])}
                    >
                        <i className="fas fa-times me-1"></i>
                        Clear Filters ({columnFilters.length})
                    </button>
                </div>
            )}

            {/* TABLE */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
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
                                        <td key={cell.id}>
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
                                <td colSpan={columns.length} className="text-center py-4 text-muted">
                                    <i className="fas fa-search mb-2"></i>
                                    <div>Tidak ada data yang sesuai dengan filter</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Prev
                </button>

                <span className="small">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()} | Total: {table.getFilteredRowModel().rows.length} rows
                </span>

                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </button>
            </div>

            {/* EDIT MODAL */}
            <EditPRModal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedPR(null);
                }}
                data={selectedPR}
                onSuccess={fetchMasterPR}
            />
        </div>
    );
}