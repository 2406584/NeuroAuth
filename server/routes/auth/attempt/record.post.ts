import { createError, eventHandler, readBody } from "h3"

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { user_id } = body

    if (!user_id) {
      throw createError({
        statusCode: 400,
        statusMessage: "User ID is required to log a metric"
      })
    }

    const prisma = GetDB();

    const newMetric = await prisma.UsersLogin.create({
      data: {
        user_id: user_id,
        attempt: 1,
        success: false
      }
    })

    return {
      success: true,
      message: "Metric recorded successfully",
    }

  } catch (error: any) {
    // If Prisma fails (e.g., database connection down)
    console.error("Metric Storage Error:", error)
    
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to store metric"
    })
  }
});