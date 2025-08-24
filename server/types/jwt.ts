export type JWTPayload = {
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  nbf?: number;
  jti: string;
  [key: string]: any;
};

export type JWTHeader = {
  alg: string;
  typ: string;
  kid: string;
};

export type KeyPair = {
  private: string;
  public: string;
  algorithm: 'RS256' | 'ES256';
};

export type JWTServiceConfig = {
  issuer: string;
  audience: string;
  duration?: number;
  algorithm?: 'RS256' | 'ES256';
  keyRotationEnabled?: boolean;
};

export type TokenValidationOptions = {
  audience?: string;
  issuer?: string;
  ignoreExpiration?: boolean;
  clockTolerance?: number;
};
