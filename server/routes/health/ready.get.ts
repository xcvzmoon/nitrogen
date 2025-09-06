import { createError, defineEventHandler } from 'h3';
import { db } from '~/database';

export default defineEventHandler(async () => {
  try {
    await db.execute(`SELECT 1`);

    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'Database connection failed',
    });
  }
});
