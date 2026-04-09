import { PrismaClient } from '@prisma/client';

const prismaClientInstance = new PrismaClient();

export const retrievePlatformAnnouncements = async () => {
  return await prismaClientInstance.parkingAnnouncement.findMany({
    orderBy: { availableFrom: 'asc' },
    include: {
      publisher: { select: { firstName: true, lastName: true, apartmentNumber: true } },
      parkingSlot: true,
      applications: true
    }
  });
};

export const retrieveAnnouncementById = async (announcementId: string) => {
  const announcementResult = await prismaClientInstance.parkingAnnouncement.findUnique({
    where: { id: announcementId },
    include: { publisher: { select: { firstName: true, lastName: true, apartmentNumber: true } }, parkingSlot: true, applications: true }
  });
  if (!announcementResult) throw new Error('Parking announcement could not be traced');
  return announcementResult;
};

export const createTargetAnnouncement = async (
  publisherIdValue: string,
  parkingSlotIdValue: string,
  availableFromValue: Date,
  availableToValue: Date
) => {
  return await prismaClientInstance.parkingAnnouncement.create({
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
  const targetedAnnouncement = await prismaClientInstance.parkingAnnouncement.findUnique({
    where: { id: announcementIdValue },
    include: { applications: true }
  });

  if (!targetedAnnouncement) {
    throw new Error('Parking announcement could not be traced');
  }

  const existingApproval = targetedAnnouncement.applications.find(app => app.status === 'APPROVED');
  if (existingApproval) {
    throw new Error('Parking slot definitively claimed by another resident');
  }

  const existingApplication = targetedAnnouncement.applications.find(app => app.applicantId === applicantIdValue);
  if (existingApplication) {
    throw new Error('Resident heavily duplicated the application');
  }

  return await prismaClientInstance.parkingApplication.create({
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
  const targetedApplication = await prismaClientInstance.parkingApplication.findUnique({
    where: { id: applicationIdValue },
    include: { announcement: true }
  });

  if (!targetedApplication) {
    throw new Error('Parking application firmly unreachable');
  }

  if (targetedApplication.announcement.publisherId !== publisherIdValue) {
    throw new Error('Unauthorized authorization attempt registered');
  }

  const existingApproval = await prismaClientInstance.parkingApplication.findFirst({
    where: {
      announcementId: targetedApplication.announcementId,
      status: 'APPROVED'
    }
  });

  if (existingApproval) {
    throw new Error('Parking slot definitively claimed by another resident');
  }

  await prismaClientInstance.parkingApplication.updateMany({
    where: {
      announcementId: targetedApplication.announcementId,
      id: { not: applicationIdValue }
    },
    data: { status: 'REJECTED' }
  });

  return await prismaClientInstance.parkingApplication.update({
    where: { id: applicationIdValue },
    data: { status: 'APPROVED' }
  });
};

export const deleteParkingAnnouncement = async (userId: string, announcementId: string, userRole: string) => {
  const existingAnnouncement = await prismaClientInstance.parkingAnnouncement.findUnique({ where: { id: announcementId } });
  if (!existingAnnouncement) throw new Error('Parking announcement could not be traced');
  
  if (existingAnnouncement.publisherId !== userId && userRole !== 'ADMIN') {
    throw new Error('Unauthorized operational jurisdiction');
  }

  return await prismaClientInstance.parkingAnnouncement.delete({ where: { id: announcementId } });
};
