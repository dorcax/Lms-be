import { UserRole } from "@prisma/client"

export class userEntity {
    id:string
    role:UserRole
    email:string
}
