import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterPayload , LoginPayload} from "./auth.validation";
import { SignOptions } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../../utils/jwt";


const register = async (payload: RegisterPayload) => {
  const { name, email, password, role } = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email");
  }

    const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );


  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const login = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials", [
      { message: "Email or Password didn't match" },
    ]);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials", [
      { message: "Email or Password didn't match" },
    ]);
  }

  if (!user.isActive) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Account is not active. Please contact support.",
    );
  }

  const tokenPayload = {
    userId: user.id,
    role: user.role,
  };

  
 const accessToken = createAccessToken(tokenPayload);

  const refreshToken = createRefreshToken(tokenPayload);

  const userWithoutPassword = await prisma.user.findUnique({
    where: { email: payload.email },
    omit: { password: true },
  });




  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  register,
  login
  
};