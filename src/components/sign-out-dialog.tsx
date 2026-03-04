import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from "@/context/use-auth.ts";
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false)

    const handleSignOut = async () => {
        try {
            setIsLoading(true)
            await logout()
        } finally {
            onOpenChange(false)
            navigate({
                to: '/sign-in',
                replace: true,
            })
            setIsLoading(false)
        }
    }

    return (
        <ConfirmDialog
            open={open}
              onOpenChange={onOpenChange}
              title='Sign out'
              desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
              confirmText='Sign out'
              destructive
              handleConfirm={handleSignOut}
              isLoading={isLoading}
              className='sm:max-w-sm'
        />
  )
}
