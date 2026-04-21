import prisma from '../../config/prisma';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { assertOwnerOrAdmin } from '../../utils/authHelpers';

export const retrieveAllEvents = async (
  search?: string,
  sortBy: string = 'startTime',
  sortOrder: string = 'asc',
  page: number = 1,
  limit: number = 20
) => {
  const queryFilter: any = {};
  if (search) {
    queryFilter.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { location: { contains: search } },
      { type: { contains: search } }
    ];
  }

  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where: queryFilter,
      orderBy: { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        creator: {
          select: { firstName: true, lastName: true }
        },
        attendees: true
      }
    }),
    prisma.event.count({ where: queryFilter })
  ]);

  return { data, total, page, limit };
};

export const retrieveEventById = async (eventId: string) => {
  const eventResult = await prisma.event.findUnique({
    where: { id: eventId },
    include: { creator: { select: { firstName: true, lastName: true } }, attendees: true }
  });
  if (!eventResult) throw new NotFoundError('Event not found');
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
  return await prisma.event.create({
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
  const selectedEvent = await prisma.event.findUnique({
    where: { id: eventIdValue },
    include: { attendees: true }
  });

  if (!selectedEvent) {
    throw new NotFoundError('Event not found');
  }

  if (selectedEvent.maxParticipants && selectedEvent.attendees.length >= selectedEvent.maxParticipants) {
    throw new ConflictError('Event capacity completely maximized');
  }

  const existingAttendance = await prisma.eventAttendee.findFirst({
    where: {
      userId: userIdValue,
      eventId: eventIdValue
    }
  });

  if (existingAttendance) {
    throw new ConflictError('Already joined this event');
  }

  return await prisma.eventAttendee.create({
    data: {
      userId: userIdValue,
      eventId: eventIdValue
    }
  });
};

export const leaveTargetEvent = async (userIdValue: string, eventIdValue: string) => {
  const selectedEvent = await prisma.event.findUnique({
    where: { id: eventIdValue }
  });

  if (!selectedEvent) {
    throw new NotFoundError('Event not found');
  }

  const existingAttendance = await prisma.eventAttendee.findFirst({
    where: {
      userId: userIdValue,
      eventId: eventIdValue
    }
  });

  if (!existingAttendance) {
    throw new NotFoundError('Not currently attending this event');
  }

  return await prisma.eventAttendee.delete({
    where: {
      userId_eventId: {
        userId: userIdValue,
        eventId: eventIdValue
      }
    }
  });
};

export const updateEventTarget = async (userId: string, eventId: string, userRole: string, newTitle: string, newDescription: string) => {
  const existingEvent = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existingEvent) throw new NotFoundError('Event not found');
  
  assertOwnerOrAdmin(existingEvent.creatorId, userId, userRole);

  return await prisma.event.update({
    where: { id: eventId },
    data: { title: newTitle, description: newDescription }
  });
};

export const deleteEventTarget = async (userId: string, eventId: string, userRole: string) => {
  const existingEvent = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existingEvent) throw new NotFoundError('Event not found');
  
  assertOwnerOrAdmin(existingEvent.creatorId, userId, userRole);

  return await prisma.event.delete({ where: { id: eventId } });
};
