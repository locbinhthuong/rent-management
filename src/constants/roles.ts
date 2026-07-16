export const ROLES = {
  ADMIN: 'Admin',
  CTV: 'CTV',
  CUSTOMER: 'Customer',
  GUEST: 'Guest',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
