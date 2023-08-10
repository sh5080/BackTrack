import { createToast } from "@/libs/mosha-vue-toastify";

export function errorMessage(error) {
  if (error.response) {
    const errorMessage = error.response.data.message;
    createToast(
      errorMessage,

      {
        type: "warning",
        position: "top-center",
        timeout: 5000,
        showIcon: true,
      }
    );
  } else {
    createToast("An unexpected error occurred. Please try again later.", {
      type: "warning",
      position: "top-center",
      timeout: 5000,
    });
  }
}
export function customError(error) {
  createToast({
    title: "Warning",
    description: error,
    type: "warning",
    position: "top-center",
    timeout: 5000,
  });
}
export function alertMessage(res) {
  createToast(res, {
    type: "success",
    position: "top-center",
    timeout: 5000,
    showIcon: true,
  });
}
