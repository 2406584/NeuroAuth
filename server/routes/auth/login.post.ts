import { defineEventHandler, readBody, createError } from "h3"
import argon2 from "argon2"
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username and password are required"
      })
    }

    const prisma = GetDB()

    const user = await prisma.users.findFirst({
      where: { username }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials"
      })
    }

    const latestPhase = await prisma.phases.findFirst({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' }
    })

    if (user.role !== "SUPERADMIN") {
      if (!latestPhase || latestPhase.completed) {
        throw createError({
          statusCode: 403,
          statusMessage: "No active phase released yet"
        })
      }

      const failedAttempts = await prisma.usersLogin.count({
        where: {
          user_id: user.id,
          success: false,
          created_at: {
            gte: latestPhase.created_at
          }
        }
      })

      const phasesCount = await prisma.phases.count({ where: { user_id: user.id } })

      if (failedAttempts >= 3) {
        throw createError({
          statusCode: 403,
          statusMessage: "Account locked for this phase. Contact admin for a password reset."
        })
      }

      const isPasswordValid = await argon2.verify(user.password, password)

      if (!isPasswordValid) {
        const attemptNum = failedAttempts + 1
        await prisma.usersLogin.create({
          data: {
            user_id: user.id,
            attempt: attemptNum,
            success: false,
            phase: phasesCount
          }
        })

        if (attemptNum >= 3) {
          throw createError({
            statusCode: 403,
            statusMessage: "Account locked for this phase. Contact admin for a password reset."
          })
        }

        throw createError({
          statusCode: 401,
          statusMessage: "Invalid credentials"
        })
      }

      const attemptNum = failedAttempts + 1
      await prisma.usersLogin.create({
        data: {
          user_id: user.id,
          attempt: attemptNum,
          success: true,
          phase: phasesCount
        }
      })

      await prisma.phases.update({
        where: { id: latestPhase.id },
        data: { completed: true }
      })
    } else {

      const isPasswordValid = await argon2.verify(user.password, password)
      if (!isPasswordValid) {
        throw createError({
          statusCode: 401,
          statusMessage: "Invalid credentials"
        })
      }
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY    
    if (!jwtSecretKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "JWT secret key not configured"
      })
    }

    const expiresIn = user.role === "SUPERADMIN" ? "7d" : "5m"

    const token = jwt.sign(
      {
        userId: typeof user.id === "bigint" ? user.id.toString() : user.id,
        username: user.username,
        role: user.role,
        time: new Date().toISOString()
      },
      jwtSecretKey,
      { expiresIn }
    )

    const safeUser = {
      id: typeof user.id === "bigint" ? user.id.toString() : user.id,
      username: user.username,
      role: user.role
    }

    return {
      success: true,
      user: safeUser,
      token
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error("Login error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during login"
    })
  }
})