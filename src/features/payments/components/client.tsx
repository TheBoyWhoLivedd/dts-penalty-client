import { Heading } from "@/components/ui/heading";
import { PaymentColumn, PaymentColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  // useQueryClient,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/features/auth/authSlice";

import {
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";

const fetchSize = 50;

export type PaymentApiResponse = {
  payments: PaymentConfig[];
  meta: {
    totalRowCount: number;
  };
};

type UsersMapping = { [key: string]: string };

async function fetchPayments(
  start: number,
  limit: number,
  token: string | null
): Promise<PaymentApiResponse> {
  const queryParams = new URLSearchParams({
    page: (start / limit + 1).toString(),
    limit: limit.toString(),
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";
  const url = `${apiUrl}/payments?${queryParams}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Failed to fetch data");
  }
}
async function fetchUsers(token: string | null): Promise<UsersMapping> {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";
  const url = `${apiUrl}/users`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data: User[] = await response.json();
    const usersMapping = data.reduce<UsersMapping>((acc, user) => {
      acc[user._id] = user.name;
      return acc;
    }, {});
    return usersMapping;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Failed to fetch data");
  }
}

export const PaymentsClient: React.FC = () => {
  // const navigate = useNavigate();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const token = useSelector(selectCurrentToken);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting] = useState<SortingState>([]);

  const {
    // isPending,
    // error,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const fetchedUsers = await fetchUsers(token);
      console.log("Fetched Users", fetchedUsers);
      return fetchedUsers;
    },
  });
  // const queryClient = useQueryClient();/

  const { data, fetchNextPage, isFetching } =
    useInfiniteQuery<PaymentApiResponse>({
      queryKey: ["payments"],
      queryFn: async ({ pageParam = 0 }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = await fetchPayments(start, fetchSize, token);
        console.log("Fetched Data", fetchedData);
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
      // staleTime: 60 * 1000, 
      // initialData: () => {
      //   // Get the query state
      //   const state = queryClient.getQueryState(["payments"]);
      //   console.log("State", state);
      //   // If the query exists and has data that is no older than 10 seconds...
      //   if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      //     // return the individual todo
      //     return state.data.find((d) => d.id === todoId);
      //   }

      //   // Otherwise, return undefined and let it fetch from a hard loading state!
      // },
    });

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(() => {
    return (
      data?.pages?.flatMap((page) =>
        page.payments.map((payment) => {
          const formattedTotalAmount = new Intl.NumberFormat("en-UG", {
            style: "currency",
            currency: "UGX",
            currencyDisplay: "narrowSymbol",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
            .format(payment.totalAmount)
            .replace("UGX", "UGX ");
          const issuedByName =
            (users && users[payment.issuedBy]) || payment.issuedBy;
          return {
            ...payment,
            issuedBy: issuedByName,
            totalAmount: formattedTotalAmount,
          };
        })
      ) ?? []
    );
  }, [data, users]);

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;
  // console.log("Total fetched", totalFetched + " / " + totalDBRowCount);

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // console.log(
        //   "ScrollHeight",
        //   scrollHeight,
        //   "ScrollTop",
        //   scrollTop,
        //   "Client height",
        //   clientHeight
        // );

        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns: PaymentColumns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
      sorting,
    },
  });
  const isFiltered = table.getState().columnFilters.length > 0;

  const { rows } = table.getRowModel();
  // console.log(rows);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // console.log("Virtualiser", rowVirtualizer);

  const searchKey = "prn";
  return (
    <div className="p-2 md:p-5 lg:px-25 bg-background rounded-md">
      <div className="flex items-center justify-between">
        <Heading
          title={`Issued PRNs (${flatData.length} of ${totalDBRowCount})`}
          description=""
        />
        {/* <Button onClick={() => navigate("/dash/payments/new")}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />
      <div>
        <div className="flex items-center py-4 gap-2">
          <Input
            placeholder="Search by PRN"
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div
          ref={tableContainerRef}
          onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
          className="rounded-md border"
          style={{
            overflow: "auto",
            position: "relative", //needed for sticky header
            height: "768px", //should be a fixed height
          }}
        >
          <table className="grid text-sm">
            <TableHeader
              style={{
                display: "grid",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  style={{ display: "flex", width: "100%" }}
                >
                  {headerGroup.headers.map((header, index) => {
                    // console.log(
                    //   "Header",
                    //   header,
                    //   "with header size",
                    //   header.getSize()
                    // );
                    return (
                      <TableHead
                        className="bg-slate-100"
                        key={header.id}
                        style={{
                          display: "flex",
                          justifyContent: index === 0 ? "flex-start" : "center",
                          // flex: columnFlexValues[index],
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              style={{
                display: "grid",
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<PaymentColumn>;
                return (
                  <TableRow
                    data-index={virtualRow.index}
                    ref={(node) => rowVirtualizer.measureElement(node)}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    style={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                    }}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      // console.log(cell, "with size", cell.column.getSize());
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            display: "flex",
                            justifyContent:
                              index === 0 ? "flex-start" : "center",
                            // flex: columnFlexValues[index],
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </table>
        </div>
      </div>
    </div>
  );
};
