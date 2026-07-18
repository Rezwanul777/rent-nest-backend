import { UserRole } from "../generated/prisma/enums";

export interface AuthenticatedUser {
  name: string;
  email: string;
  role: UserRole;
  id: string;
  isActive: boolean;
}