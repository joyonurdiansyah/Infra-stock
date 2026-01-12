import * as XLSX from "xlsx";

export const parseExcelDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
        return value.toISOString().split("T")[0];
    }

    if (typeof value === "number") {
        const date = XLSX.SSF.parse_date_code(value);
        return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
            date.d
        ).padStart(2, "0")}`;
    }

    return null;
};

export const isRowEmpty = (row) => {
    if (!row || row.length === 0) return true;

    return row.every((cell) => {
        if (cell === null || cell === undefined || cell === "") return true;
        if (typeof cell === "string" && cell.trim() === "") return true;
        return false;
    });
};
