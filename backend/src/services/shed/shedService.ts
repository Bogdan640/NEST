import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';
import { NotFoundError, ConflictError, ForbiddenError, BadRequestError } from '../../utils/errors';
import { assertOwnerOrAdmin } from '../../utils/authHelpers';

export const getResources = async (
  search?: string,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc',
  page: number = 1,
  limit: number = 20
) => {
  const queryFilter: Prisma.ResourceWhereInput = {};
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
        owner: { select: { firstName: true, lastName: true } },
        reservations: {
          include: {
            borrower: { select: { id: true, firstName: true, lastName: true } }
          }
        }
      }
    }),
    prisma.resource.count({ where: queryFilter })
  ]);

  return { data, total, page, limit };
};

export const getResourceById = async (resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: { owner: { select: { firstName: true, lastName: true } }, reservations: true }
  });
  if (!resource) throw new NotFoundError('Resource not found');
  return resource;
};

export const createResource = async (
  name: string,
  description: string,
  type: string,
  ownerId?: string
) => {
  return await prisma.resource.create({
    data: {
      name,
      description,
      type,
      ownerId
    }
  });
};

export const reserveResource = async (
  userId: string,
  resourceId: string,
  startTime: Date,
  endTime: Date
) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      reservations: {
        orderBy: { endTime: 'desc' }
      }
    }
  });

  if (!resource) {
    throw new NotFoundError('Resource not found');
  }

  // Block the owner from borrowing their own resource
  if (resource.ownerId === userId) {
    throw new ForbiddenError('You cannot borrow your own shared resource');
  }

  // Check if the user already has an active reservation on this resource
  const userActiveReservation = resource.reservations.find(
    res => res.borrowerId === userId && res.status === 'APPROVED'
  );
  if (userActiveReservation) {
    throw new ConflictError('You already have an active reservation for this item. Please return it first.');
  }

  const isEngaged = resource.reservations.some(res => res.status === 'APPROVED' && res.endTime > new Date());
  if (isEngaged) {
    throw new ConflictError('This item is already borrowed by someone else');
  }

  if (resource.type === 'TOOL' && resource.reservations.length > 0) {
    const previousReservation = resource.reservations[0];
    if (previousReservation && previousReservation.status === 'RETURNED') {
      const borrowedDurationMs = previousReservation.endTime.getTime() - previousReservation.startTime.getTime();
      const cooldownMs = borrowedDurationMs / 24;
      const cooldownExpiration = new Date(previousReservation.updatedAt.getTime() + cooldownMs);
      const minutesLeft = Math.ceil((cooldownExpiration.getTime() - Date.now()) / 60000);

      if (new Date() < cooldownExpiration) {
        throw new ConflictError(`This item is in a mandatory cooldown period. It will be available in approximately ${minutesLeft} minute(s).`);
      }
    }
  }

  return await prisma.resourceReservation.create({
    data: {
      resourceId,
      borrowerId: userId,
      startTime,
      endTime,
      status: 'APPROVED'
    }
  });
};

export const returnResource = async (userId: string, resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId }
  });

  if (!resource) {
    throw new NotFoundError('Resource not found');
  }

  // Only the resource owner can mark items as returned
  if (resource.ownerId !== userId) {
    throw new ForbiddenError('Only the item owner can mark it as returned');
  }

  const activeReservation = await prisma.resourceReservation.findFirst({
    where: {
      resourceId,
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

export const updateResource = async (userId: string, resourceId: string, userRole: string, name: string, description: string) => {
  const existingResource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!existingResource) throw new NotFoundError('Resource not found');
  
  assertOwnerOrAdmin(existingResource.ownerId, userId, userRole);

  return await prisma.resource.update({
    where: { id: resourceId },
    data: { name, description }
  });
};

export const deleteResource = async (userId: string, resourceId: string, userRole: string) => {
  const existingResource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!existingResource) throw new NotFoundError('Resource not found');
  
  assertOwnerOrAdmin(existingResource.ownerId, userId, userRole);

  return await prisma.resource.delete({ where: { id: resourceId } });
};
