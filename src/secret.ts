import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const PORT = process.env.PORT;
export const EXPIRES_IN = process.env.EXPIRES_IN;
export const JWT_SECRET = process.env.JWT_SECRET;
