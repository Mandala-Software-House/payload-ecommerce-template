"use client";
"use no memo";
// TODO: delete use no memo after Tanstack react-table bump to react 19

import { type DefaultTranslationKeys, type TFunction } from "@payloadcms/translations";
import { useTranslation } from "@payloadcms/ui";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { type Where } from "payload";
import { stringify } from "qs-esm";
import { useEffect, useState } from "react";

import { type CustomTranslationsKeys } from "@/admin/translations/custom-translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Order } from "@/payload-types";
import { formatPrice } from "@/utilities/formatPrices";

const select = {
  id: true,
  createdAt: true,
  customer: true,
  orderDetails: {
    status: true,
    totalWithShipping: true,
    currency: true,
    transactionID: true,
  },
  shippingAddress: {
    email: true,
  },
};

export const OverviewLastOrders = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { i18n } = useTranslation();
  const t: TFunction<CustomTranslationsKeys | DefaultTranslationKeys> = i18n.t;

  const columns: ColumnDef<Order>[] = [
    {
      id: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-payload-elevation-0 px-0 text-base"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("adminDashboard:date")}
            <ArrowUpDown width={20} height={20} className="ml-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      id: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-payload-elevation-0 px-0 text-base"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("adminDashboard:status")}
            <ArrowUpDown width={20} height={20} className="ml-2" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p>{t(`adminDashboard:${row.original.orderDetails.status}`)}</p>;
      },
    },
    {
      id: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-payload-elevation-0 px-0 text-base"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("adminDashboard:email")}
            <ArrowUpDown width={20} height={20} className="ml-2" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.original.shippingAddress.email}</div>,
    },
    {
      id: "amount",
      header: () => (
        <div className="hover:bg-payload-elevation-0 text-right">{t("adminDashboard:amount")}</div>
      ),
      cell: ({ row }) => {
        const amount = row.original.orderDetails.totalWithShipping;
        const currency = row.original.orderDetails.currency;

        const formatted = formatPrice(amount, currency, i18n.language);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("adminDashboard:openMenu")}</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-payload-elevation-50">
              <DropdownMenuLabel>{t("adminDashboard:actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.orderDetails.transactionID ?? "")}
              >
                {t("adminDashboard:copyPaymentID")}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-payload-elevation-0 bg-payload-elevation-0" />
              {order.customer && (
                <DropdownMenuItem>
                  <Link
                    href={`/admin/collections/customers/${typeof order.customer === "string" ? order.customer : order.customer.id}`}
                    className="no-underline"
                  >
                    {t("adminDashboard:viewCustomer")}
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/admin/collections/orders/${order.id}`} className="no-underline">
                  {t("adminDashboard:viewOrder")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const handlePaginationChange = (page: number) => {
    router.push(`?${createQueryString("page", page.toString())}`, { scroll: false });
  };

  const [data, setData] = useState<Order[]>([]);

  useEffect(() => {
    const filteringQuery: Where = {
      "shippingAddress.email": {
        contains: columnFilters.find((filter) => filter.id === "email")?.value,
      },
    };

    const sortingQuery = sorting.map((sort) => {
      switch (sort.id) {
        case "status": {
          return sort.desc ? "-orderDetails.status" : "orderDetails.status";
        }
        case "email": {
          return sort.desc ? "-shippingAddress.email" : "shippingAddress.email";
        }
        case "date": {
          return sort.desc ? "-createdAt" : "createdAt";
        }
      }
    });

    const stringifiedQuery = stringify(
      {
        select,
        limit: 6,
        page: currentPage,
        sort: sortingQuery.length === 1 ? sortingQuery[0] : sortingQuery,
        where: filteringQuery,
      },
      { addQueryPrefix: true },
    );

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get<{ docs: Order[] }>(`/api/orders${stringifiedQuery}`, {
          withCredentials: true,
        });
        setData(data.docs);
      } catch (error) {
        console.log(error);
      }
    };
    void fetchOrders();
  }, [currentPage, sorting, columnFilters]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <Card className="twp border-payload-elevation-150 rounded-xl border bg-transparent lg:col-span-3">
      <CardHeader>
        <CardTitle>{t("adminDashboard:recentOrders")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4">
            <div className="no-twp field-type text">
              <input
                placeholder={t("adminDashboard:filterEmails")}
                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                onChange={(event) => {
                  table.getColumn("email")?.setFilterValue(event.target.value);
                }}
                className="placeholder:text-payload-elevation-900 h-10 max-w-sm placeholder:opacity-75"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-payload-elevation-150 bg-payload-elevation-50 hover:bg-payload-background-color ml-auto text-base"
                >
                  {t("adminDashboard:columns")} <ChevronDown className="ml-2" width={20} height={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-payload-elevation-50">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="hover:bg-payload-elevation-0 cursor-pointer text-base capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {t(`adminDashboard:${column.id as "date" | "status" | "email" | "amount"}`)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="border-payload-elevation-150 rounded-lg border">
            <Table className="text-base">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    className="border-payload-elevation-150 hover:bg-transparent"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-payload-elevation-900 opacity-75">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className="border-payload-elevation-150 hover:bg-payload-elevation-50"
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-payload-elevation-150 hover:bg-payload-elevation-50">
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              className="border-payload-elevation-150 bg-payload-elevation-50 hover:bg-payload-elevation-0 border text-base"
              size="sm"
              onClick={() => handlePaginationChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              {t("adminDashboard:previous")}
            </Button>
            <Button
              variant="outline"
              className="border-payload-elevation-150 bg-payload-elevation-50 hover:bg-payload-elevation-0 border text-base"
              size="sm"
              onClick={() => handlePaginationChange(currentPage + 1)}
              disabled={data.length < 6}
            >
              {t("adminDashboard:next")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
