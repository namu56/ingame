import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRounds: number): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};
