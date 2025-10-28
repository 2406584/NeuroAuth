import { defineEventHandler, readBody, createError } from "h3"
import argon2 from "argon2"
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username and password are required"
      })
    }
    const prisma = GetDB();

    // Find user by username
    const user = await prisma.users.findFirst({
      where: { 
        username: username
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials"
      })
    }

    // Verify password
    
    const isPasswordValid = await argon2.verify(user.password, password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials"
      })
    }

    // Generate JWT token
    const jwtSecretKey = process.env.JWT_SECRET_KEY    
    if (!jwtSecretKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "JWT secret key not configured"
      })
    }

    const token = jwt.sign(
      {
        userId: typeof user.id === "bigint" ? user.id.toString() : user.id,
        username: user.username,
        time: new Date().toISOString()
      },
      jwtSecretKey,
      { expiresIn: "7d" }
    )

    const safeUser = {
      id: typeof user.id === "bigint" ? user.id.toString() : user.id,
      username: user.username    
    }

    return {
      success: true,
      user: safeUser,
      token
    }

  } catch (error: any) {
    // Handle specific errors
    if (error.statusCode) {
      throw error
    }
    
    // Log unexpected errors
    console.error("Login error:", error)
    
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during login"
    })
  }
})