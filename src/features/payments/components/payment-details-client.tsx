import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { selectCurrentToken } from "@/features/auth/authSlice"; // Ensure this import is correct based on your project structure
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface PaymentDetailsClientProps {
  data: PaymentConfig;
}

const PaymentDetailsClient: React.FC<PaymentDetailsClientProps> = ({
  data,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";
  const token = useSelector(selectCurrentToken);
  const [prnStatus, setPrnStatus] = useState<string>("");

  const fetchPRNDetails = async (prn: string) => {
    if (!prn) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid PRN.",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/payments/getPrnDetails/${prn}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PRN details");
      }
      const result = await response.json();

      // const statusVariant =
      //   result.prnStatus2 === "AVAILABLE" ? "destructive" : "default";
      const statusLabel =
        result.data.prnStatus2 === "AVAILABLE" ? "Unpaid" : "Paid";

      setPrnStatus(statusLabel);

      // toast({
      //   variant: statusVariant,
      //   title: `PRN Status: ${statusLabel}`,
      //   description: "",
      // });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching PRN details:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch PRN details",
        description: error.message || "Network error",
      });
    }
  };

  useEffect(() => {
    fetchPRNDetails(data.prn);
  }, []);

  return (
    <div className="space-y-4">
      <Heading title={`Payment Details`} description="" />
      {prnStatus ? (
        <Badge variant={prnStatus === "Unpaid" ? "destructive" : "default"}>
          {prnStatus}
        </Badge>
      ) : (
        <Skeleton className="w-20 h-5" />
      )}
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
