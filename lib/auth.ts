import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { UserWithoutPassword } from "./models/user";

if (!process.env.JWT_SECRET) {
  throw new Error("Please add your JWT_SECRET to .env.local");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(
  user: UserWithoutPassword
): Promise<string> {
  return await new SignJWT({
    userId: user._id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
