import { createError, defineEventHandler, readBody } from "h3"
import argon2 from 'argon2'


export default defineEventHandler(async event => {
  const body =  await readBody(event);

  const {username , password} = body
  

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'Missing username or password' })
  }

  try {
    // Hash the password using Argon2id (recommended)
    const hash = await argon2.hash(password, {
      type: argon2.argon2id
    })

    // TODO: Save `username` and `hash` to your database
    return { message: 'User registered successfully' }
  } catch (err) {
    console.error(err)
    throw createError({ statusCode: 500, message: 'Error hashing password' })
  }
})
