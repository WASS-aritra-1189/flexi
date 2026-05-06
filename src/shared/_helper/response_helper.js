import { toast } from "react-toastify";

let errorToastTimeout = null;

export const errorHandler = (res) => {
    if (res.status === 401) {
        if (!errorToastTimeout) {
            toast.error(res.data.message);
            localStorage.clear();
            errorToastTimeout = setTimeout(() => {
                errorToastTimeout = null;
            }, 5000);
        }
        return;
    }

    let result = Array.isArray(res.data.message);
    if (result) {
        toast.error(res.data.message[0]);
    } else {
        toast.error(res.data.message);
    }
};

export const successHandler = (msg) => {
    toast.success(msg);
};
