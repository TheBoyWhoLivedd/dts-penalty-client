import { useParams } from "react-router-dom";
import { useGetPaymentsQuery } from "./paymentApiSlice";
import PaymentDetailsClient from "./components/payment-details-client";

const PaymentDetails = () => {
  const { id } = useParams<string>();

  const { payment } = useGetPaymentsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      payment: id ? data?.entities[id] : undefined,
    }),
  });

  console.log("Payment Receieved", payment);

  if (!payment) return <p>Loading...</p>;

  const content = (
    <div className="rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
      <PaymentDetailsClient data={payment} />
    </div>
  );

  return content;
};

export default PaymentDetails;
