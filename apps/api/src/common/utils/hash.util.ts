import * as argon2 from 'argon2';

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 1 << 16, // 64 MB
  timeCost: 3, // 3 iterations
  hashLength: 32, // 32 bytes
};

export async function hash(value: string): Promise<string> {
  return argon2.hash(value, ARGON2_OPTIONS);
}

export async function verify(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch (err) {
    return false;
  }
}
