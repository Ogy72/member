import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UsersForm, type UserFormValues } from './users-form'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios'
import { createUser } from "@/features/users/data/users-query.ts";

export function UsersCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isDirty, setIsDirty] = useState(false)
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)
  const createUserMutation = useMutation({
    mutationFn: createUser,
  })

  const leavePage = () => {
    setConfirmLeaveOpen(false)
    navigate({ to: '/users' })
  }

  const handleAttemptLeave = () => {
    if (!isDirty) {
      leavePage()
      return
    }
    setConfirmLeaveOpen(true)
  }

  const onSubmit = async (values: UserFormValues) => {
    const payload = {
      name: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    }

    try {
      await createUserMutation.mutateAsync(payload)
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("User created successfully.")
      leavePage()
    } catch (error: unknown) {
      let message = "Failed to create the user"

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message
      } else if (error instanceof Error) {
        message = error.message
      }

      toast.error(message)
    }
  }

  return (
    <>
      <Header fixed>
        <Search />

        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Add New User</h2>
            <p className='text-muted-foreground'>
              Click save when you&apos;re done.
            </p>
          </div>
          <Button variant='outline' className='space-x-1' onClick={handleAttemptLeave}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersForm
              onSubmit={onSubmit}
              submitLabel='Create User'
              onCancel={handleAttemptLeave}
              onDirtyChange={setIsDirty}
              isSubmitting={createUserMutation.isPending}
            />
          </CardContent>
        </Card>
      </Main>

      <ConfirmDialog
        open={confirmLeaveOpen}
        onOpenChange={setConfirmLeaveOpen}
        title='Discard unsaved changes?'
        desc='Your input will be lost if you leave this page now.'
        cancelBtnText='Stay'
        confirmText='Leave Page'
        destructive
        handleConfirm={leavePage}
      />
    </>
  )
}
