import { createError, defineEventHandler, readBody } from "h3"
import argon2 from 'argon2'



export default defineEventHandler(async event => {
  
  const body =  await readBody(event);

  const prisma = GetDB();

  const {username , password, neuro} = body
  

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'Missing username or password' })
  }

  try {
    // Hash the password using Argon2id 
    const hash = await argon2.hash(password, {
      type: argon2.argon2id
    })

    let finalNeuro: boolean | null = (String(neuro).toLowerCase() === 'true');

    if (neuro == 'prefer-not-to-say') {
      finalNeuro = null; // or you can choose to set it to false, depending on your application's needs
    }

    // Run inside `async` function
    await prisma.users.create({
      data: {
        username: username,
        password: hash,
        neuro: finalNeuro
      },
    })

  
    return { message: 'User registered successfully' }
  } catch (err) {
    console.error(err)
    throw createError({ statusCode: 500, message: 'Error hashing password' })
  }
})
