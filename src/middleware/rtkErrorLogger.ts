import {
  Middleware,
  SerializedError,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { toast } from "@/components/ui/use-toast";

interface ErrorWithMessage {
  message?: string;
}

interface ErrorWithData extends SerializedError {
  data?: ErrorWithMessage;
}

export const rtkQueryErrorLogger: Middleware = (_api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn("We got a rejected action!");
    // console.log("Rejected Action:", action);

    let errorMessage = "Unknown API error occurred";

    const payloadData = action.payload as ErrorWithData | undefined;
    const errorData = action.error as ErrorWithData | undefined;

    if (payloadData?.data?.message) {
      errorMessage = payloadData.data.message;
    } else if (errorData?.data?.message) {
      errorMessage = errorData.data.message;
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    }

    // Display the toast notification
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }

  return next(action);
};
