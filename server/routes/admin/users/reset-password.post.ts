import { defineEventHandler, readBody, createError } from "h3"
import argon2 from "argon2"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user?.role !== "SUPERADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  const body = await readBody(event)
  const { userId, newPassword } = body

  if (!userId || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: "userId and newPassword required" })
  }

  const prisma = GetDB()
  const uid = BigInt(userId)
  const hashed = await argon2.hash(newPassword)

  // Update password
  await prisma.users.update({
    where: { id: uid },
    data: { password: hashed }
  })

  // Auto-unlock if locked
  const latestPhase = await prisma.phases.findFirst({
    where: { user_id: uid },
    orderBy: { created_at: 'desc' }
  })

  if (latestPhase && !latestPhase.completed) {
    const failedAttempts = await prisma.usersLogin.count({
      where: {
        user_id: uid,
        success: false,
        created_at: { gte: latestPhase.created_at }
      }
    })

    if (failedAttempts >= 3) {
      await prisma.phases.update({
        where: { id: latestPhase.id },
        data: { completed: true }
      })
      await prisma.phases.create({
        data: {
          user_id: uid,
          completed: false
        }
      })
    }
  }

  return { success: true, message: "Password reset and user unlocked for next phase (if previously locked)" }
})