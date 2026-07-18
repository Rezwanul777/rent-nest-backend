import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { CreateCategory } from "./category.validate";
import createSlug from "../../utils/slug";


const createCategory = async (payload: CreateCategory) => {
  const slug = createSlug(payload.name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      slug,
    }
  });

  if (existingCategory) {
    throw new AppError(status.CONFLICT, "Category already exists");
  }

  return prisma.category.create({
    data: {
      name: payload.name,
      slug,
    },
  });
};


export const categoryService = {
    createCategory,
}
