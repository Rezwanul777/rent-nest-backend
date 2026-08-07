export type GetPropertiesQuery = {
  page?: string;
  limit?: string;

  sortBy?:
    | "title"
    | "rent"
    | "createdAt"
    | "updatedAt";

  sortOrder?: "asc" | "desc";

  location?: string;

  isAvailable?: "true" | "false";

  categoryId?: string;

  minRent?: string;

  maxRent?: string;

  search?: string;

  amenities?: string | string[];
};
