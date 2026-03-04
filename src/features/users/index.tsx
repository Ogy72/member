import { getRouteApi } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getUsers } from './data/users-query'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const params = useMemo(
    () => ({
      page: (search.page as number) ?? 1,
      pageSize: (search.pageSize as number) ?? 10,
      username: (search.username as string) || undefined,
      sortBy: (search.sortBy as string) || undefined,
      sortOrder: search.sortOrder as 'asc' | 'desc' | undefined,
    }),
    [search]
  )

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const rows = data?.items ?? []
  const totalRows = data?.total ?? 0
  const pageCount = data?.totalPages ?? Math.max(1, Math.ceil(totalRows / params.pageSize))

  return (
    <UsersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable
          data={rows}
          totalRows={totalRows}
          pageCount={pageCount}
          isLoading={isLoading}
          isError={isError}
          search={search}
          navigate={navigate}
        />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
