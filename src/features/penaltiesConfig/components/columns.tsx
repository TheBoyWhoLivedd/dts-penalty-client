import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type PenaltyColumn = {
  id: string;
  penaltyTitle: string;
};

export const PenaltyColumns: ColumnDef<PenaltyColumn>[] = [
  {
    accessorKey: "penaltyTitle",
    header: "Penalty Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
