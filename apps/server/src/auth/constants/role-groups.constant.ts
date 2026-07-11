import { ROLE } from '../../user/enum/role';

/**
 * Role groups for property-level access.
 *
 * Under the new 3-role architecture, all property staff are INTERNAL_USER.
 * Their specific access is controlled by fine-grained permissions (CustomRole).
 *
 * PROPERTY_ROLES: roles that belong to a specific property context
 * MANAGEMENT_ROLES: roles that can manage other users/settings within a property
 */
export const PROPERTY_ROLES: ROLE[] = [ROLE.INTERNAL_USER];

export const MANAGEMENT_ROLES: ROLE[] = [ROLE.ADMIN, ROLE.INTERNAL_USER];

export const STAFF_ROLES: ROLE[] = [ROLE.ADMIN, ROLE.INTERNAL_USER];

