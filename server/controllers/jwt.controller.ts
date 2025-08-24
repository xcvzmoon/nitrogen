import { JWTRepository } from '../repositories/jwt.repository';
import { JWTService } from '../services/jwt.service';
import { v7 as uuidv7 } from 'uuid';
import { createError } from 'h3';

type Subject = 'user' | 'other';

interface IJWTController {
  generateToken: (subject: Subject) => Promise<string>;
  validateToken: (token: string) => Promise<boolean>;
}

const jwtRepository = new JWTRepository();
const jwtService = new JWTService(
  {
    issuer: 'http://localhost:3000',
    audience: 'http://localhost:3000',
  },
  jwtRepository,
);

export class JWTController implements IJWTController {
  async generateToken(subject: Subject): Promise<string> {
    try {
      const id = uuidv7();
      const description = subject === 'user' ? 'UserService' : 'OtherService';
      const payload: Record<string, any> = { id, description };
      return await jwtService.createToken(subject, payload);
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Failed to generate token',
        cause: error,
      });
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await jwtService.verifyToken(token);
      return true;
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Your token is invalid',
        cause: error,
      });
    }
  }
}
