import { useState } from "react";

export default function PRGPFilter({ onSubmit, loading }) {
    const [form, setForm] = useState({
        Departement: "",
        PR_Desc: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="row g-2 mb-3">
            <div className="col-md-4">
                <input
                    type="text"
                    name="Departement"
                    className="form-control"
                    placeholder="Departement"
                    value={form.Departement}
                    onChange={handleChange}
                />
                <small className="fst-italic text-secondary">
                    Contoh: <code>"project"</code>
                </small>
            </div>

            <div className="col-md-4">
                <input
                    type="text"
                    name="PR_Desc"
                    className="form-control"
                    placeholder="PR Description"
                    value={form.PR_Desc}
                    onChange={handleChange}
                />
                <small className="fst-italic text-secondary">
                    Contoh: <code>"PR/0049/XI/25/"</code>
                    <br />
                    Pastikan sesuai dengan No PR yang dibuat oleh Admin IT
                </small>
            </div>

            <div className="col-md-2">
                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Loading..." : "Search"}
                </button>
            </div>
        </form>
    );
}
