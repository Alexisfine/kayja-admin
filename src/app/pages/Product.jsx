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
import Image from "next/image"
import {ProductCategoryCrud} from "./ProductCategoryCrud"
import ProductCategoryDelete from "./ProductCategoryDelete"
import ProductCategoryEdit from "./ProductCategoryEdit"
import ProductEdit from "./ProductEdit"
import ProductDelete from "./ProductDelete"
import ProductInsert from "./ProductInsert"

const plc = {
  id:"",
  name:"",
  name_eng:"",
  description:"",
  description_eng:"",
  status: 1,
  cover_img_url:"",
}

export function Product() {
  const columns = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("id")}</div>
        )
    },
    {
        accessorKey: "category_name",
        header: "产品类型名称",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("category_name")}</div>
        )
    },
    {
      accessorKey: "category_name_eng",
      header: "产品类型名称（英文）",
      cell: ({row}) => (
          <div className="capitalize">{row.getValue("category_name_eng")}</div>
      )
    },
    {
      accessorKey: "name",
      header: "产品名称",
      cell: ({row}) => (
          <div className="capitalize">{row.getValue("name")}</div>
      )
    },
    {
      accessorKey: "name_eng",
      header: "产品名称（英文）",
      cell: ({row}) => (
          <div className="capitalize">{row.getValue("name_eng")}</div>
      )
    },
    {
      accessorKey: "status",
      header: () => <div className="text-right">状态</div>,
      cell: ({ row }) => {
        const status = parseInt(row.getValue("status"))
        const res = status === 1 ? "上线" : "下线"           
  
        return <div className="text-right font-medium">{res}</div>
      },
    },
    {
      accessorKey: "ranking",
      header: () => <div className="text-right">排名（从高到低）</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("ranking")}</div>
      },
    },
    {
      accessorKey: "to_top",
      header: "置顶",
      cell: ({row}) => {
        const flag = row.getValue("to_top")
        const res = flag ? "是" : "否"
        return <div className="text-right font-medium">{res}</div>
      }          
    },
    {
        accessorKey: "cover_img_url",
        header: "封面图片",
        cell: ({row}) => (
            <Image src={row.getValue("cover_img_url")} alt='' width={150} height={150}/>
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
        return <ProductEdit info={data.find(i => i.id === id)} id={id} semaphore={setSemaphore}/>
      },
    },
    {
      accessorKey: "delete",
      header: () => <div>删除</div>,
      cell: ({ row }) => {
        const id = parseInt(row.getValue("id"))
        return <ProductDelete info={row} semaphore={setSemaphore}/>
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
    const fetchProductCategory = async () => {
        const res = await instance.get('http://120.76.205.116:9000/products/get_all_for_admin')
        if (res.data.code === 2) {
            setData(res.data.data)
        } else {
            console.log("failed to fetch data")
        }
    }
    fetchProductCategory()
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
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="搜索产品信息..."
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
      <ProductInsert title='新增产品' semaphore={setSemaphore}/>
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
