#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

(async () => {
  const prisma = new PrismaClient()
  try {
    const [, , email, pass] = process.argv
    if (!email || !pass) {
      console.error('Usage: node scripts/reset-password.js email newPassword')
      process.exit(1)
    }

    // try exact match then case-insensitive
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      try {
        user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
      } catch (e) {
        // ignore
      }
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
})()
