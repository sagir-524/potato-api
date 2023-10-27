import bcrypt from 'bcrypt';

export const hash = (str: string, rounds = 10): Promise<string> => {
  return bcrypt.hash(str, rounds)
}