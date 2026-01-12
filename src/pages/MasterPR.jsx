import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import MasterPRTable from "../components/master-pr/MasterPRTable";
import ImportPRModal from "../components/master-pr/ImportPRModal";
import ManualPRModal from "../components/master-pr/ManualPRModal";
import useImportMasterPR from "../hooks/useImportMasterPR";

export default function MasterPR() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [showImport, setShowImport] = useState(false);
    const [showManual, setShowManual] = useState(false);

    const [reloadKey, setReloadKey] = useState(0);
    const [excelFile, setExcelFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { handleUploadExcel } = useImportMasterPR({
        onSuccess: () => setReloadKey(v => v + 1),
        onFinish: () => {
            setShowImport(false);
            setExcelFile(null);
        },
    });

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* SIDEBAR */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* CONTENT */}
            <div className="flex-grow-1 w-100 d-flex flex-column position-relative">
                <div className="d-lg-none p-3 bg-white border-bottom">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setMobileOpen(true)}
                    >
                        <i className="fas fa-bars me-2"></i>
                        Menu
                    </button>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-grow-1 d-flex flex-column">
                    {/* TOP NAV */}
                    <nav className="navbar navbar-light bg-white shadow-sm px-4">
                        <span className="navbar-brand h5 mb-0">Master Data PR</span>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setShowManual(true)}
                            >
                                + Tambah Manual
                            </button>

                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowImport(true)}
                            >
                                Import Excel
                            </button>
                        </div>
                    </nav>

                    {/* PAGE CONTENT */}
                    <main className="container-fluid p-3 p-lg-4 flex-grow-1">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white fw-semibold">
                                Daftar Master PR
                            </div>
                            <div className="card-body">
                                <MasterPRTable reloadKey={reloadKey} />
                            </div>
                        </div>
                    </main>
                </div>

                {/* FOOTER */}
                <Footer />
            </div>

            {/* MODALS */}
            <ImportPRModal
                show={showImport}
                onClose={() => setShowImport(false)}
                excelFile={excelFile}
                setExcelFile={setExcelFile}
                uploading={uploading}
                onSubmit={() => handleUploadExcel(excelFile, setUploading)}
            />

            <ManualPRModal
                show={showManual}
                onClose={() => setShowManual(false)}
                onSuccess={() => setReloadKey(v => v + 1)}
            />
        </div>
    );
}
