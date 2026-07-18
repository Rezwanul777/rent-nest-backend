import status from "http-status";
import { UserRole } from "../../generated/prisma/enums";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Scope } from "./rental-request.query";
import { rentalRequestService } from "./rental-request.service";
import { AuthenticatedUser } from "../../types/AuthenticatedUser";

const submitRentalRequest = catchAsync(async (req, res) => {
  const rentalData = await rentalRequestService.submitRentalRequest(
    req.user?.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Rental request submitted successfully",
    data: rentalData,
  });
});

const getRentalRequests = catchAsync(async (req, res) => {
  const scope = getRentalRequestScope(req.user as AuthenticatedUser);

  const { meta, requests } = await rentalRequestService.listRentalRequests(
    req.query,
    scope,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Rental requests retreived successfully",
    data: { meta, requests },
  
  });
});

const updateRentalRequestStatus = catchAsync(async (req, res) => {
  const landlordId = req.user?.id as string;

  const updatedStatus = await rentalRequestService.updateRentalRequestStatus(
    landlordId,
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Rental requests status updated to ${updatedStatus} successfully`,
  });
});

function getRentalRequestScope(user: AuthenticatedUser): Scope {
  switch (user.role) {
    case UserRole.TENANT:
      return {
        type: "TENANT",
        tenantId: user.id,
      };

    case UserRole.LANDLORD:
      return {
        type: "LANDLORD",
        landlordId: user.id,
      };

    case UserRole.ADMIN:
      return {
        type: "ADMIN",
      };
  }
}

export const rentalRequestController = {
  updateRentalRequestStatus,
  submitRentalRequest,
  getRentalRequests,
};