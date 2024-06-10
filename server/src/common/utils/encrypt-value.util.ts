import * as bcrypt from 'bcrypt';

export const encryptValue = async (value: string, saltRounds: number): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(value, salt);
};
