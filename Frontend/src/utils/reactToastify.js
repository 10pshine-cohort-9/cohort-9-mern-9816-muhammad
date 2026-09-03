import {toast} from 'react-toastify'

export const showSuccess = (message) => {
    toast.success(message)
}

export const showError = (message) => {
    toast.error(message)
}

export const showInfo = (message) => {
    toast.info(message)
}

export const showWarning = (message) => {
    toast.warning(message)
}

export const showLoading = (message) => {
    return toast.loading(message);
};

export const updateToastSuccess = (toastId, message) => {
    toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
    })
}

export const updateToastError = (toastId, message) => {
    toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
    });
};