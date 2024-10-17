import * as bcrypt from 'bcrypt';

export const compareValue = async (value: string, hashedValue: string): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue);
};
