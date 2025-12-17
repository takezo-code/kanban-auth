/**
 * Constantes de Roles do Sistema
 */
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const USER_ROLE_ARRAY = Object.values(USER_ROLES);

