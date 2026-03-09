import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { AuthGuard } from "../guards/authGuard";
import { RoleGuard } from "../guards/roleGuard";
import { Roles } from "./roles.decorator";

// Auth decorator with optional roles
export const Auth = (roles?: UserRole[]) => {
  // Only authentication if no roles provided
  if (!roles || roles.length === 0) {
    return applyDecorators(UseGuards(AuthGuard));
  }

  // Authentication + role-based authorization
  return applyDecorators(
    Roles(...roles),        // set roles metadata
    UseGuards(AuthGuard, RoleGuard) // execute guards
  );
};



export const AuthUser=createParamDecorator((data:unknown,ctx:ExecutionContext)=>{
    const request =ctx.switchToHttp().getRequest()
    const user =request.user
    // return data ? user?.[data]:user
    return user

})




export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
    
