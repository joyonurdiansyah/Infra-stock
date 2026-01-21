import { useState } from "react";
import CheckItemModal from "./CheckItemModal";

export default function PRGPChecklistTable({ data, onUpdate }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleCheckClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const getProgressPercent = (checked, total) => {
        if (!total) return 0;
        return Math.round((checked / total) * 100);
    };

    const getProgressColor = (percent) => {
        if (percent === 100) return "bg-success";
        if (percent >= 50) return "bg-warning";
        return "bg-danger";
    };

    if (!data || data.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                Tidak ada data. Gunakan filter untuk mencari PR GP.
            </div>
        );
    }

    return (
        <>
            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th width="50">No</th>
                            <th>Item Number</th>
                            <th>Deskripsi</th>
                            <th width="100">Qty PR</th>
                            <th width="180">Checklist</th>
                            <th width="200">Progress</th>
                            <th width="120">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item, i) => {
                            const percent = getProgressPercent(
                                item.qty_checked,
                                item.qty_pr
                            );

                            return (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>

                                    <td>
                                        <code className="text-primary">{item.item_number}</code>
                                    </td>

                                    <td>
                                        {item.item_desc}
                                        {item.notes && (
                                            <div>
                                                <small className="text-muted">
                                                    <i className="bi bi-sticky me-1"></i>
                                                    {item.notes.substring(0, 50)}
                                                    {item.notes.length > 50 && "..."}
                                                </small>
                                            </div>
                                        )}
                                    </td>

                                    <td className="text-center">{item.qty_pr}</td>

                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleCheckClick(item)}
                                        >
                                            <i className="bi bi-check-square me-1"></i>
                                            Check
                                        </button>
                                        <span className="ms-2 fw-semibold">
                                            {item.qty_checked || 0} / {item.qty_pr}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="progress" style={{ height: 18 }}>
                                            <div
                                                className={`progress-bar ${getProgressColor(percent)}`}
                                                style={{ width: `${percent}%` }}
                                            >
                                                {percent}%
                                            </div>
                                        </div>
                                    </td>

                                    <td className="text-center">
                                        {item.is_completed ? (
                                            <span className="badge bg-success">Completed</span>
                                        ) : (
                                            <span className="badge bg-warning text-dark">
                                                In Progress
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <CheckItemModal
                item={selectedItem}
                show={showModal}
                onHide={handleModalClose}
                onUpdate={onUpdate}
            />
        </>
    );
}