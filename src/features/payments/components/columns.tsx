import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PaymentColumn = {
  id: string;
  _id: string;
  tin: string;
  nin: string;
  name: string;
  category: string;
  penalties: IssuedPenalty[];
  description: string;
  totalAmount: string;
  prn: string;
  issuedBy: string;
  issuedAt: Date;
  attachments?: string[];
};

// interface PaymentConfig {
//   id: string;
//   _id: string;
//   tin: string;
//   nin: string;
//   name: string;
//   penalties: IssuedPenalty[];
//   description: string;
//   totalAmount: number;
//   prn: string;
//   issuedBy: string;
//   issuedAt: Date;
//   attachments?: string[];
// }

export const PaymentColumns: ColumnDef<PaymentColumn>[] = [
  {
    accessorKey: "prn",
    header: "PRN",
    size: 200,
  },
  {
    accessorKey: "tin",
    header: "Taxpayer TIN",
    size: 200,
  },
  {
    accessorKey: "nin",
    header: "NIN",
    size: 200,
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 200,
  },
  {
    // accessorFn: row => row.name,
    accessorKey: "name",
    header: "Tax Payer Name",
    size: 400,
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    size: 200,
  },
  {
    accessorKey: "issuedBy",
    header: "Issued By",
    size: 200,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
