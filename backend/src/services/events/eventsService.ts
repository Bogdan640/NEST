import { PrismaClient } from '@prisma/client';

const prismaClientInstance = new PrismaClient();

export const retrieveAllEvents = async (search?: string, sortBy: string = 'startTime', sortOrder: string = 'asc') => {
  const queryFilter: any = {};
  if (search) {
    queryFilter.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { location: { contains: search } },
      { type: { contains: search } }
    ];
  }

  return await prismaClientInstance.event.findMany({
    where: queryFilter,
    orderBy: { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' },
    include: {
      creator: {
        select: { firstName: true, lastName: true }
      },
      attendees: true
    }
  });
};

export const retrieveEventById = async (eventId: string) => {
  const eventResult = await prismaClientInstance.event.findUnique({
    where: { id: eventId },
    include: { creator: { select: { firstName: true, lastName: true } }, attendees: true }
  });
  if (!eventResult) throw new Error('Event untraceable');
  return eventResult;
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

export const updateEventTarget = async (userId: string, eventId: string, userRole: string, newTitle: string, newDescription: string) => {
  const existingEvent = await prismaClientInstance.event.findUnique({ where: { id: eventId } });
  if (!existingEvent) throw new Error('Event untraceable');
  
  if (existingEvent.creatorId !== userId && userRole !== 'ADMIN') {
    throw new Error('Unauthorized operational jurisdiction');
  }

  return await prismaClientInstance.event.update({
    where: { id: eventId },
    data: { title: newTitle, description: newDescription }
  });
};

export const deleteEventTarget = async (userId: string, eventId: string, userRole: string) => {
  const existingEvent = await prismaClientInstance.event.findUnique({ where: { id: eventId } });
  if (!existingEvent) throw new Error('Event untraceable');
  
  if (existingEvent.creatorId !== userId && userRole !== 'ADMIN') {
    throw new Error('Unauthorized operational jurisdiction');
  }

  return await prismaClientInstance.event.delete({ where: { id: eventId } });
};
