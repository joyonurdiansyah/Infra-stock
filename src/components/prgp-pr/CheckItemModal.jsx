import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../services/supabaseClient";
import imageCompression from "browser-image-compression";

export default function CheckItemModal({ item, show, onHide, onUpdate }) {
    const [qtyChecked, setQtyChecked] = useState(0);
    const [notes, setNotes] = useState("");
    const [uploading, setUploading] = useState(false);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setQtyChecked(item.qty_checked || 0);
            setNotes(item.notes || "");
            setAttachmentPreview(item.attachment_url || null);
        }
    }, [item]);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [show]);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            let fileToUpload = file;

            // Compress image
            if (file.type.startsWith("image/")) {
                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };
                fileToUpload = await imageCompression(file, options);
                console.log(`✅ Compressed: ${(file.size / 1024).toFixed(2)}KB → ${(fileToUpload.size / 1024).toFixed(2)}KB`);
            }

            const fileName = `${item.id}_${Date.now()}_${file.name}`;

            // Upload ke Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("pr-gp-attachments")
                .upload(fileName, fileToUpload);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("pr-gp-attachments")
                .getPublicUrl(fileName);

            setAttachmentPreview(urlData.publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Gagal upload file: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            const userName = "Current User"; // TODO: Ganti dengan user login
            const isCompleted = qtyChecked >= item.qty_pr;

            // 1️⃣ Update pr_gp_items
            const { error: itemError } = await supabase
                .from("pr_gp_items")
                .update({
                    qty_checked: qtyChecked,
                    is_completed: isCompleted,
                    notes: notes || null,
                    attachment_url: attachmentPreview || null,
                    checked_by: userName,
                    checked_at: new Date().toISOString(),
                })
                .eq("id", item.id);

            if (itemError) throw itemError;

            // 2️⃣ Cek apakah sudah ada check record
            const { data: existingCheck } = await supabase
                .from("pr_gp_item_checks")
                .select("id")
                .eq("pr_gp_item_id", item.id)
                .maybeSingle();

            const checkData = {
                pr_gp_item_id: item.id,
                checked_by: userName,
                qty: qtyChecked,
                notes: notes || null,
                attachment_url: attachmentPreview || null,
            };

            if (existingCheck) {
                // UPDATE existing
                const { error: checkError } = await supabase
                    .from("pr_gp_item_checks")
                    .update(checkData)
                    .eq("id", existingCheck.id);

                if (checkError) throw checkError;
            } else {
                // INSERT new
                const { error: checkError } = await supabase
                    .from("pr_gp_item_checks")
                    .insert(checkData);

                if (checkError) throw checkError;
            }

            onUpdate?.();
            onHide();
        } catch (err) {
            console.error("Save error:", err);
            alert("Gagal simpan: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (!show || !item) return null;

    const progress = item.qty_pr > 0 ? Math.round((qtyChecked / item.qty_pr) * 100) : 0;

    return createPortal(
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onHide} />

            <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} role="dialog">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-clipboard-check me-2"></i>
                                Checklist Item
                            </h5>
                            <button className="btn-close" onClick={onHide}></button>
                        </div>

                        <div className="modal-body">
                            {/* ITEM INFO */}
                            <div className="card bg-light mb-3">
                                <div className="card-body">
                                    <h6 className="text-primary mb-2">
                                        <code>{item.item_number}</code>
                                    </h6>
                                    <p className="mb-1">{item.item_desc}</p>
                                    <div className="d-flex gap-2">
                                        <span className="badge bg-secondary">{item.uom}</span>
                                        <span className="badge bg-info">PO: {item.po_number || "-"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* QTY CHECKER */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-box-seam me-2"></i>
                                    Jumlah yang Sudah Dicek
                                </label>

                                <div className="input-group">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setQtyChecked(Math.max(0, qtyChecked - 1))}
                                    >
                                        <i className="bi bi-dash-lg"></i>
                                    </button>

                                    <input
                                        type="number"
                                        className="form-control text-center fs-4 fw-bold"
                                        value={qtyChecked}
                                        onChange={(e) =>
                                            setQtyChecked(
                                                Math.min(item.qty_pr, Math.max(0, parseInt(e.target.value) || 0))
                                            )
                                        }
                                        min="0"
                                        max={item.qty_pr}
                                    />

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setQtyChecked(Math.min(item.qty_pr, qtyChecked + 1))}
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                    </button>

                                    <span className="input-group-text">/ {item.qty_pr}</span>
                                </div>

                                {/* PROGRESS BAR */}
                                <div className="mt-2">
                                    <div className="progress" style={{ height: "25px" }}>
                                        <div
                                            className={`progress-bar ${progress === 100 ? "bg-success" : "bg-primary"}`}
                                            style={{ width: `${progress}%` }}
                                        >
                                            {progress}%
                                        </div>
                                    </div>
                                    <small className="text-muted">
                                        {qtyChecked === item.qty_pr ? (
                                            <span className="text-success">
                                                <i className="bi bi-check-circle-fill me-1"></i>
                                                Semua item sudah dicek!
                                            </span>
                                        ) : (
                                            <span>Kurang {item.qty_pr - qtyChecked} item lagi</span>
                                        )}
                                    </small>
                                </div>
                            </div>

                            {/* NOTES */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-pencil-square me-2"></i>
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Contoh: Beda tipe dengan spesifikasi awal, kondisi barang bagus, dll"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {/* ATTACHMENT */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-paperclip me-2"></i>
                                    Lampiran Foto/Dokumen (Opsional)
                                </label>

                                {attachmentPreview ? (
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                    File sudah diupload
                                                </div>
                                                <div className="btn-group">
                                                    <a
                                                        href={attachmentPreview}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="bi bi-eye me-1"></i>
                                                        Lihat
                                                    </a>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => setAttachmentPreview(null)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*,.pdf"
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                    />
                                )}

                                {uploading && (
                                    <div className="mt-2 text-primary">
                                        <div className="spinner-border spinner-border-sm me-2"></div>
                                        Compressing & uploading...
                                    </div>
                                )}

                                <small className="text-muted d-block mt-1">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Gambar akan otomatis dikompress untuk hemat storage (max 500KB)
                                </small>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onHide}>
                                Batal
                            </button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2"></i>
                                        Simpan Checklist
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}