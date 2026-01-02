import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'jwrcjuja.1@gmail.com'
  const emailWithoutDot = 'jwrcjuja1@gmail.com'
  const password = 'c@ltex123'
  
  console.log('Checking for users...\n')
  
  // Check with dot
  let user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (user) {
    console.log(`Found user with email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Role: ${user.role}`)
    console.log(`Has password: ${!!user.password}`)
    
    if (user.password) {
      const valid = await bcrypt.compare(password, user.password)
      console.log(`Password "${password}" is valid: ${valid}`)
    }
  } else {
    console.log(`No user found with email: ${email}`)
  }
  
  // Check without dot
  user = await prisma.user.findUnique({
    where: { email: emailWithoutDot }
  })
  
  if (user) {
    console.log(`\nFound user with email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Role: ${user.role}`)
    console.log(`Has password: ${!!user.password}`)
    
    if (user.password) {
      const valid = await bcrypt.compare(password, user.password)
      console.log(`Password "${password}" is valid: ${valid}`)
    }
  } else {
    console.log(`\nNo user found with email: ${emailWithoutDot}`)
  }
  
  // List all Gmail users
  const allGmailUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: '@gmail.com',
        mode: 'insensitive'
      }
    },
    select: {
      email: true,
      name: true,
      role: true,
      password: false
    }
  })
  
  console.log(`\nAll Gmail users in database:`)
  allGmailUsers.forEach(u => {
    console.log(`  - ${u.email} (${u.name || 'no name'}) - Role: ${u.role}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

