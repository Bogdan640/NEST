import { ROLES } from '../config/constants';
import { ForbiddenError } from './errors';

export const assertOwnerOrAdmin = (resourceOwnerId: string | null, userId: string, userRole: string): void => {
  if (resourceOwnerId !== userId && userRole !== ROLES.ADMIN) {
    throw new ForbiddenError('Not authorized to perform this action');
  }
};
