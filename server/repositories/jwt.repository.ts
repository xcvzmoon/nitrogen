import type { KeyPair } from '../types/jwt';

import fs from 'fs';
import path from 'path';

interface IJWTRepository {
  insertKeyPair: (id: string, pair: KeyPair) => Promise<void>;
  readKeyPairs: () => Promise<Map<string, KeyPair>>;
  deleteKeyPair: (id: string) => Promise<void>;
}

export class JWTRepository implements IJWTRepository {
  #pathToKeys = path.join(process.cwd(), 'keys');

  private _getPaths(id: string) {
    return {
      private: path.join(this.#pathToKeys, `${id}.key`),
      public: path.join(this.#pathToKeys, `${id}.pub`),
    };
  }

  async insertKeyPair(id: string, pair: KeyPair): Promise<void> {
    if (!fs.existsSync(this.#pathToKeys)) {
      fs.mkdirSync(this.#pathToKeys, { recursive: true });
    }

    const paths = this._getPaths(id);

    fs.writeFileSync(paths.private, pair.private, { mode: 0o600 });
    fs.writeFileSync(paths.public, pair.public, { mode: 0o644 });
  }

  async readKeyPairs(): Promise<Map<string, KeyPair>> {
    if (!fs.existsSync(this.#pathToKeys)) {
      return new Map();
    }

    const files = fs.readdirSync(this.#pathToKeys).filter((f) => f.endsWith('.key'));
    const keyPairs = new Map<string, KeyPair>();

    for (const file of files) {
      const keyId = file.replace('.key', '');
      const paths = this._getPaths(keyId);

      if (fs.existsSync(paths.private) && fs.existsSync(paths.public)) {
        keyPairs.set(keyId, {
          private: fs.readFileSync(paths.private, 'utf8'),
          public: fs.readFileSync(paths.public, 'utf8'),
          algorithm: 'RS256',
        });
      }
    }

    return keyPairs;
  }

  async deleteKeyPair(id: string): Promise<void> {
    const paths = this._getPaths(id);

    if (fs.existsSync(paths.private)) fs.unlinkSync(paths.private);
    if (fs.existsSync(paths.public)) fs.unlinkSync(paths.public);
  }
}
