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
        className='space-y-4 px-0.5'
      >
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='John'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Doe'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Username</FormLabel>
              <FormControl>
                <Input placeholder='john_doe' className='col-span-4' {...field} />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='john.doe@gmail.com'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder='+123456789' className='col-span-4' {...field} />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Role</FormLabel>
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                placeholder='Select a role'
                className='col-span-4'
                items={roles.map(({ label, value }) => ({
                  label,
                  value,
                }))}
              />
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='e.g., S3cur3P@ssw0rd'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  disabled={!isPasswordTouched}
                  placeholder='e.g., S3cur3P@ssw0rd'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

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
