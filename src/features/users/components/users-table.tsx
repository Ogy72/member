import { useEffect, useMemo, useState } from 'react'
import {
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns as columns } from './users-columns'

const SORTABLE_MAP: Record<string, string> = {
  fullName: 'name',
  email: 'email',
  createdAt: 'createdAt',
}

type DataTableProps = {
  data: User[]
  totalRows: number
  pageCount: number
  isLoading: boolean
  isError: boolean
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function UsersTable({
  data,
  totalRows,
  pageCount,
  isLoading,
  isError,
  search,
  navigate,
}: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const sorting = useMemo<SortingState>(() => {
    const sortBy = typeof search.sortBy === 'string' ? search.sortBy : ''
    const sortOrder =
      search.sortOrder === 'desc'
        ? 'desc'
        : search.sortOrder === 'asc'
          ? 'asc'
          : undefined

    if (!sortBy || !sortOrder) return []

    const uiSortBy =
      Object.entries(SORTABLE_MAP).find(([, backendKey]) => backendKey === sortBy)?.[0] ??
      sortBy

    return [{ id: uiSortBy, desc: sortOrder === 'desc' }]
  }, [search.sortBy, search.sortOrder])

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (keys/defaults mirror users route search schema)
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      // username per-column text filter
      { columnId: 'username', searchKey: 'username', type: 'string' },
    ],
  })

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    const first = next[0]
    const backendSortBy = first ? SORTABLE_MAP[first.id] : undefined

    navigate({
      search: (prev) => ({
        ...(prev as Record<string, unknown>),
        page: undefined,
        sortBy: backendSortBy,
        sortOrder: first ? (first.desc ? 'desc' : 'asc') : undefined,
      }),
    })
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: totalRows,
    pageCount,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (isLoading) return
    ensurePageInRange(pageCount)
  }, [isLoading, pageCount, ensurePageInRange])

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter users...'
        searchKey='username'
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Failed to load users.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
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
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <DataTableBulkActions table={table} />
    </div>
  )
}
