import { UserRole } from "../../generated/prisma/enums";
import { AuthenticatedUser } from "../../types/AuthenticatedUser";
import sendResponse from "../../utils/sendResponse";
import { Scope } from "./rental-agreement.query";
import  httpStatus  from 'http-status';
import { rentalAgreementService } from "./rental-agreement.service";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";

function getRentalAgreementScope(user: AuthenticatedUser): Scope {
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


const getRentalAgreements = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error("Authentication required");
  }

  const scope = getRentalAgreementScope(user);

  const { meta, agreements } =
    await rentalAgreementService.listRentalAgreements(req.query, scope);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Rental agreements retreived successfully`,
    
    data: { meta, agreements },
  });
});

const updateRentalAgreementStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error("Authentication required");
  }

  const updatedData = await rentalAgreementService.updateRentalAgreementStatus(
    user.id as string,
    req.params.agreementId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode:httpStatus.OK,
    success: true,
    message: `Rental agreement status updated to ${updatedData.status} successfully`,
  });
});


export const rentalAgreementcontroller = {
  getRentalAgreements,
  updateRentalAgreementStatus,
};