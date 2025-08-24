import { createError, defineEventHandler, readValidatedBody } from 'h3';
import { JWTController } from '../../../controllers/jwt.controller';

import * as z from 'zod';

export default defineEventHandler(async (event) => {
  const parsed = await readValidatedBody(event, (body) => {
    return z.object({ type: z.literal(['user', 'other']) }).safeParse(body);
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
  const token = await controller.generateToken(parsed.data.type);

  return { token };
});
