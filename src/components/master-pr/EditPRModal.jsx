import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../services/supabaseClient";
import { alertSuccess, alertError } from "../../utils/Alert";

export default function EditPRModal({ show, onClose, data, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (data) {
            setForm({
                id: data.id,
                received_date: data.received_date || "",
                pr_number: data.pr_number || "",
                company: data.company || "",
                item_specification: data.item_specification || "",
                category: data.category || "",
                qty: data.qty || 0,
                uom: data.uom || "",
                remarks: data.remarks || "",
                requester_date: data.requester_date || "",
                requester: data.requester || "",
                approver_date: data.approver_date || "",
                approver: data.approver || "",
                po_number: data.po_number || "",
                status: data.status || "",
                description: data.description || "",
            });
        }
    }, [data]);

    useEffect(() => {
        document.body.style.overflow = show ? "hidden" : "unset";
        return () => (document.body.style.overflow = "unset");
    }, [show]);

    if (!show) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!form.pr_number || !form.company || !form.status) {
                alertError("Gagal", "PR Number, Company, dan Status wajib diisi");
                return;
            }

            const { error } = await supabase
                .from("master_pr")
                .update({
                    received_date: form.received_date || null,
                    pr_number: form.pr_number,
                    company: form.company,
                    item_specification: form.item_specification,
                    category: form.category,
                    qty: Number(form.qty) || 0,
                    uom: form.uom,
                    remarks: form.remarks,
                    requester_date: form.requester_date || null,
                    requester: form.requester,
                    approver_date: form.approver_date || null,
                    approver: form.approver,
                    po_number: form.po_number,
                    status: form.status,
                    description: form.description,
                })
                .eq("id", form.id);

            if (error) throw error;

            alertSuccess("Berhasil", "Data PR berhasil diperbarui");
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alertError("Gagal", err.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <>
            <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                style={{ zIndex: 1040 }}
                onClick={onClose}
            />

            <div className="modal d-block" style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Master PR</h5>
                            <button className="btn-close" onClick={onClose} />
                        </div>

                        <div className="modal-body row g-3">
                            <div className="col-md-4">
                                <label className="form-label">PR Number</label>
                                <input
                                    className="form-control"
                                    name="pr_number"
                                    value={form.pr_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Company</label>
                                <input
                                    className="form-control"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="">Pilih Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Canceled">Canceled</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Submit to Purchasing">
                                        Submit to Purchasing
                                    </option>
                                    <option value="PO Issued">PO Issued</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Item Specification</label>
                                <textarea
                                    className="form-control"
                                    name="item_specification"
                                    value={form.item_specification}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Category</label>
                                <input
                                    className="form-control"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Qty</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="qty"
                                    value={form.qty}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">UoM</label>
                                <input
                                    className="form-control"
                                    name="uom"
                                    value={form.uom}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-5">
                                <label className="form-label">Remarks</label>
                                <input
                                    className="form-control"
                                    name="remarks"
                                    value={form.remarks}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>
                                Batal
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
