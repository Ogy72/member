import { api } from '@/lib/api'
import { userListSchema, type User, type UserRole, type UserStatus } from './schema'

export type SortOrder = 'asc' | 'desc'

export type GetUsersParams = {
  page: number
  pageSize: number
  username?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export type PaginatedUsers = {
  items: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
}

const VALID_STATUS = new Set<UserStatus>(['active', 'inactive', 'suspended'])
const VALID_ROLE = new Set<UserRole>(['superadmin', 'admin', 'cashier', 'manager'])

function toNumber(v: unknown, fallback: number) {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v)
    if (Number.isFinite(n)) return n
    }
  return fallback
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function normalizeUser(raw: Record<string, unknown>, i: number): User {
  const email = String(raw.email ?? '').trim().toLowerCase()
  const name = String(raw.name ?? '').trim()
  const { firstName, lastName } = splitName(name)

  return {
    id: String(raw.id ?? `member-${i + 1}`),
    firstName,
    lastName,
    username: email.includes('@') ? email.split('@')[0] : `member-${i + 1}`,
    email,
    phoneNumber: '-',
    status: VALID_STATUS.has('active') ? 'active' : 'inactive',
    role: VALID_ROLE.has('cashier') ? 'cashier' : 'admin',
    createdAt: new Date(String(raw.createdAt ?? Date.now())),
    updatedAt: new Date(String(raw.createdAt ?? Date.now())),
  }
}

export async function getUsers(params: GetUsersParams): Promise<PaginatedUsers> {
  const res = await api.get('/members', {
    params: {
      page: params.page,
      limit: params.pageSize,
      search: params.username || undefined,
      sortBy: params.sortBy || undefined,
      sortOrder: params.sortOrder || undefined,
    },
  })

  const payload = res.data as Record<string, unknown>
  const rawItems = payload.data
  const meta = (payload.meta as Record<string, unknown>) ?? {}

  const mapped = Array.isArray(rawItems)
    ? rawItems.map((x, i) => normalizeUser((x as Record<string, unknown>) ?? {}, i))
    : []

  const parsed = userListSchema.safeParse(mapped)
  const items = parsed.success ? parsed.data : []

  return {
    items,
    total: toNumber(meta.total, items.length),
    page: toNumber(meta.page, params.page),
    pageSize: toNumber(meta.limit, params.pageSize),
    totalPages: toNumber(meta.totalPages, 1),
  }
}

export async function createUser(payload: CreateUserPayload){
  const res = await api.post('/members', payload)
  return res.data
}
