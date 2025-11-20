import jwt from 'jsonwebtoken';
import { defineEventHandler, getHeader, setResponseStatus } from 'h3';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'YOUR_SUPER_SECRET_KEY';

export default defineEventHandler(async (event) => {
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
  ];

  // Check if the current route is public. If so, skip middleware.
  const url = event.node.req.url;
  if (url && publicRoutes.some(route => url.startsWith(route))) {
    return;
  }


  const authHeader = getHeader(event, 'Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  else {

  // The token is the part after "Bearer "
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