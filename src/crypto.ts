import { MCrypt } from 'mcrypt';
import { createHash } from 'crypto';

export const rijndael256ecb = (data: string, secret: string): string => {
  const cipher = new MCrypt('rijndael-256', 'ecb');
  cipher.validateKeySize(false);
  cipher.open(secret);
  return cipher.encrypt(data).toString('base64');
};

export const sha256 = (data: string): string => {
  return createHash('sha256')
    .update(data)
    .digest('hex');
};

export const base64encode = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

export const md5 = (data: string): string => {
  return createHash('md5')
    .update(data)
    .digest('hex');
};
