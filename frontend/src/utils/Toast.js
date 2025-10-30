import { toast } from "react-toastify";

const notifySuccess = (message) => {
  toast.success(message, { position: "bottom-right" });
};

const notifyError = (message) => {
  toast.error(message, { position: "bottom-right" });
};

const notifyInfo = (message) => {
  toast.info(message, { position: "bottom-right" });
};

const notifyWarning = (message) => {
  toast.warn(message, { position: "bottom-right" });
};

export { notifySuccess, notifyError, notifyInfo, notifyWarning };
