'use client'

import { showSubmittedData } from '@/lib/show-submitted-data'
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
    const onSubmit = (values: UserFormValues) => {
        showSubmittedData(values)
        onOpenChange(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>'Edit User'</DialogTitle>
                    <DialogDescription>
                        Update the user here.
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
                    <UsersForm currentRow={currentRow} onSubmit={onSubmit} />
                </div>

            </DialogContent>
        </Dialog>
    )
}
