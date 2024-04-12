// "use client";

// import { useState } from "react";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   Row,
//   SortingState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import React from "react";
// import { Cross2Icon } from "@radix-ui/react-icons";
// import { PaymentColumn } from "./columns";
// import { useVirtualizer } from "@tanstack/react-virtual";

// interface DataTableProps<TData> {
//   columns: ColumnDef<TData>[];
//   data: TData[];
//   searchKey: string;
//   fetchMoreOnBottomReached: (
//     containerRefElement?: HTMLDivElement | null
//   ) => void;
// }

// const DataTableVirtualized = React.forwardRef<
//   HTMLDivElement,
//   DataTableProps<PaymentColumn>
// >(({ columns, data, searchKey, fetchMoreOnBottomReached }, ref) => {
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [sorting] = useState<SortingState>([]);
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     state: {
//       columnFilters,
//       sorting,
//     },
//   });
//   const isFiltered = table.getState().columnFilters.length > 0;

//   const { rows } = table.getRowModel();
//   console.log(rows);

//   const rowVirtualizer = useVirtualizer({
//     count: rows.length,
//     estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
//     getScrollElement: () => ref && ref.current && ref.current,
//     //measure dynamic row height, except in firefox because it measures table border height incorrectly
//     measureElement:
//       typeof window !== "undefined" &&
//       navigator.userAgent.indexOf("Firefox") === -1
//         ? (element) => element?.getBoundingClientRect().height
//         : undefined,
//     overscan: 5,
//   });

//   console.log(rowVirtualizer.getVirtualItems());

//   console.log("REF", ref);

//   return (
//     <div>
//       <div className="flex items-center py-4 gap-2">
//         <Input
//           placeholder="Search"
//           value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn(searchKey)?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         {isFiltered && (
//           <Button
//             variant="ghost"
//             onClick={() => table.resetColumnFilters()}
//             className="h-8 px-2 lg:px-3"
//           >
//             Reset
//             <Cross2Icon className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <div
//         ref={ref}
//         onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
//         className="rounded-md border overflow-auto relative h-[600px]"
//       >
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody
//             style={{
//               display: "grid",
//               height: `${rowVirtualizer.getTotalSize()}px`,
//               position: "relative",
//             }}
//           >
//             {rowVirtualizer.getVirtualItems().map((virtualRow) => {
//               const row = rows[virtualRow.index] as Row<PaymentColumn>;
//               return (
//                 <TableRow
//                   data-index={virtualRow.index}
//                   ref={(node) => rowVirtualizer.measureElement(node)}
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   // style={{
//                   //   display: "flex",
//                   //   position: "absolute",
//                   //   transform: `translateY(${virtualRow.start}px)`,
//                   //   width: "100%",
//                   // }}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// });

// export default DataTableVirtualized;
