export default function PRItemRow({ index, data, onChange, onRemove }) {
    return (
        <div className="row g-2 align-items-end mb-2">
            <div className="col-md-6">
                <label className="form-label">Item Specification</label>
                <input
                    className="form-control"
                    value={data.item_specification}
                    onChange={(e) =>
                        onChange(index, "item_specification", e.target.value)
                    }
                />
            </div>

            <div className="col-md-3">
                <label className="form-label">Category</label>
                <input
                    className="form-control"
                    value={data.category}
                    onChange={(e) =>
                        onChange(index, "category", e.target.value)
                    }
                />
            </div>

            <div className="col-md-2">
                <label className="form-label">Qty</label>
                <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={data.qty}
                    onChange={(e) =>
                        onChange(index, "qty", Number(e.target.value))
                    }
                />
            </div>

            <div className="col-md-1 text-end">
                <button
                    className="btn btn-outline-danger"
                    onClick={() => onRemove(index)}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
