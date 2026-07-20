import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { propertyService } from "./property.service";
import httpStatus from 'http-status';
const createProperty = catchAsync(async (req, res) => {
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
const getPropertyById = catchAsync(async (req, res) => {
    const property = await propertyService.getPropertyById(req.params.propertyId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property retreived successfully",
        data: property,
    });
});
const getMyPropertyById = catchAsync(async (req, res) => {
    const landlordId = req.user?.id;
    const propertyId = req.params.propertyId;
    const property = await propertyService.getMyPropertyById(propertyId, landlordId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property retrieved successfully",
        data: property,
    });
});
const updateProperty = catchAsync(async (req, res) => {
    const landlordId = req.user?.id;
    const propertyId = req.params.propertyId;
    const updatedListing = await propertyService.updateProperty(propertyId, landlordId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property updated successfully",
        data: updatedListing,
    });
});
const updatePropertyAvailability = catchAsync(async (req, res) => {
    const landlordId = req.user?.id;
    const propertyId = req.params.propertyId;
    const propertyStatus = await propertyService.updatePropertyAvailability(propertyId, landlordId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Property status updated to ${propertyStatus.isAvailable} successfully`,
    });
});
const getMyProperties = catchAsync(async (req, res) => {
    const { meta, listings } = await propertyService.listProperties(req.query, {
        type: "LANDLORD",
        landlordId: req.user?.id,
    });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Properties retreived successfully",
        data: { listings, meta },
    });
});
const getProperties = catchAsync(async (req, res) => {
    const scope = req.user?.role === "ADMIN" ? { type: "ADMIN" } : { type: "PUBLIC" };
    const { meta, listings } = await propertyService.listProperties(req.query, scope);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Properties retreived successfully",
        data: { listings, meta },
    });
});
export const propertyController = {
    createProperty,
    getPropertyById,
    getMyPropertyById,
    updateProperty,
    updatePropertyAvailability,
    getMyProperties,
    getProperties,
};
//# sourceMappingURL=property.controller.js.map