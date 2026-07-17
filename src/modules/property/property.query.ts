import { PropertyWhereInput } from "../../generated/prisma/models";
import { GetPropertiesQuery } from "./property.interface";

const SORTABLE_FIELDS = ["createdAt", "rent", "title", "updatedAt"] as const;

const SORT_ORDERS = ["asc", "desc"] as const;

export const buildPropertySorting = (query: GetPropertiesQuery) => {
  const sortBy =
    query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
      ? query.sortBy
      : "createdAt";

  const sortOrder =
    query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
      ? query.sortOrder
      : "desc";

  return {
    sortBy,
    sortOrder,
  };
};


export type Scope =
  | {
      type: "PUBLIC";
    }
  | {
      type: "LANDLORD";
      landlordId: string;
    }
  | {
      type: "ADMIN";
    };

export const buildPropertyFilters = (
  query: GetPropertiesQuery,
  scope: Scope,
) => {
  const { categoryId, isAvailable, location, search, minRent, maxRent } = query;

  const andCondition: PropertyWhereInput[] = [];

  switch (scope.type) {
    case "PUBLIC":
      andCondition.push({
        isAvailable: true,
      });
      break;

    case "LANDLORD":
      andCondition.push({
        landlordId: scope.landlordId,
      });
      break;
  }

  if (categoryId) {
    andCondition.push({
      categoryId,
    });
  }

  if (scope.type !== "PUBLIC" && typeof isAvailable !== "undefined") {
    andCondition.push({ isAvailable: isAvailable === "true" ? true : false });
  }

  if (location) {
    andCondition.push({
      location: {
        contains: location,
        mode: "insensitive",
      },
    });
  }

  if (minRent) {
    andCondition.push({
      rent: {
        gte: Number(minRent),
      },
    });
  }

  if (maxRent) {
    andCondition.push({
      rent: {
        lte: Number(maxRent),
      },
    });
  }

  if (search) {
    andCondition.push({
      OR: [
        {
          location: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  return andCondition;
};