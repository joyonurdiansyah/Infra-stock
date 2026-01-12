export default function ImportPRModal({
    show,
    onClose,
    setExcelFile,
    uploading,
    onSubmit,
}) {
    if (!show) return null;

    return (
        <>
            <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                style={{ zIndex: 1040 }}
                onClick={onClose}
            />

            <div className="modal d-block" style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Import Master PR</h5>
                            <button className="btn-close" onClick={onClose} />
                        </div>

                        <div className="modal-body">
                            <input
                                type="file"
                                className="form-control"
                                accept=".xlsx,.xls"
                                onChange={(e) => setExcelFile(e.target.files[0])}
                            />

                            <div className="alert alert-info small mt-3">
                                <ul className="mb-0 ps-3">
                                    <li>Row kosong dilewati</li>
                                    <li>Tanpa PR Number tidak diimport</li>
                                    <li>Duplikat berdasarkan <b>Remarks</b> dilewati</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>
                                Batal
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={uploading}
                                onClick={onSubmit}
                            >
                                {uploading ? "Uploading..." : "Upload & Proses"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
