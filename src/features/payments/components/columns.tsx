import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PaymentColumn = {
  id: string;
  prn: string;
  tin: string;
  nin: string;
  totalAmount: string;
  issuedBy: string;
};

export const PaymentColumns: ColumnDef<PaymentColumn>[] = [
  {
    accessorKey: "prn",
    header: "PRN",
  },
  {
    accessorKey: "tin",
    header: "Taxpayer TIN",
  },
  {
    accessorKey: "nin",
    header: "NIN",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "issuedBy",
    header: "Issued By",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
