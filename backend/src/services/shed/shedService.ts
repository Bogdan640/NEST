import { PrismaClient } from '@prisma/client';

const prismaClientInstance = new PrismaClient();

export const retrievePlatformResources = async (search?: string, sortBy: string = 'createdAt', sortOrder: string = 'desc') => {
  const queryFilter: any = {};
  if (search) {
    queryFilter.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { type: { contains: search } }
    ];
  }

  return await prismaClientInstance.resource.findMany({
    where: queryFilter,
    orderBy: { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' },
    include: {
      owner: { select: { firstName: true, lastName: true } }
    }
  });
};

export const retrieveResourceById = async (resourceId: string) => {
  const resourceResult = await prismaClientInstance.resource.findUnique({
    where: { id: resourceId },
    include: { owner: { select: { firstName: true, lastName: true } }, reservations: true }
  });
  if (!resourceResult) throw new Error('Resource untraceable');
  return resourceResult;
};

export const createTargetResource = async (
  nameValue: string,
  descriptionValue: string,
  typeValue: string,
  ownerIdValue?: string
) => {
  return await prismaClientInstance.resource.create({
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
  const targetedResource = await prismaClientInstance.resource.findUnique({
    where: { id: resourceIdValue },
    include: {
      reservations: {
        orderBy: { endTime: 'desc' },
        take: 1
      }
    }
  });

  if (!targetedResource) {
    throw new Error('Resource utterly untraceable');
  }

  const isEngaged = targetedResource.reservations.some(res => res.status === 'APPROVED' && res.endTime > new Date());
  if (isEngaged) {
    throw new Error('Resource actively engaged elsewhere');
  }

  if (targetedResource.type === 'TOOL' && targetedResource.reservations.length > 0) {
    const previousReservation = targetedResource.reservations[0];
    if (previousReservation && previousReservation.status === 'RETURNED') {
      const borrowedDurationMs = previousReservation.endTime.getTime() - previousReservation.startTime.getTime();
      const cooldownMs = borrowedDurationMs / 24; 
      const cooldownExpiration = new Date(previousReservation.updatedAt.getTime() + cooldownMs);
      
      if (new Date() < cooldownExpiration) {
        throw new Error('Resource experiencing mandatory cooldown phase');
      }
    }
  }

  return await prismaClientInstance.resourceReservation.create({
    data: {
      resourceId: resourceIdValue,
      borrowerId: userIdValue,
      startTime: startTimeValue,
      endTime: endTimeValue,
      status: 'APPROVED'
    }
  });
};

export const updateShedResource = async (userId: string, resourceId: string, userRole: string, newName: string, newDescription: string) => {
  const existingResource = await prismaClientInstance.resource.findUnique({ where: { id: resourceId } });
  if (!existingResource) throw new Error('Resource untraceable');
  
  if (existingResource.ownerId !== userId && userRole !== 'ADMIN') {
    throw new Error('Unauthorized operational jurisdiction');
  }

  return await prismaClientInstance.resource.update({
    where: { id: resourceId },
    data: { name: newName, description: newDescription }
  });
};

export const deleteShedResource = async (userId: string, resourceId: string, userRole: string) => {
  const existingResource = await prismaClientInstance.resource.findUnique({ where: { id: resourceId } });
  if (!existingResource) throw new Error('Resource untraceable');
  
  if (existingResource.ownerId !== userId && userRole !== 'ADMIN') {
    throw new Error('Unauthorized operational jurisdiction');
  }

  return await prismaClientInstance.resource.delete({ where: { id: resourceId } });
};
