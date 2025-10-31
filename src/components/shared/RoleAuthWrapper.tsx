// hoc/withRoleAuth.tsx
'use client'
import { UserRole } from '@/enums/enums'
import { useRoleAuth } from '@/hooks/useAuthorization'
import React from 'react'

interface WithRoleAuthOptions {
  requiredRoles: UserRole | UserRole[]
  fallback?: React.ReactNode
  requireAll?: boolean 
  hideWhenUnauthorized?: boolean 
}

// HOC function
export function withRoleAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithRoleAuthOptions
) {
  const WithRoleAuthComponent = (props: P) => {
    const {  hasAnyRole, hasAllRoles } = useRoleAuth()

    const {
      requiredRoles,
      fallback = null,
      requireAll = false,
      hideWhenUnauthorized = true
    } = options

    // Convert single role to array for consistent handling
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]

    // Check authorization based on requireAll flag
    const isAuthorized = requireAll
      ? hasAllRoles(rolesArray)
      : hasAnyRole(rolesArray)

    // If not authorized and should hide, return null
    if (!isAuthorized && hideWhenUnauthorized) {
      return null
    }

    // If not authorized but should show fallback, return fallback
    if (!isAuthorized && !hideWhenUnauthorized) {
      return <>{fallback}</>
    }

    // User is authorized, render the component
    return <Component {...props} />
  }

  // Set display name for debugging
  WithRoleAuthComponent.displayName = `withRoleAuth(${Component.displayName || Component.name})`

  return WithRoleAuthComponent
}

// Alternative: Render prop pattern for more flexibility
interface RoleGuardProps {
  requiredRoles: UserRole | UserRole[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode | ((isAuthorized: boolean) => React.ReactNode)
}

export function RoleGuard({
  requiredRoles,
  requireAll = false,
  fallback = null,
  children
}: RoleGuardProps) {
  const { hasAnyRole, hasAllRoles } = useRoleAuth()

  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  const isAuthorized = requireAll
    ? hasAllRoles(rolesArray)
    : hasAnyRole(rolesArray)

  // If children is a function, call it with authorization status
  if (typeof children === 'function') {
    return <>{children(isAuthorized)}</>
  }

  // Standard conditional rendering
  return isAuthorized ? <>{children}</> : <>{fallback}</>
}

// Utility component for common use cases
interface AuthorizedProps {
  roles: UserRole | UserRole[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function Authorized({ roles, requireAll = false, fallback = null, children }: AuthorizedProps) {
  return (
    <RoleGuard
      requiredRoles={roles}
      requireAll={requireAll}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  )
}