import crypto, {type BinaryToTextEncoding, type Encoding} from 'crypto';

export function sha512(data: string): string {
  return hash('sha512', data, 'utf8', 'hex');
}

export function hash(
  algorithm: string,
  data: string,
  inputEncoding: Encoding = 'utf8',
  encoding: BinaryToTextEncoding,
) {
  const hash = crypto.createHash(algorithm);
  hash.update(data, inputEncoding);
  return hash.digest(encoding);
}
