import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { Pkce } from '../model/pkce.model';

const BASIC_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const EXTENDED_CHARSET = BASIC_CHARSET + '-._~';
@Injectable()
export class CodeVerifierService {
  constructor() {}

  private base64URL(stream: any): string {
    return stream
      .toString(Base64)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private generateChallenge(code: string): string {
    return this.base64URL(sha256(code));
  }

  private bufferToString(buffer: Uint8Array): string {
    const state = [];
    for (let i = 0; i < buffer.byteLength; i += 1) {
      const index = buffer[i] % BASIC_CHARSET.length;
      state.push(BASIC_CHARSET[index]);
    }
    return state.join('');
  }

  private generateRandom(size: number): string {
    const buffer = new Uint8Array(size);
    if (typeof window !== 'undefined' && !!window.crypto) {
      window.crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < size; i += 1) {
        buffer[i] = (Math.random() * EXTENDED_CHARSET.length) | 0;
      }
    }
    return this.bufferToString(buffer);
  }

  /**
   * @returns Pkce structure with verifier of 128 characters and code challenge strings
   */
  getCodeChallenge(): Pkce {
    const verifier = this.generateRandom(128);
    const codeChallenge: Pkce = {
      verifier,
      challenge: this.generateChallenge(verifier)
    };
    return codeChallenge;
  }
}
