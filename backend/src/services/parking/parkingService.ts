import prisma from '../../config/prisma';
import { NotFoundError, ConflictError, ForbiddenError } from '../../utils/errors';
import { assertOwnerOrAdmin } from '../../utils/authHelpers';

export const retrievePlatformAnnouncements = async (
  search?: string,
  sortBy: string = 'availableFrom',
  sortOrder: string = 'asc',
  page: number = 1,
  limit: number = 20
) => {
  const queryFilter: any = {};
  if (search) {
    queryFilter.OR = [
      { parkingSlot: { identifier: { contains: search } } }
    ];
  }

  const [data, total] = await Promise.all([
    prisma.parkingAnnouncement.findMany({
      where: queryFilter,
      orderBy: { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        publisher: { select: { firstName: true, lastName: true, apartmentNumber: true } },
        parkingSlot: true,
        applications: true
      }
    }),
    prisma.parkingAnnouncement.count({ where: queryFilter })
  ]);

  return { data, total, page, limit };
};

export const retrieveAnnouncementById = async (announcementId: string) => {
  const announcementResult = await prisma.parkingAnnouncement.findUnique({
    where: { id: announcementId },
    include: { publisher: { select: { firstName: true, lastName: true, apartmentNumber: true } }, parkingSlot: true, applications: true }
  });
  if (!announcementResult) throw new NotFoundError('Parking announcement not found');
  return announcementResult;
};

export const createTargetAnnouncement = async (
  publisherIdValue: string,
  parkingSlotIdValue: string,
  availableFromValue: Date,
  availableToValue: Date
) => {
  return await prisma.parkingAnnouncement.create({
    data: {
      publisherId: publisherIdValue,
      parkingSlotId: parkingSlotIdValue,
      availableFrom: availableFromValue,
      availableTo: availableToValue
    }
  });
};

export const applyForTargetAnnouncement = async (
  applicantIdValue: string,
  announcementIdValue: string
) => {
  const targetedAnnouncement = await prisma.parkingAnnouncement.findUnique({
    where: { id: announcementIdValue },
    include: { applications: true }
  });

  if (!targetedAnnouncement) {
    throw new NotFoundError('Parking announcement not found');
  }

  const existingApproval = targetedAnnouncement.applications.find(app => app.status === 'APPROVED');
  if (existingApproval) {
    throw new ConflictError('Parking slot already claimed by another resident');
  }

  const existingApplication = targetedAnnouncement.applications.find(app => app.applicantId === applicantIdValue);
  if (existingApplication) {
    throw new ConflictError('Already applied for this parking slot');
  }

  return await prisma.parkingApplication.create({
    data: {
      applicantId: applicantIdValue,
      announcementId: announcementIdValue
    }
  });
};

export const approveTargetApplication = async (
  publisherIdValue: string,
  applicationIdValue: string
) => {
  const targetedApplication = await prisma.parkingApplication.findUnique({
    where: { id: applicationIdValue },
    include: { announcement: true }
  });

  if (!targetedApplication) {
    throw new NotFoundError('Parking application not found');
  }

  if (targetedApplication.announcement.publisherId !== publisherIdValue) {
    throw new ForbiddenError('Only the announcement publisher can approve applications');
  }

  const existingApproval = await prisma.parkingApplication.findFirst({
    where: {
      announcementId: targetedApplication.announcementId,
      status: 'APPROVED'
    }
  });

  if (existingApproval) {
    throw new ConflictError('Parking slot already claimed by another resident');
  }

  await prisma.parkingApplication.updateMany({
    where: {
      announcementId: targetedApplication.announcementId,
      id: { not: applicationIdValue }
    },
    data: { status: 'REJECTED' }
  });

  return await prisma.parkingApplication.update({
    where: { id: applicationIdValue },
    data: { status: 'APPROVED' }
  });
};

export const deleteParkingAnnouncement = async (userId: string, announcementId: string, userRole: string) => {
  const existingAnnouncement = await prisma.parkingAnnouncement.findUnique({ where: { id: announcementId } });
  if (!existingAnnouncement) throw new NotFoundError('Parking announcement not found');
  
  assertOwnerOrAdmin(existingAnnouncement.publisherId, userId, userRole);

  return await prisma.parkingAnnouncement.delete({ where: { id: announcementId } });
};

export const getAllParkingSlots = async () => {
  return await prisma.parkingSlot.findMany({
    include: {
      owner: { select: { firstName: true, lastName: true, apartmentNumber: true } }
    }
  });
};

export const createParkingSlot = async (ownerId: string, identifier: string) => {
  const existingSlot = await prisma.parkingSlot.findUnique({ where: { identifier } });
  if (existingSlot) {
    throw new ConflictError('Parking slot identifier already exists');
  }

  return await prisma.parkingSlot.create({
    data: {
      ownerId,
      identifier
    }
  });
};
