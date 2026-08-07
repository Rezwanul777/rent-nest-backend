// import { PropertyWhereInput } from "../../generated/prisma/models";
// import { GetPropertiesQuery } from "./property.interface";

// const SORTABLE_FIELDS = ["createdAt", "rent", "title", "updatedAt"] as const;

// const SORT_ORDERS = ["asc", "desc"] as const;

// export const buildPropertySorting = (query: GetPropertiesQuery) => {
//   const sortBy =
//     query.sortBy && SORTABLE_FIELDS.includes(query.sortBy)
//       ? query.sortBy
//       : "createdAt";

//   const sortOrder =
//     query.sortOrder && SORT_ORDERS.includes(query.sortOrder)
//       ? query.sortOrder
//       : "desc";

//   return {
//     sortBy,
//     sortOrder,
//   };
// };


// export type Scope =
//   | {
//       type: "PUBLIC";
//     }
//   | {
//       type: "LANDLORD";
//       landlordId: string;
//     }
//   | {
//       type: "ADMIN";
//     };

// export const buildPropertyFilters = (
//   query: GetPropertiesQuery,
//   scope: Scope,
// ) => {
//   const { categoryId, isAvailable, location, search, minRent, maxRent } = query;

//   const andCondition: PropertyWhereInput[] = [];

//   switch (scope.type) {
//     case "PUBLIC":
//       andCondition.push({
//         isAvailable: true,
//       });
//       break;

//     case "LANDLORD":
//       andCondition.push({
//         landlordId: scope.landlordId,
//       });
//       break;
//   }

//   if (categoryId) {
//     andCondition.push({
//       categoryId,
//     });
//   }

//   if (scope.type !== "PUBLIC" && typeof isAvailable !== "undefined") {
//     andCondition.push({ isAvailable: isAvailable === "true" ? true : false });
//   }

//   if (location) {
//     andCondition.push({
//       location: {
//         contains: location,
//         mode: "insensitive",
//       },
//     });
//   }

//   if (minRent) {
//     andCondition.push({
//       rent: {
//         gte: Number(minRent),
//       },
//     });
//   }

//   if (maxRent) {
//     andCondition.push({
//       rent: {
//         lte: Number(maxRent),
//       },
//     });
//   }

//   if (search) {
//     andCondition.push({
//       OR: [
//         {
//           location: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           title: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           description: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           category: {
//             name: {
//               contains: search,
//               mode: "insensitive",
//             },
//           },
//         },
//       ],
//     });
//   }

//   return andCondition;
// };

import { PropertyWhereInput } from "../../generated/prisma/models";
import { GetPropertiesQuery } from "./property.interface";

/*
 * Fields that clients are allowed to use for sorting.
 */
const SORTABLE_FIELDS = [
  "createdAt",
  "rent",
  "title",
  "updatedAt",
] as const;

const SORT_ORDERS = ["asc", "desc"] as const;

/*
 * Builds safe Prisma sorting options.
 */
export const buildPropertySorting = (
  query: GetPropertiesQuery,
) => {
  const sortBy =
    query.sortBy &&
    SORTABLE_FIELDS.includes(query.sortBy)
      ? query.sortBy
      : "createdAt";

  const sortOrder =
    query.sortOrder &&
    SORT_ORDERS.includes(query.sortOrder)
      ? query.sortOrder
      : "desc";

  return {
    sortBy,
    sortOrder,
  };
};

/*
 * Determines which properties a user is allowed to retrieve.
 */
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

/*
 * Safely converts a query-string value into a positive number.
 */
const parseNumber = (
  value?: string,
): number | undefined => {
  if (!value?.trim()) {
    return undefined;
  }

  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < 0
  ) {
    return undefined;
  }

  return parsedValue;
};

/*
 * Supports both:
 *
 * ?amenities=Parking,Lift
 *
 * and:
 *
 * ?amenities=Parking&amenities=Lift
 */
const parseAmenities = (
  amenities?: string | string[],
): string[] => {
  if (!amenities) {
    return [];
  }

  const values = Array.isArray(amenities)
    ? amenities
    : [amenities];

  return [
    ...new Set(
      values
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
};

/*
 * Builds the Prisma AND conditions for property listing.
 */
export const buildPropertyFilters = (
  query: GetPropertiesQuery,
  scope: Scope,
): PropertyWhereInput[] => {
  const {
    categoryId,
    isAvailable,
    location,
    search,
    minRent,
    maxRent,
    amenities,
  } = query;

  const andConditions: PropertyWhereInput[] = [];

  /*
   * Role-based property visibility.
   */
  switch (scope.type) {
    case "PUBLIC":
      /*
       * Public visitors can only see available properties.
       */
      andConditions.push({
        isAvailable: true,
      });
      break;

    case "LANDLORD":
      /*
       * A landlord can only see their own properties.
       */
      andConditions.push({
        landlordId: scope.landlordId,
      });
      break;

    case "ADMIN":
      /*
       * Admin can see every property.
       */
      break;
  }

  /*
   * Category filter.
   */
  const normalizedCategoryId = categoryId?.trim();

  if (normalizedCategoryId) {
    andConditions.push({
      categoryId: normalizedCategoryId,
    });
  }

  /*
   * Availability filter.
   *
   * Public availability is always true, so this filter is only
   * applied to landlord and admin requests.
   */
  if (
    scope.type !== "PUBLIC" &&
    (isAvailable === "true" ||
      isAvailable === "false")
  ) {
    andConditions.push({
      isAvailable: isAvailable === "true",
    });
  }

  /*
   * Location filter.
   */
  const normalizedLocation = location?.trim();

  if (normalizedLocation) {
    andConditions.push({
      location: {
        contains: normalizedLocation,
        mode: "insensitive",
      },
    });
  }

  /*
   * Rent range filter.
   */
  const normalizedMinRent =
    parseNumber(minRent);

  const normalizedMaxRent =
    parseNumber(maxRent);

  if (
    normalizedMinRent !== undefined ||
    normalizedMaxRent !== undefined
  ) {
    andConditions.push({
      rent: {
        ...(normalizedMinRent !== undefined
          ? {
              gte: normalizedMinRent,
            }
          : {}),
        ...(normalizedMaxRent !== undefined
          ? {
              lte: normalizedMaxRent,
            }
          : {}),
      },
    });
  }

  /*
   * Amenities filter.
   *
   * hasEvery requires the property to contain every
   * selected amenity.
   */
  const normalizedAmenities =
    parseAmenities(amenities);

  if (normalizedAmenities.length > 0) {
    andConditions.push({
      amenities: {
        hasEvery: normalizedAmenities,
      },
    });
  }

  /*
   * General search filter.
   *
   * Searches property title, description, location,
   * and category name.
   */
  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  return andConditions;
};
