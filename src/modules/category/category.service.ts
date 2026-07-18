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

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const updateCategory = async (categoryId: string, payload: CreateCategory) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  const slug = createSlug(payload.name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      slug,
    },
  });

  if (existingCategory) {
    throw new AppError(
      status.CONFLICT,
      "Category already exists with that name",
    );
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: payload.name,
      slug,
    },
  });
};


export const categoryService = {
    createCategory,
    getAllCategories,
    updateCategory,
};

