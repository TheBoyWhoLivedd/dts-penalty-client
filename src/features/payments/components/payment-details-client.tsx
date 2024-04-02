import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import React from "react";

interface PaymentDetailsClientProps {
  data: PaymentConfig;
}

const PaymentDetailsClient: React.FC<PaymentDetailsClientProps> = ({
  data,
}) => {
  return (
    <div className="space-y-4">
      <Heading title={`Payment Details`} description="" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Penalty Title</TableHead>
            <TableHead>Amount (UGX)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.penalties.map((penalty) => (
            <TableRow key={penalty.id}>
              <TableCell>{penalty.penaltyTitle}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-UG", {
                  style: "decimal",
                  maximumFractionDigits: 0,
                }).format(penalty.finalAmount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.attachments &&
          data.attachments.map((attachment, index) => (
            <img
              key={index}
              src={attachment}
              alt={`Attachment ${index + 1}`}
              className="mb-2 rounded-md"
              style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }}
            />
          ))}
      </div>
    </div>
  );
};

export default PaymentDetailsClient;
