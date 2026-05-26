export const BACKEND_API_ERROR_MESSAGE = "Backend API not working";

export const getApiErrorMessage = (error, fallbackMessage) =>
  error?.userMessage || error?.response?.data?.message || fallbackMessage;
