import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { propertyService } from "./property.service";
import  httpStatus  from 'http-status';

const createProperty = catchAsync(async (req:Request, res:Response) => {
  const landlordId = req.user?.id;

  if (!landlordId) {
    throw new Error("Landlord ID is required");
  }

  const listing = await propertyService.createProperty(landlordId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Property listing created successfully",
    data: listing,
  });
});



export const propertyController = {
  createProperty,
};