import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { __prisma?: PrismaClient }

const prisma = globalForPrisma.__prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma

export async function safeExecute(sql: string, ...params: any[]) {
  try {
    return await prisma.$executeRawUnsafe(sql, ...params)
  } catch (err: any) {
    console.warn('DB execute failed:', err?.message || err)
    return null
  }
}

export async function safeQuery<T = any>(sql: string, ...params: any[]): Promise<T[]> {
  try {
    const rows = await prisma.$queryRawUnsafe(sql, ...params)
    return Array.isArray(rows) ? (rows as T[]) : (rows ? [rows as T] : [])
  } catch (err: any) {
    console.warn('DB query failed:', err?.message || err)
    return []
  }
}

export { prisma }
