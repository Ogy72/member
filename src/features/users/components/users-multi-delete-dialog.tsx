'use client'

import axios from 'axios'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bulkDeleteUsers } from "../data/users-query.ts"
import { type User } from "../data/schema.ts"
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()
  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteUsers,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows
      .map((row) => (row.original as User).id)
      .filter((id): id is string => Boolean(id))

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    if (selectedIds.length === 0) {
      toast.error("No users selected")
      return
    }

    try {
      const result = await bulkDeleteMutation.mutateAsync({ ids: selectedIds })
      await queryClient.invalidateQueries({ queryKey: ["users"] })

      onOpenChange(false)
      setValue('')
      table.resetRowSelection()

      if (result.notFoundIds?.length) {
        toast.warning(
            `Deleted ${result.deletedCount}/${result.requestedCount}. Some users were not found`,
        )
      } else {
        toast.success(`Deleted ${result.deletedCount} user(s)`)
      }
    } catch (error: unknown) {
      let message = "Failed to delete users"

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message
      } else if (error instanceof Error) {
        message = error.message
      }

      toast.error(message)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setValue('')
    onOpenChange(nextOpen)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      isLoading={bulkDeleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the selected users? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
