import { useState } from "react";
import PRItemRow from "./PRItemRow";
import useManualMasterPR from "../../hooks/useManualMasterPR";

export default function ManualPRModal({ show, onClose, onSuccess }) {
    const [form, setForm] = useState({
        pr_number: "",
        company: "",
        received_date: "",
        status: "Submit to Purchasing",
    });

    const [items, setItems] = useState([
        { item_specification: "", category: "", qty: 1 },
    ]);

    const { submitManualPR, loading } = useManualMasterPR({
        onSuccess,
        onFinish: onClose,
    });

    if (!show) return null;

    const addItem = () =>
        setItems([...items, { item_specification: "", category: "", qty: 1 }]);

    const removeItem = (index) =>
        setItems(items.filter((_, i) => i !== index));

    const updateItem = (index, field, value) => {
        const copy = [...items];
        copy[index][field] = value;
        setItems(copy);
    };

    return (
        <>
            {/* OVERLAY */}
            <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                style={{ zIndex: 1040 }}
                onClick={onClose}
            />

            {/* MODAL */}
            <div
                className="modal d-block"
                tabIndex="-1"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tambah PR Manual</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            />
                        </div>

                        <div className="modal-body">
                            {/* HEADER PR */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-4">
                                    <label className="form-label">PR Number</label>
                                    <input
                                        className="form-control"
                                        value={form.pr_number}
                                        onChange={(e) =>
                                            setForm({ ...form, pr_number: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Company</label>
                                    <input
                                        className="form-control"
                                        value={form.company}
                                        onChange={(e) =>
                                            setForm({ ...form, company: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Received Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.received_date}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                received_date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <hr />

                            {/* ITEMS */}
                            <div className="d-flex justify-content-between mb-2">
                                <h6 className="fw-semibold mb-0">Item PR</h6>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addItem}
                                >
                                    + Tambah Item
                                </button>
                            </div>

                            {items.map((item, i) => (
                                <PRItemRow
                                    key={i}
                                    index={i}
                                    data={item}
                                    onChange={updateItem}
                                    onRemove={removeItem}
                                />
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Batal
                            </button>

                            <button
                                className="btn btn-primary"
                                disabled={loading}
                                onClick={() => submitManualPR(form, items)}
                            >
                                {loading ? "Menyimpan..." : "Simpan PR"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
