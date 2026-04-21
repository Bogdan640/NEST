import prisma from '../../config/prisma';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { assertOwnerOrAdmin } from '../../utils/authHelpers';

export const retrievePlatformResources = async (
  search?: string,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc',
  page: number = 1,
  limit: number = 20
) => {
  const queryFilter: any = {};
  if (search) {
    queryFilter.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { type: { contains: search } }
    ];
  }

  const [data, total] = await Promise.all([
    prisma.resource.findMany({
      where: queryFilter,
      orderBy: { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: { select: { firstName: true, lastName: true } }
      }
    }),
    prisma.resource.count({ where: queryFilter })
  ]);

  return { data, total, page, limit };
};

export const retrieveResourceById = async (resourceId: string) => {
  const resourceResult = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: { owner: { select: { firstName: true, lastName: true } }, reservations: true }
  });
  if (!resourceResult) throw new NotFoundError('Resource not found');
  return resourceResult;
};

export const createTargetResource = async (
  nameValue: string,
  descriptionValue: string,
  typeValue: string,
  ownerIdValue?: string
) => {
  return await prisma.resource.create({
    data: {
      name: nameValue,
      description: descriptionValue,
      type: typeValue,
      ownerId: ownerIdValue
    }
  });
};

export const reserveTargetResource = async (
  userIdValue: string,
  resourceIdValue: string,
  startTimeValue: Date,
  endTimeValue: Date
) => {
  const targetedResource = await prisma.resource.findUnique({
    where: { id: resourceIdValue },
    include: {
      reservations: {
        orderBy: { endTime: 'desc' },
        take: 1
      }
    }
  });

  if (!targetedResource) {
    throw new NotFoundError('Resource not found');
  }

  const isEngaged = targetedResource.reservations.some(res => res.status === 'APPROVED' && res.endTime > new Date());
  if (isEngaged) {
    throw new ConflictError('Resource actively engaged elsewhere');
  }

  if (targetedResource.type === 'TOOL' && targetedResource.reservations.length > 0) {
    const previousReservation = targetedResource.reservations[0];
    if (previousReservation && previousReservation.status === 'RETURNED') {
      const borrowedDurationMs = previousReservation.endTime.getTime() - previousReservation.startTime.getTime();
      const cooldownMs = borrowedDurationMs / 24; 
      const cooldownExpiration = new Date(previousReservation.updatedAt.getTime() + cooldownMs);
      
      if (new Date() < cooldownExpiration) {
        throw new ConflictError('Resource experiencing mandatory cooldown phase');
      }
    }
  }

  return await prisma.resourceReservation.create({
    data: {
      resourceId: resourceIdValue,
      borrowerId: userIdValue,
      startTime: startTimeValue,
      endTime: endTimeValue,
      status: 'APPROVED'
    }
  });
};

export const returnTargetResource = async (userId: string, resourceId: string) => {
  const activeReservation = await prisma.resourceReservation.findFirst({
    where: {
      resourceId,
      borrowerId: userId,
      status: 'APPROVED'
    }
  });

  if (!activeReservation) {
    throw new NotFoundError('No active reservation found for this resource');
  }

  return await prisma.resourceReservation.update({
    where: { id: activeReservation.id },
    data: {
      status: 'RETURNED',
      endTime: new Date()
    }
  });
};

export const updateShedResource = async (userId: string, resourceId: string, userRole: string, newName: string, newDescription: string) => {
  const existingResource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!existingResource) throw new NotFoundError('Resource not found');
  
  assertOwnerOrAdmin(existingResource.ownerId, userId, userRole);

  return await prisma.resource.update({
    where: { id: resourceId },
    data: { name: newName, description: newDescription }
  });
};

export const deleteShedResource = async (userId: string, resourceId: string, userRole: string) => {
  const existingResource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!existingResource) throw new NotFoundError('Resource not found');
  
  assertOwnerOrAdmin(existingResource.ownerId, userId, userRole);

  return await prisma.resource.delete({ where: { id: resourceId } });
};
