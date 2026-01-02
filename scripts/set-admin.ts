import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Use the email with dot as that's what the user wants to use
  const email = 'jwrcjuja.1@gmail.com'
  const emailWithoutDot = 'jwrcjuja1@gmail.com'
  const name = 'rev caroline nyagechi'
  const password = 'c@ltex123' // Default password from screenshot
  
  // Find user with dot (the one we want to update)
  let userWithDot = await prisma.user.findUnique({
    where: { email }
  })
  
  // Find user without dot (might be a duplicate)
  let userWithoutDot = await prisma.user.findUnique({
    where: { email: emailWithoutDot }
  })
  
  // If user with dot exists, update it
  if (userWithDot) {
    console.log(`Found user with email: ${userWithDot.email}`)
    console.log(`Current name: ${userWithDot.name}, Current role: ${userWithDot.role}`)
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Update the user with dot to have correct password, name, and role
    const updated = await prisma.user.update({
      where: { id: userWithDot.id },
      data: { 
        role: 'admin', 
        name: name,
        password: hashedPassword // Update password to match
      }
    })
    
    console.log('Updated user:', updated)
    
    // If duplicate user without dot exists, delete it
    if (userWithoutDot && userWithoutDot.id !== userWithDot.id) {
      console.log(`\nDeleting duplicate user: ${userWithoutDot.email}`)
      await prisma.user.delete({
        where: { id: userWithoutDot.id }
      })
      console.log('Duplicate user deleted')
    }
    
    console.log(`\nYou can now log in with: ${email} and password: ${password}`)
    return
  }
  
  // If user with dot doesn't exist but user without dot does, update that one
  if (userWithoutDot) {
    console.log(`Found user with email: ${userWithoutDot.email}`)
    console.log(`Updating email to: ${email}`)
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const updated = await prisma.user.update({
      where: { id: userWithoutDot.id },
      data: { 
        email: email, // Change email to have dot
        role: 'admin', 
        name: name,
        password: hashedPassword
      }
    })
    
    console.log('Updated user:', updated)
    console.log(`\nYou can now log in with: ${email} and password: ${password}`)
    return
  }
  
  // If neither exists, create new user
  console.log(`User ${email} not found. Creating new admin user...`)
  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'admin'
    }
  })
  console.log('Created new admin user:', newUser)
  console.log(`\nYou can now log in with: ${email} and password: ${password}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
