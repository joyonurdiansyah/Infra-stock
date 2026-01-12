import { insertMasterPR } from "../services/masterPRService";
import { alertSuccess, alertWarning, alertError } from "../utils/Alert";
import { useState } from "react";

export default function useManualMasterPR({ onSuccess, onFinish }) {
    const [loading, setLoading] = useState(false);

    const submitManualPR = async (header, items) => {
        if (!header.pr_number || !items.length) {
            alertWarning("Data belum lengkap");
            return;
        }

        setLoading(true);

        try {
            const payload = items.map((item) => ({
                ...header,
                item_specification: item.item_specification,
                category: item.category,
                qty: item.qty,
            }));

            await insertMasterPR(payload);

            alertSuccess("PR berhasil ditambahkan", `Total item: ${items.length}`);
            onSuccess?.();
        } catch (err) {
            console.error(err);
            alertError("Gagal menyimpan PR", err.message);
        } finally {
            setLoading(false);
            onFinish?.();
        }
    };

    return { submitManualPR, loading };
}
