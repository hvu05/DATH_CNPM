import { randomInt } from 'crypto';

export const generateOTP = (length: number = 6): string => {
  return Array.from({ length }, () => randomInt(0, 10)).join('');
};
