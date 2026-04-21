import prisma from '../../config/prisma';
import { NotFoundError, ForbiddenError } from '../../utils/errors';

export const getPendingUsers = async (adminId: string) => {
  const adminBlocks = await prisma.block.findMany({
    where: { adminId },
    select: { id: true }
  });

  const blockIds = adminBlocks.map(b => b.id);

  return await prisma.joinRequest.findMany({
    where: {
      blockId: { in: blockIds },
      status: 'PENDING'
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          apartmentNumber: true,
          createdAt: true
        }
      },
      block: {
        select: { id: true, name: true }
      }
    }
  });
};

export const approveUser = async (adminId: string, userId: string, joinRequestId: string) => {
  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id: joinRequestId },
    include: { block: true }
  });

  if (!joinRequest) {
    throw new NotFoundError('Join request not found');
  }

  if (joinRequest.block.adminId !== adminId) {
    throw new ForbiddenError('Only the block admin can approve users');
  }

  await prisma.joinRequest.update({
    where: { id: joinRequestId },
    data: { status: 'APPROVED' }
  });

  return await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
      blockId: joinRequest.blockId
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isVerified: true,
      blockId: true
    }
  });
};

export const rejectUser = async (adminId: string, joinRequestId: string) => {
  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id: joinRequestId },
    include: { block: true }
  });

  if (!joinRequest) {
    throw new NotFoundError('Join request not found');
  }

  if (joinRequest.block.adminId !== adminId) {
    throw new ForbiddenError('Only the block admin can reject users');
  }

  return await prisma.joinRequest.update({
    where: { id: joinRequestId },
    data: { status: 'REJECTED' }
  });
};

export const removeUser = async (adminId: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { block: true }
  });

  if (!user || !user.block) {
    throw new NotFoundError('User not found or not part of any block');
  }

  if (user.block.adminId !== adminId) {
    throw new ForbiddenError('Only the block admin can remove users');
  }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: false,
      blockId: null
    }
  });
};
