import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async event => {
  const body =  await readBody(event);

  const { username, password } = body;

  return {
    "username":username,
    "password":password
  }
})
