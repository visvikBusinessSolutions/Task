import { toast } from "react-toastify";

export const handleSuccess = (msg: string): void => {
  toast.success(msg, {
    position: "top-right",
  });
};

export const handleError = (msg: string | Error | unknown): void => {
  let errorMessage: string;

  if (typeof msg === "string") {
    errorMessage = msg;
  } else if (msg instanceof Error) {
    errorMessage = msg.message;
  } else {
    errorMessage = "An unknown error occurred";
  }

  toast.error(errorMessage, {
    position: "top-right",
  });
};
