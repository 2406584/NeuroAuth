import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import argon2 from 'argon2'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const username = 'admin'
  const password = 'superpassword'

  const existingAdmin = await prisma.users.findFirst({
    where: { username, role: 'SUPERADMIN' }
  })

  if (!existingAdmin) {
    const hash = await argon2.hash(password, { type: argon2.argon2id })
    const superAdmin = await prisma.users.create({
      data: {
        username,
        password: hash,
        role: 'SUPERADMIN',
        neuro: false,
      }
    })
    console.log('Superadmin created:', superAdmin.username)
  } else {
    console.log('Superadmin already exists')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })