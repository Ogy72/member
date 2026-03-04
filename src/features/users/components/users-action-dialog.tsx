'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../data/users-query'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { type User } from '../data/schema'
import { UsersForm, type UserFormValues } from './users-form'

type UserActionDialogProps = {
    currentRow?: User
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
    currentRow,
    open,
    onOpenChange,
}: UserActionDialogProps) {
    const queryClient = useQueryClient()

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
    })

    const onSubmit = async (values: UserFormValues) => {
        if (!currentRow?.id) return

        const payload = {
            id: currentRow.id,
            name: `${values.firstName} ${values.lastName}`.trim(),
            email: values.email.trim().toLowerCase(),
            ...(values.password ? { password: values.password } : {}),
        }

        try {
            await updateUserMutation.mutateAsync(payload)
            await queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success(`User updated successfully.`)
            onOpenChange(false)
        } catch (error: unknown) {
            let message = 'Failed to update user'

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message
            } else if (error instanceof Error) {
                message = error.message
            }

            toast.error(message)
        }
    }

    if (!currentRow) return null

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className='sm:max-w-lg'
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className='text-start'>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update the user here.
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
                    <UsersForm
                        currentRow={currentRow}
                        onSubmit={onSubmit}
                        isSubmitting={updateUserMutation.isPending}
                    />
                </div>

            </DialogContent>
        </Dialog>
    )
}
