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
import FaqInsert from "./FaqInsert"
import FaqDelete from "./FaqDelete"
import FaqEdit from "./FaqEdit"

const plc = {
  id:"",
  name:"",
  name_eng:"",
  logo_url:"",
  status: 1,
  cover_url:"",
}

const FaqHome = () => {
  const columns = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("id")}</div>
        )
    },
    {
        accessorKey: "question",
        header: "问题",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("question")}</div>
        )
    },
    {
      accessorKey: "question_eng",
      header: "问题（英文）",
      cell: ({row}) => (
          <div className="capitalize">{row.getValue("question_eng")}</div>
      )
    },
    {
      accessorKey: "answer",
      header: "解答",
      cell: ({row}) => (
          <div className="capitalize">{row.getValue("answer")}</div>
      )
  },
  {
    accessorKey: "answer_eng",
    header: "解答（英文）",
    cell: ({row}) => (
        <div className="capitalize">{row.getValue("answer_eng")}</div>
    )
  },
   
    {
        accessorKey: "ctime",
        header: "修改时间",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("ctime")}</div>
        )
    },
    {
        accessorKey: "utime",
        header: "更新时间",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("utime")}</div>
        )
    },
    {
      accessorKey: "edit",
      header: () => <div>修改</div>,
      cell: ({ row }) => {
        const id = row.getValue("id")
        return <FaqEdit info={data.find(i => i.id === id)} semaphore={setSemaphore}/>
      },
    },
    {
      accessorKey: "delete",
      header: () => <div>删除</div>,
      cell: ({ row }) => {
        const id = parseInt(row.getValue("id"))
        return <FaqDelete info={row} semaphore={setSemaphore}/>
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
    const fetchCases = async () => {
        const res = await instance.get('http://120.76.205.116:9000/faqs/get_all')
        if (res.data.code === 2) {
            setData(res.data.data)
        } else {
            console.log("failed to fetch data")
        }
    }
    fetchCases()
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
      <h2 className='text-4xl'>常见问题管理</h2>
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
      <div>
      <FaqInsert title='新增案例' semaphore={setSemaphore} className='w-1/2'/>
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
  )
}

export default FaqHome
