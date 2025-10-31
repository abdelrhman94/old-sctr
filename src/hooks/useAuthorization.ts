// hooks/useAuth.ts
import { useSelector } from "react-redux";

import { UserRole } from "@/enums/enums";
import { RootState } from "@/store/store";

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return {
    user: auth.user
  };
};

// Hook for role-based authorization
export const useRoleAuth = () => {
  const { user } = useAuth();

  const hasRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user?.roles) return false;

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.some((role) => user.roles.includes(role));
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user?.roles) return false;
    return roles.some((role) => user.roles.includes(role));
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    if (!user?.roles) return false;
    return roles.every((role) => user.roles.includes(role));
  };

  // Specific role checks for common use cases
  const canManageUsers = (): boolean => {
    return hasAnyRole([UserRole.ORGANIZATION_ADMIN, UserRole.DIRECTOR_MANAGER]);
  };

  const canReview = (): boolean => {
    return hasRole(UserRole.REVIEWER);
  };

  const isAdmin = (): boolean => {
    return hasRole(UserRole.ORGANIZATION_ADMIN);
  };

  const isDirectorManager = (): boolean => {
    return hasRole(UserRole.DIRECTOR_MANAGER);
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canManageUsers,
    canReview,
    isAdmin,
    isDirectorManager,
    userRoles: user?.roles || []
  };
};
