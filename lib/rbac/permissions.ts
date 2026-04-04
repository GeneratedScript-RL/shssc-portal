export const PERMISSIONS = {
  POST_ANNOUNCEMENT: "post:announcement",
  POST_NEWS: "post:news",
  POST_MEMORANDUM: "post:memorandum",
  MANAGE_EVENTS: "manage:events",
  MANAGE_POLLS: "manage:polls",
  MANAGE_MINUTES: "manage:minutes",
  MANAGE_RESOLUTIONS: "manage:resolutions",
  MANAGE_FINANCIALS: "manage:financials",
  VIEW_COMPLAINTS: "view:complaints",
  RESPOND_COMPLAINTS: "respond:complaints",
  MANAGE_USERS: "manage:users",
  MANAGE_ROLES: "manage:roles",
  MANAGE_COMMITTEES: "manage:committees",
  MANAGE_AWARDS: "manage:awards",
  MANAGE_ROSTER: "manage:roster",
  MODERATE_FORUMS: "moderate:forums",
  POST_BULLETIN: "post:bulletin",
  LIVE_QA_RESPOND: "live_qa:respond",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export const PERMISSION_VALUES = Object.values(PERMISSIONS);

export const ADMIN_PERMISSION_LABELS: Record<Permission, string> = {
  [PERMISSIONS.POST_ANNOUNCEMENT]: "Post Announcement",
  [PERMISSIONS.POST_NEWS]: "Post News",
  [PERMISSIONS.POST_MEMORANDUM]: "Post Memorandum",
  [PERMISSIONS.MANAGE_EVENTS]: "Manage Events",
  [PERMISSIONS.MANAGE_POLLS]: "Manage Polls",
  [PERMISSIONS.MANAGE_MINUTES]: "Manage Minutes",
  [PERMISSIONS.MANAGE_RESOLUTIONS]: "Manage Resolutions",
  [PERMISSIONS.MANAGE_FINANCIALS]: "Manage Financials",
  [PERMISSIONS.VIEW_COMPLAINTS]: "View Complaints",
  [PERMISSIONS.RESPOND_COMPLAINTS]: "Respond Complaints",
  [PERMISSIONS.MANAGE_USERS]: "Manage Users",
  [PERMISSIONS.MANAGE_ROLES]: "Manage Roles",
  [PERMISSIONS.MANAGE_COMMITTEES]: "Manage Committees",
  [PERMISSIONS.MANAGE_AWARDS]: "Manage Awards",
  [PERMISSIONS.MANAGE_ROSTER]: "Manage Roster",
  [PERMISSIONS.MODERATE_FORUMS]: "Moderate Forums",
  [PERMISSIONS.POST_BULLETIN]: "Post Bulletin",
  [PERMISSIONS.LIVE_QA_RESPOND]: "Respond to Live Q&A",
};
