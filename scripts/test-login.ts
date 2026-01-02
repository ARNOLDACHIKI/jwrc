const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'jwrcjuja1@gmail.com'
  const password = 'c@ltex123'
  
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    console.log('User not found!')
    return
  }
  
  console.log('User found:', {
    email: user.email,
    role: user.role,
    hasPassword: !!user.password
  })
  
  if (user.password) {
    const valid = await bcrypt.compare(password, user.password)
    console.log(`Password "${password}" is valid:`, valid)
    
    // Test with different variations
    const testPasswords = ['c@ltex123', 'C@ltex123', 'c@ltex 123']
    for (const testPw of testPasswords) {
      const isValid = await bcrypt.compare(testPw, user.password)
      console.log(`Testing "${testPw}":`, isValid)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
