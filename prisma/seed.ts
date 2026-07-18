import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { UserRole } from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin-nest@123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "ayaan.bin@gmail.com",
    },

    update: {
      role: UserRole.ADMIN,
      isActive: true,
      password: hashedPassword,
    },

    create: {
      name: "Ayaan Bin",
      email: "ayaan.bin@gmail.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },

    omit: {
      password: true,
    },
  });

  console.log("Admin created successfully:", admin);
};

createAdmin()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });