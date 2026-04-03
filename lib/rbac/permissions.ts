export const PERMISSIONS = {
  POST_ANNOUNCEMENT: 'post:announcement',
  POST_NEWS: 'post:news',
  POST_MEMORANDUM: 'post:memorandum',
  MANAGE_EVENTS: 'manage:events',
  MANAGE_POLLS: 'manage:polls',
  MANAGE_MINUTES: 'manage:minutes',
  MANAGE_RESOLUTIONS: 'manage:resolutions',
  MANAGE_FINANCIALS: 'manage:financials',
  VIEW_COMPLAINTS: 'view:complaints',
  RESPOND_COMPLAINTS: 'respond:complaints',
  MANAGE_USERS: 'manage:users',
  MANAGE_ROLES: 'manage:roles',
  MANAGE_COMMITTEES: 'manage:committees',
  MANAGE_AWARDS: 'manage:awards',
  MANAGE_ROSTER: 'manage:roster',
  MODERATE_FORUMS: 'moderate:forums',
  POST_BULLETIN: 'post:bulletin',
  LIVE_QA_RESPOND: 'live_qa:respond',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];