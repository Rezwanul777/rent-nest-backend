import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { CreatePropertyPayload } from "./property.validation";
import  httpStatus  from 'http-status';

const createProperty = async (
  landlordId: string,
  payload: CreatePropertyPayload,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  return prisma.property.create({
    data: {
      landlordId,
      ...payload,
    },
  });
};


export const propertyService = {

  createProperty,
  
};
