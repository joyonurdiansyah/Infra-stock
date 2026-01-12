import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function PRGPTable({ data }) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const columns = useMemo(
        () => [
            {
                header: "No",
                cell: ({ row, table }) =>
                    row.index +
                    1 +
                    table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize,
            },
            { accessorKey: "PR_Desc", header: "PR Admin" },
            { accessorKey: "PR_Number", header: "PR Number" },
            { accessorKey: "Tahun", header: "Tahun" },
            { accessorKey: "Departement", header: "Departement" },
            { accessorKey: "Site", header: "Site" },
            { accessorKey: "ITEMDESC", header: "Item" },
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
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (!data?.length) {
        return <div className="text-center py-4">Data tidak ditemukan</div>;
    }

    return (
        <>
            {/* === HORIZONTAL SCROLL WRAPPER === */}
            <div
                style={{
                    overflowX: "auto",
                    width: "100%",
                }}
            >
                <table
                    className="table table-bordered table-hover mb-0 text-nowrap"
                    style={{
                        minWidth: "1400px", // 🔥 KUNCI UTAMA
                    }}
                >
                    <thead className="table-light">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="align-middle">
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
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="align-middle">
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

            {/* PAGINATION */}
            <div className="flex-grow-1 w-100 d-flex flex-column position-relative">
                <span>
                    Page {pagination.pageIndex + 1} dari {table.getPageCount()}
                </span>

                <div className="btn-group">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Prev
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
