import { PrismaClient } from '@prisma/client';

const prismaClientInstance = new PrismaClient();

export const retrieveAllEvents = async () => {
  return await prismaClientInstance.event.findMany({
    orderBy: { startTime: 'asc' },
    include: {
      creator: {
        select: { firstName: true, lastName: true }
      },
      attendees: true
    }
  });
};

export const createTargetEvent = async (
  creatorIdValue: string,
  titleValue: string,
  descriptionValue: string,
  locationValue: string,
  typeValue: string,
  startTimeValue: Date,
  endTimeValue: Date,
  maxParticipantsValue?: number,
  visibilityValue?: string
) => {
  return await prismaClientInstance.event.create({
    data: {
      title: titleValue,
      description: descriptionValue,
      location: locationValue,
      type: typeValue,
      startTime: startTimeValue,
      endTime: endTimeValue,
      maxParticipants: maxParticipantsValue,
      visibility: visibilityValue || 'ALL',
      creatorId: creatorIdValue
    }
  });
};

export const joinTargetEvent = async (userIdValue: string, eventIdValue: string) => {
  const selectedEvent = await prismaClientInstance.event.findUnique({
    where: { id: eventIdValue },
    include: { attendees: true }
  });

  if (!selectedEvent) {
    throw new Error('Event could not be located');
  }

  if (selectedEvent.maxParticipants && selectedEvent.attendees.length >= selectedEvent.maxParticipants) {
    throw new Error('Event capacity completely maximized');
  }

  const existingAttendance = await prismaClientInstance.eventAttendee.findFirst({
    where: {
      userId: userIdValue,
      eventId: eventIdValue
    }
  });

  if (existingAttendance) {
    throw new Error('Resident heavily duplicated attendance');
  }

  return await prismaClientInstance.eventAttendee.create({
    data: {
      userId: userIdValue,
      eventId: eventIdValue
    }
  });
};
