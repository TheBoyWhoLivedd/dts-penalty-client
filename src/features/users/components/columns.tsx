import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type UserColumn = {
  id: string;
  name: string;
  // imageUrl: string;
};

export const UserColumns: ColumnDef<UserColumn>[] = [
  // {
  //   accessorKey: "imageUrl",
  //   header: "Image",
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-start">
  //       <Image
  //         src={row.original.imageUrl}
  //         alt={row.original.name}
  //         className="h-12 w-12 rounded-full"
  //         width={48}
  //         height={48}
  //       />
  //     </div>
  //   ),
  // },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
