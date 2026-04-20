import jwt from 'jsonwebtoken';
import { defineEventHandler, getHeader, setResponseStatus, getMethod } from 'h3';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'SECRET_KEY';

export default defineEventHandler(async (event) => {
  if (getMethod(event) === 'OPTIONS') {
    return;
  }

  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/attempt/record'
  ];

  const url = event.node.req.url;
  if (url && publicRoutes.some(route => url.startsWith(route))) {
    return;
  }


  const authHeader = getHeader(event, 'Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  else {


  const token = authHeader.substring(7);


  try {
    const decodedPayload = jwt.verify(token, JWT_SECRET);

    event.context.user = decodedPayload;

  } catch (err) {
    setResponseStatus(event, 401);
    console.error('JWT Verification Error:', err);
    return new Response('Unauthorized', { status: 401 });
  }
  }

});