import { useParams } from "react-router-dom";
import PaymentDetailsClient from "./components/payment-details-client";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { PaymentApiResponse } from "./components/client";
import { useMemo } from "react";

const PaymentDetails = () => {
  const { id } = useParams<string>();
  const queryClient = useQueryClient();

  const allPages = queryClient.getQueryData<
    InfiniteData<PaymentApiResponse, unknown> | undefined
  >(["payments"]);
  // console.log("All pages",allPages)

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(
    () => allPages?.pages?.flatMap((page) => page.payments) ?? [],
    [allPages]
  );

  // console.log("flatData", flatData);

  const payment = flatData.find((p) => p._id === id);

  if (!payment) return <p>Payment Not Found...</p>;

  const content = (
    <div className="rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
      <PaymentDetailsClient data={payment} />
    </div>
  );

  return content;
};

export default PaymentDetails;
