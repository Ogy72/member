import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '@/features/users/data/data'
import { type User } from '@/features/users/data/schema'
import { userFormSchema } from './users-form-schema'

export type UserFormValues = z.infer<typeof userFormSchema>

type UserFormProps = {
  currentRow?: User
  onSubmit: (values: UserFormValues) => void
  submitLabel?: string
  onCancel?: () => void
  onDirtyChange?: (isDirty: boolean) => void
}

export function UsersForm({
  currentRow,
  onSubmit,
  submitLabel = 'Save Changes',
  onCancel,
  onDirtyChange,
}: UserFormProps) {
  const isEdit = !!currentRow

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: isEdit
      ? { ...currentRow, password: '', confirmPassword: '', isEdit: true }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit: false,
        },
  })

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty)
  }, [form.formState.isDirty, onDirtyChange])

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Form {...form}>
      <form
        id='user-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-5 px-0.5'
      >
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' autoComplete='off' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' autoComplete='off' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='john_doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder='+123456789' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='john.doe@gmail.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Select a role'
                  items={roles.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='hidden md:block' />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='e.g., S3cur3P@ssw0rd' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={!isPasswordTouched}
                    placeholder='e.g., S3cur3P@ssw0rd'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex items-center justify-end gap-2'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type='submit'>{submitLabel}</Button>
        </div>
      </form>
    </Form>
  )
}
