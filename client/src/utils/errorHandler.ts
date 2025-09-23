import axios from "axios";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data;
    if (data && typeof data === "object" && "message" in data) {
      return (data as { message: string }).message;
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred.";
};

export default getErrorMessage;
