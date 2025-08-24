import { createError, defineEventHandler, readValidatedBody } from 'h3';
import { JWTController } from '../../../controllers/jwt.controller';

import * as z from 'zod';

export default defineEventHandler(async (event) => {
  const parsed = await readValidatedBody(event, (body) => {
    return z.object({ token: z.jwt() }).safeParse(body);
  });

  if (parsed.error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid request body',
      cause: parsed.error,
    });
  }

  const controller = new JWTController();
  await controller.validateToken(parsed.data.token);

  return { message: `Your token is valid` };
});
