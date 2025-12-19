import {hash, sha512} from '../Crypto.js';
import {randomString} from '../Util.js';

describe('sha512', () => {
  it('should calculate sha512', function () {
    const str = randomString(20);
    expect(sha512(str)).toBe(hash('sha512', str, 'utf8', 'hex'));
  });
});
