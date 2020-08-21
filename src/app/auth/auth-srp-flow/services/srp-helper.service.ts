import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js/core';
import SHA256 from 'crypto-js/sha256';
import { Observable } from 'rxjs';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import { AuthenticationData } from '../model/authentication-data.model';
import 'crypto-js/lib-typedarrays';
import { environment } from '../../../../environments';
import { InitiateLoginChallengeParameters } from '../model/initiate-login-challenge-parameters.model';
var bigInt = require('big-integer');
var Buffer = require('buffer').Buffer;

@Injectable({
  providedIn: 'root'
})
export class SrpHelperService {
  poolName = environment.Auth.srpFlow.userPoolId.split('_')[1];
  N: any;
  g: any;
  k: any;
  smallAValue: any;
  largeAValue: any;
  cryptoError: string;
  infoBits: Buffer;
  largeAObs: Observable<any>;

  initN =
    'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1' +
    '29024E088A67CC74020BBEA63B139B22514A08798E3404DD' +
    'EF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245' +
    'E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED' +
    'EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3D' +
    'C2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F' +
    '83655D23DCA3AD961C62F356208552BB9ED529077096966D' +
    '670C354E4ABC9804F1746C08CA18217C32905E462E36CE3B' +
    'E39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9' +
    'DE2BCBF6955817183995497CEA956AE515D2261898FA0510' +
    '15728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64' +
    'ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7' +
    'ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6B' +
    'F12FFA06D98A0864D87602733EC86A64521F2B18177B200C' +
    'BBE117577A615D6C770988C0BAD946E208E24FA074E5AB31' +
    '43DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF';

  constructor() {
    this.N = bigInt(this.initN, 16);
    this.g = bigInt('2', 16);
    this.k = bigInt(
      this.hexHash(
        `00${(this.N as any).toString(16)}0${(this.g as any).toString(16)}`
      ),
      16
    );
    this.smallAValue = this.generateRandomSmallA();
    this.largeAValue = this.calculateA(this.smallAValue);
    this.infoBits = Buffer.from('Caldera Derived Key', 'utf8');
  }

  /**
   * Calculate a hash from a bitArray
   * @param {Buffer} buf Value to hash.
   * @returns {String} Hex-encoded hash.
   * @private
   */
  private hash(buf: Buffer): string {
    const str =
      buf instanceof Buffer ? CryptoJS.lib.WordArray.create(buf) : buf;
    const hashHex = SHA256(str as any).toString();

    return new Array(64 - hashHex.length).join('0') + hashHex;
  }

  /**
   * Calculate a hash from a hex string
   * @param {String} hexStr Value to hash.
   * @returns {String} Hex-encoded hash.
   * @private
   */
  private hexHash(hexStr: string): string {
    return this.hash(Buffer.from(hexStr, 'hex'));
  }

  private generateRandomSmallA(): any {
    const hexRandom = this.randomBytes(128).toString('hex');

    const randomBigInt = bigInt(hexRandom, 16);
    const smallBI = randomBigInt.mod(this.N);

    return smallBI;
  }

  private randomBytes(nBytes): Buffer {
    return Buffer.from(CryptoJS.lib.WordArray.random(nBytes).toString(), 'hex');
  }

  private calculateA(a: any): bigint {
    const largeA = bigInt(this.g).modPow(a, this.N);
    if (largeA.mod(this.N).equals(bigInt.zero)) {
      throw new Error('Illegal parameter. A mod N cannot be 0.');
    }
    return largeA;
  }

  getPasswordAuthenticationKey(
    challengeUsername: string,
    password: string,
    challengeSrpB: string,
    challengeSalt: string
  ): Buffer {
    let serverB = bigInt(challengeSrpB, 16);
    let salt = bigInt(challengeSalt, 16);

    if (serverB.mod(this.N).equals(bigInt.zero)) {
      throw Error('B cannot be zero.');
    }

    let UValue = this.calculateU(this.largeAValue, serverB);

    if (UValue.equals(bigInt.zero)) {
      throw new Error('U cannot be zero.');
    }

    const usernamePassword = `${this.poolName}${challengeUsername}:${password}`;
    const usernamePasswordHash = this.hash(usernamePassword as any);

    const xValue = bigInt(
      this.hexHash(this.padHex(salt) + usernamePasswordHash),
      16
    );

    const sValue = this.calculateS(xValue, serverB, UValue);
    const hkdf = this.computeHkdf(sValue, UValue);
    return hkdf;
  }

  getSignatureString(
    hkdf: Buffer,
    challengeUserName: string,
    challengeSecretBlock: string,
    nowTimeStamp: string
  ): string {
    const messageContent = Buffer.concat([
      Buffer.from(this.poolName, 'utf8'),
      Buffer.from(challengeUserName, 'utf8'),
      Buffer.from(challengeSecretBlock, 'base64'),
      Buffer.from(nowTimeStamp, 'utf8')
    ]);
    const message = CryptoJS.lib.WordArray.create(messageContent);

    const key = CryptoJS.lib.WordArray.create(hkdf);
    const hmacShaResult = HmacSHA256(message, key);
    return Base64.stringify(HmacSHA256(message, key));
  }

  /**
   * Calculate the client's value U which is the hash of A and B
   * @param {BigInteger} A Large A value.
   * @param {BigInteger} B Server B value.
   * @returns {BigInteger} Computed U value.
   * @private
   */
  private calculateU(A, B) {
    const UHexHash = this.hexHash(this.padHex(A) + this.padHex(B));
    const finalU = bigInt(UHexHash, 16);

    return finalU;
  }

  /**
   * Converts a BigInteger (or hex string) to hex format padded with zeroes for hashing
   * @param {BigInteger|String} bigInt Number or string to pad.
   * @returns {String} Padded hex string.
   */
  private padHex(bigInt) {
    let hashStr = bigInt.toString(16);
    if (hashStr.length % 2 === 1) {
      hashStr = `0${hashStr}`;
    } else if ('89ABCDEFabcdef'.indexOf(hashStr[0]) !== -1) {
      hashStr = `00${hashStr}`;
    }
    return hashStr;
  }

  /**
   * Calculates the S value used in getPasswordAuthenticationKey
   * @param {BigInteger} xValue Salted password hash value.
   * @param {BigInteger} serverBValue Server B value.
   * @returns {void}
   */
  private calculateS(xValue, serverBValue, UValue) {
    const gModPowXN = bigInt(this.g).modPow(xValue, this.N);
    const intValue2 = serverBValue.subtract(this.k.multiply(gModPowXN));
    const intV2ModPow = bigInt(intValue2).modPow(
      this.smallAValue.add(UValue.multiply(xValue)),
      this.N
    );
    return intV2ModPow.mod(this.N);
  }

  private computeHkdf(sValue, UValue): Buffer {
    const inputKeyMaterial = Buffer.from(this.padHex(sValue), 'hex');
    const saltMaterial = Buffer.from(this.padHex(UValue.toString(16)), 'hex');

    const infoBitsWordArray = CryptoJS.lib.WordArray.create(
      Buffer.concat([
        this.infoBits,
        Buffer.from(String.fromCharCode(1), 'utf8')
      ])
    );
    const ikmWordArray = //inputKeyMaterial;
      inputKeyMaterial instanceof Buffer
        ? CryptoJS.lib.WordArray.create(inputKeyMaterial)
        : inputKeyMaterial;
    const saltWordArray = //salt;
      saltMaterial instanceof Buffer
        ? CryptoJS.lib.WordArray.create(saltMaterial)
        : saltMaterial;

    const prk = HmacSHA256(ikmWordArray, saltWordArray);
    const hmac = HmacSHA256(infoBitsWordArray, prk);

    return Buffer.from(hmac.toString(), 'hex').slice(0, 16);
  }

  getSignature(
    challengeParameters: InitiateLoginChallengeParameters,
    authData: AuthenticationData,
    dateNow: string
  ): string {
    const serverBValue = bigInt(challengeParameters.SRP_B, 16);
    const salt = bigInt(challengeParameters.SALT, 16);

    if (serverBValue.mod(this.N).equals(bigInt.zero)) {
      throw new Error('B cannot be zero.');
    }

    const UValue = this.calculateU(this.largeAValue, serverBValue);

    if (UValue.equals(bigInt.zero)) {
      throw new Error('U cannot be zero.');
    }

    const usernamePassword = `${this.poolName}${challengeParameters.USER_ID_FOR_SRP}:${authData.password}`;
    const usernamePasswordHAsh = this.hash(usernamePassword as any);

    const xValue = bigInt(
      this.hexHash(this.padHex(salt) + usernamePasswordHAsh),
      16
    );
    const sValue = this.calculateS(xValue, serverBValue, UValue);

    const hkdf = this.computeHkdf(sValue, UValue);

    const message = CryptoJS.lib.WordArray.create(
      Buffer.concat([
        Buffer.from(this.poolName, 'utf8'),
        Buffer.from(challengeParameters.USER_ID_FOR_SRP, 'utf8'),
        Buffer.from(challengeParameters.SECRET_BLOCK, 'base64'),
        Buffer.from(dateNow, 'utf8')
      ])
    );
    let key = CryptoJS.lib.WordArray.create(hkdf);
    let formattedKey = key;
    formattedKey.words = Array.from(key.words);
    let test = HmacSHA256(message, formattedKey);
    const signatureString = Base64.stringify(test);
    return signatureString;
  }

  hashPayload(payload: any): string {
    const hash = CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
    return hash;
  }

  hmacSha256AsBytes(toSign, key) {
    return CryptoJS.HmacSHA256(key, toSign, { asBytes: true });
  }

  keyedHash256(key: any, payload: any) {
    return CryptoJS.HmacSHA256(key, payload, { asBytes: true });
  }

  hexKeyedHash256(key, payload) {
    const hash = this.keyedHash256(key, payload).toString();
    return hash;
  }

  /**
   * Converts a Uint8Array to a word array.
   *
   * @param {string} u8Str The Uint8Array.
   *
   * @return {WordArray} The word array.
   *
   * @static
   *
   * @example
   *
   *     var wordArray = CryptoJS.enc.u8array.parse(u8arr);
   */
  digestUint8Array(u8arr) {
    var len = u8arr.length;

    // Convert
    var words = [];
    for (var i = 0; i < len; i++) {
      words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }

    return (CryptoJS.lib.WordArray as any).create(words, len);
  }

  /**
   * Converts a word array to a Uint8Array.
   *
   * @param {WordArray} wordArray The word array.
   *
   * @return {Uint8Array} The Uint8Array.
   *
   * @static
   *
   * @example
   *
   *     var u8arr = CryptoJS.enc.u8array.stringify(wordArray);
   */
  digestWordArray(wordArray) {
    // Shortcuts
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;

    // Convert
    var u8 = new Uint8Array(sigBytes);
    for (var i = 0; i < sigBytes; i++) {
      var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      u8[i] = byte;
    }

    return u8;
  }
}
