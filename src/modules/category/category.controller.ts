import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const categoryController = {
  createCategory,
};