import { defineEventHandler, readBody, createError } from "h3"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user?.role !== "SUPERADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  const body = await readBody(event)
  const { userIds } = body

  if (!Array.isArray(userIds)) {
    throw createError({ statusCode: 400, statusMessage: "userIds must be an array" })
  }

  const prisma = GetDB()
  
  // Create phase for each user
  const results = await Promise.all(userIds.map(async (uid: string) => {
    const user_id = BigInt(uid)
    
    // Check if there's already an active phase
    const latestPhase = await prisma.phases.findFirst({
      where: { user_id },
      orderBy: { created_at: 'desc' }
    })

    if (latestPhase && !latestPhase.completed) {
      return { user_id: uid, success: false, error: "User already has an active phase" }
    }

    await prisma.phases.create({
      data: {
        user_id,
        completed: false
      }
    })
    return { user_id: uid, success: true }
  }))

  return { success: true, results }
})