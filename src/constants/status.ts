export const POST_STATUS = {
  AVAILABLE: 'Available',
  HOLD: 'Hold',
  RENTED: 'Rented',
  MAINTENANCE: 'Maintenance',
  PENDING: 'Pending',
} as const;

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];

export const LEAD_STATUS = {
  NEW: 'New',
  CALLED: 'Called',
  CONSULTING: 'Consulting',
  SUCCESS: 'Success',
  FAILED: 'Failed',
} as const;

export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];

export const APPROVAL_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

export const CONTRACT_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
} as const;

export type ContractStatus = typeof CONTRACT_STATUS[keyof typeof CONTRACT_STATUS];
