import type {
  JWTHeader,
  JWTPayload,
  JWTServiceConfig,
  KeyPair,
  TokenValidationOptions,
} from '../types/jwt';

import { v7 as uuidv7 } from 'uuid';
import { JWTRepository } from '../repositories/jwt.repository';

import consola from 'consola';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface IJWTService {
  createToken: (
    subject: string,
    customPayload?: Record<string, any>,
    expiresIn?: number,
  ) => Promise<string>;
  verifyToken: (token: string, options?: TokenValidationOptions) => Promise<JWTPayload>;
  getKeys: () => Record<string, { kty: string; alg: string; use: string; key: string }>;
  rotateKeys: () => Promise<string>;
  removeKey: (id: string) => Promise<void>;
}

class JWTService implements IJWTService {
  #keyPairs: Map<string, KeyPair> = new Map();
  #currentKeyId: string;
  #config: Required<JWTServiceConfig>;
  #jwtRepository: JWTRepository;

  constructor(config: JWTServiceConfig, jwtRepository: JWTRepository) {
    this.#config = {
      duration: 900,
      algorithm: 'RS256',
      keyRotationEnabled: true,
      ...config,
    };

    this.#jwtRepository = jwtRepository;
    this.#currentKeyId = this._generateKeyId();
    this._initializeKeys();
  }

  private async _generateNewKeyPair(): Promise<string> {
    const id = this._generateKeyId();
    let keyPair: KeyPair;

    if (this.#config.algorithm === 'ES256') {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      keyPair = { private: privateKey, public: publicKey, algorithm: 'ES256' };
    } else {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      keyPair = { private: privateKey, public: publicKey, algorithm: 'RS256' };
    }

    this.#keyPairs.set(id, keyPair);
    this.#currentKeyId = id;
    await this.#jwtRepository.insertKeyPair(id, keyPair);

    return id;
  }

  private async _initializeKeys(): Promise<void> {
    this.#keyPairs = await this.#jwtRepository.readKeyPairs();

    if (this.#keyPairs.size === 0) {
      consola.warn('No keys found, generating new one...');
      await this._generateNewKeyPair();
      consola.success('New key pair generated successfully');
      consola.info('Current key ID set to:', this.#currentKeyId);
    } else {
      const keyIds = Array.from(this.#keyPairs.keys()).sort();
      this.#currentKeyId = keyIds[keyIds.length - 1];
      consola.info('Current key ID set to:', this.#currentKeyId);
    }
  }

  private _generateKeyId(): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    const random = crypto.randomBytes(4).toString('hex');
    return `key-${timestamp}-${random}`;
  }

  private _generateJTI(): string {
    return uuidv7();
  }

  async createToken(subject: string, customPayload: Record<string, any> = {}, expiresIn?: number) {
    if (!this.#currentKeyId || !this.#keyPairs.has(this.#currentKeyId)) {
      throw new JWTError('No signing key available', 'NO_SIGNING_KEY', 500);
    }

    const now = Math.floor(Date.now() / 1000);
    const exp = expiresIn || this.#config.duration;
    const payload: JWTPayload = {
      sub: subject,
      iss: this.#config.issuer,
      aud: this.#config.audience,
      iat: now,
      nbf: now,
      exp: now + exp,
      jti: this._generateJTI(),
      ...customPayload,
    };
    const keyPair = this.#keyPairs.get(this.#currentKeyId)!;

    return jwt.sign(payload, keyPair.private, {
      algorithm: keyPair.algorithm,
      keyid: this.#currentKeyId,
    });
  }

  async verifyToken(token: string, options: TokenValidationOptions = {}): Promise<JWTPayload> {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header) throw new JWTError('Invalid token format', 'INVALID_FORMAT');

    const { kid } = decoded.header as JWTHeader;
    if (!kid || !this.#keyPairs.has(kid)) throw new JWTError('Unknown signing key', 'UNKNOWN_KEY');

    const keyPair = this.#keyPairs.get(kid)!;
    return jwt.verify(token, keyPair.public, {
      algorithms: [keyPair.algorithm],
      audience: options.audience || this.#config.audience,
      issuer: options.issuer || this.#config.issuer,
      ignoreExpiration: options.ignoreExpiration || false,
      clockTolerance: options.clockTolerance || 0,
    }) as JWTPayload;
  }

  public getKeys(): Record<string, { kty: string; alg: string; use: string; key: string }> {
    const jwks: Record<string, any> = {};

    for (const [keyId, keyPair] of this.#keyPairs.entries()) {
      jwks[keyId] = {
        kty: keyPair.algorithm === 'RS256' ? 'RSA' : 'EC',
        alg: keyPair.algorithm,
        use: 'sig',
        key: keyPair.public,
      };
    }

    return jwks;
  }

  async rotateKeys(): Promise<string> {
    if (!this.#config.keyRotationEnabled) {
      throw new JWTError('Key rotation disabled', 'ROTATION_DISABLED', 403);
    }

    return this._generateNewKeyPair();
  }

  async removeKey(id: string): Promise<void> {
    if (id === this.#currentKeyId) {
      throw new JWTError('Cannot remove current signing key', 'CANNOT_REMOVE_CURRENT_KEY', 400);
    }

    this.#keyPairs.delete(id);
    await this.#jwtRepository.deleteKeyPair(id);
  }
}

class JWTError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401,
  ) {
    super(message);
    this.name = 'JWTError';
  }
}

export { JWTService, JWTError };
