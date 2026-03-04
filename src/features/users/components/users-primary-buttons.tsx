import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from "@tanstack/react-router"

export function UsersPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Button asChild className='space-x-1'>
          <Link to="/users/create">
              <span>Add User</span>
              <UserPlus size={18} />
          </Link>
      </Button>
    </div>
  )
}
