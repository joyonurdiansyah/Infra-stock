import * as XLSX from "xlsx";
import { parseExcelDate, isRowEmpty } from "../utils/excel";
import { fetchExistingRemarks, insertMasterPR } from "../services/masterPRService";
import { alertSuccess, alertWarning, alertError } from "../utils/Alert";

export default function useImportMasterPR({
    onSuccess,
    onFinish,
}) {
    const handleUploadExcel = async (excelFile, setUploading) => {
        if (!excelFile) {
            alertWarning("File belum dipilih", "Silakan pilih file Excel");
            return;
        }

        setUploading(true);

        try {
            const existingRemarks = await fetchExistingRemarks();

            const buffer = await excelFile.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const rows = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: null,
            });

            const dataRows = rows.slice(1);

            if (!dataRows.length) {
                alertWarning("Excel kosong", "Tidak ada data untuk diimport");
                return;
            }

            let skipped = 0;
            let emptyRows = 0;
            const payload = [];

            dataRows.forEach((row) => {
                if (isRowEmpty(row)) {
                    emptyRows++;
                    return;
                }

                const prNumber = row[2]?.toString().trim();
                if (!prNumber) {
                    emptyRows++;
                    return;
                }

                const remarks = row[8];
                if (remarks && existingRemarks.has(remarks)) {
                    skipped++;
                    return;
                }

                payload.push({
                    received_date: parseExcelDate(row[1]),
                    pr_number: prNumber.slice(0, 50),
                    company: row[3]?.toString().trim().slice(0, 100) || null,
                    item_specification: row[4]?.toString().trim() || null,
                    category: row[5]?.toString().trim().slice(0, 50) || null,
                    qty: Number(row[6]) || 0,
                    uom: row[7]?.toString().trim().slice(0, 20) || null,
                    remarks: row[8]?.toString().trim() || null,
                    requester_date: parseExcelDate(row[9]),
                    requester: row[10]?.toString().trim().slice(0, 100) || null,
                    approver_date: parseExcelDate(row[11]),
                    approver: row[12]?.toString().trim().slice(0, 100) || null,
                    po_number: row[13]?.toString().trim().slice(0, 50) || null,
                    status: row[14]?.toString().trim().slice(0, 30) || null,
                    description: row[15]?.toString().trim() || null,
                });
            });

            if (!payload.length) {
                alertSuccess(
                    "Tidak ada data baru",
                    `Empty rows: ${emptyRows}, Duplikat: ${skipped}`
                );
                return;
            }

            await insertMasterPR(payload);

            alertSuccess(
                "Import berhasil!",
                `✅ Inserted: ${payload.length} | ⏭️ Skipped: ${skipped} | 🗑️ Empty: ${emptyRows}`
            );

            onSuccess?.();
        } catch (err) {
            console.error(err);
            alertError("Gagal import", err.message);
        } finally {
            setUploading(false);
            onFinish?.();
        }
    };

    return { handleUploadExcel };
}
