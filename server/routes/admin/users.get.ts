import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user?.role !== "SUPERADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  const prisma = GetDB()
  const users = await prisma.users.findMany({
    where: { role: { not: "SUPERADMIN" } },
    include: {
      Phases: {
        orderBy: { created_at: 'desc' }
      },
      login_metrics: {
        orderBy: { created_at: 'desc' }
      }
    }
  })

  const enrichedUsers = users.map(u => {
    const latestPhase = u.Phases[0]
    let failedAttempts = 0
    let locked = false
    let currentPhase = "None"
    let status = "N/A"

    if (latestPhase) {
      currentPhase = `Phase ${u.Phases.length}`
      status = latestPhase.completed ? "Completed" : "Active"
      
      if (!latestPhase.completed) {
        failedAttempts = u.login_metrics.filter(m => 
          !m.success && m.created_at >= latestPhase.created_at
        ).length
        locked = failedAttempts >= 3
      }
    }

    const loginHistory = u.login_metrics.map(m => ({
      id: typeof m.id === 'bigint' ? m.id.toString() : m.id,
      attempt: m.attempt ? Number(m.attempt) : 0,
      success: m.success,
      phase: m.phase,
      created_at: m.created_at
    }))

    return {
      id: typeof u.id === 'bigint' ? u.id.toString() : u.id,
      username: u.username,
      currentPhase,
      status,
      failedAttempts,
      locked,
      loginHistory
    }
  })

  return { success: true, users: enrichedUsers }
})