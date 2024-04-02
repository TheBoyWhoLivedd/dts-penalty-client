import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useGetPaymentsQuery } from "./paymentApiSlice";
import { PaymentsClient } from "./components/client";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "@/hooks/useAuth";

const PaymentsList = () => {
  const {
    data: payments,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPaymentsQuery(undefined, {
    pollingInterval: 60000,
    // refetchOnFocus: true,
    // refetchOnMountOrArgChange: true,
  });

  const {
    data: users,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useGetUsersQuery();

  const { status, userId } = useAuth();

  if (isLoading || isLoadingUsers) return <p>Loading...</p>;

  if (isError) {
    let errorMessage = "An error occurred";

    if ("status" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        errorMessage = (fetchError.data as { message: string }).message;
      }
    }

    return <p className="errmsg">{errorMessage}</p>;
  }

  if (isSuccess && isSuccessUsers && payments && users) {
    let filteredPayments = payments.ids;

    if (status === "Employee") {
      filteredPayments = payments.ids.filter(
        (paymentId) => payments.entities[paymentId].issuedBy === userId
      );
    }

    const transformedData = filteredPayments.map((paymentId) => {
      const payment = payments.entities[paymentId];

      const issuerName = users.entities[payment.issuedBy]?.name;

      const formattedTotalAmount = new Intl.NumberFormat("en-UG", {
        style: "currency",
        currency: "UGX",
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(payment.totalAmount)
        .replace("UGX", "UGX ");

      return {
        ...payment,
        issuedBy: issuerName,
        totalAmount: formattedTotalAmount,
      };
    });

    return <PaymentsClient data={transformedData} />;
  }

  return null;
};

export default PaymentsList;
