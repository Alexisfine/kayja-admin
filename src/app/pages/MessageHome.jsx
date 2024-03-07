"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import instance from "@/axios/axios"
import MessageDelete from "./MessageDelete"
import MessageInfo from "./MessageInfo"


const MessageHome = () => {
  const columns = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("id")}</div>
        )
    },
    {
        accessorKey: "name",
        header: "姓名",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("name")}</div>
        )
    },
    {
      accessorKey: "email",
      header: "邮箱",
      cell: ({row}) => (
          <div className="capitalize">{row.getValue("email")}</div>
      )
    },
    {
        accessorKey: "phone",
        header: "手机",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("phone")}</div>
        )
      },
      {
        accessorKey: "company_name",
        header: "公司",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("company_name")}</div>
        )
    },
    {
        accessorKey: "msg",
        header: "留言",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("msg")}</div>
        )
      },
      {
        accessorKey: "product",
        header: "产品",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("product")}</div>
        )
      },
      {
        accessorKey: "ctime",
        header: "创建时间",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("ctime")}</div>
        )
    },
    {
        accessorKey: "detail",
        header: () => <div>查看详情</div>,
        cell: ({ row }) => {
          const id = parseInt(row.getValue("id"))
          return <MessageInfo info={row}/>
        },
      },
    {
      accessorKey: "delete",
      header: () => <div>删除</div>,
      cell: ({ row }) => {
        const id = parseInt(row.getValue("id"))
        return <MessageDelete info={row} semaphore={setSemaphore}/>
      },
    },
]

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState([])
  const [semaphore, setSemaphore] = React.useState(0.0)
  React.useEffect(() => {
    const fetchData = async () => {
        const res = await instance.get('http://120.76.205.116:9000/messages/get_all')
        if (res.data.code === 2) {
            setData(res.data.data)
        } else {
            console.log("failed to fetch data")
        }
    }
    fetchData()
  }, [semaphore])

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <div className="w-full flex flex-col py-3 px-8">
      <h2 className='text-4xl'>用户留言管理</h2>
      <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="搜索信息..."
          value={(table.getColumn("name")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  未找到相关的信息
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          已选{table.getFilteredSelectedRowModel().rows.length}行，共
          {table.getFilteredRowModel().rows.length}行
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default MessageHome