import { SetMetadata } from "@nestjs/common"
import { UserRole } from "@prisma/client"

export const Role_key ="roles"
export const Roles =(...roles:UserRole[])=>SetMetadata(Role_key,roles)