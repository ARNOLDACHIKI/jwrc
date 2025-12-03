import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import process from 'process'

const prisma = new PrismaClient()

const run = async () => {
  try {
    const [, , email, pass] = process.argv
    if (!email || !pass) {
      console.error('Usage: node scripts/reset-password.mjs email newPassword')
      process.exit(1)
    }

    let user = null
    try {
      user = await prisma.user.findUnique({ where: { email } })
    } catch (e) {
      // ignore
    }

    if (!user) {
      user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
    }

    if (!user) {
      console.error('User not found for', email)
      process.exit(2)
    }

    const hash = await bcrypt.hash(pass, 12)
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } })
    console.log('Password updated for', user.email)
  } catch (e) {
    console.error('Error:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

run()
