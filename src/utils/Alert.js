import Swal from "sweetalert2";

export const alertSuccess = (title, text) => {
    Swal.fire({
        icon: "success",
        title,
        text,
        timer: 2000,
        showConfirmButton: false,
    });
};

export const alertWarning = (title, text) => {
    Swal.fire({
        icon: "warning",
        title,
        text,
        confirmButtonText: "OK",
    });
};

export const alertError = (title, text) => {
    Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonText: "OK",
    });
};
