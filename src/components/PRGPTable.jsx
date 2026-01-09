import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export default function PRGPTable({ data }) {
    const columns = useMemo(
        () => [
            {
                header: "No",
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: "PR_Number",
                header: "PR Number",
            },
            {
                accessorKey: "Departement",
                header: "Departement",
            },
            {
                accessorKey: "Site",
                header: "Site",
            },
            {
                accessorKey: "ITEMDESC",
                header: "Item",
            },
            {
                accessorKey: "Qty_PR_CM",
                header: "Qty PR",
            },
            {
                accessorKey: "PRStatus",
                header: "Status PR",
                cell: ({ getValue }) => (
                    <span className="badge bg-primary">{getValue()}</span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (data.length === 0) {
        return (
            <div className="text-center py-4">
                Data tidak ditemukan
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
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
                    {table.getRowModel().rows.map((row) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
