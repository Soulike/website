import {sha512} from './Crypto.js';

export function randomString(length = 11) {
  if (length <= 0) {
    throw new Error('The length of the string must be positive');
  }
  const charArray: string[] = [];
  const generateTime = Math.floor(length / 5);
  for (let i = 0; i < generateTime; i++) {
    charArray.push(...Math.random().toString(32).slice(-5));
  }
  const rearLength = length - 5 * generateTime;
  charArray.push(
    ...Math.random()
      .toString(32)
      .slice(2, 2 + rearLength),
  );
  return charArray.join('');
}

/**
 * @description 使用用户名作为盐，拼接密码计算 SHA512 散列得到实际存储的密码
 * */
export function getSaltedPassword(username: string, password: string): string {
  return sha512(username + password);
}
