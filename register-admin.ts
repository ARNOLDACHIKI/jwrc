import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function registerAdmin() {
  try {
    const email = 'jwrcjuja.1@gmail.com'
    const password = 'c@ltex123'
    const name = 'Reverend caroline nyagechi'

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      console.log('❌ Admin account already exists with this email')
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log('✅ Admin account registered successfully!')
    console.log('📧 Email:', admin.email)
    console.log('👤 Name:', admin.name)
    console.log('🔐 Role:', admin.role)
  } catch (error) {
    console.error('❌ Error registering admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

registerAdmin()
