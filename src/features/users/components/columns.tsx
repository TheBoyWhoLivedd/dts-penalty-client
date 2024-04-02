import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type UserColumn = {
  id: string;
  name: string;
  // imageUrl: string;
};

export const UserColumns: ColumnDef<UserColumn>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
