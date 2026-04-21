import prisma from '../../config/prisma';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwtUtils';
import { getPermissionsForRole } from '../../config/constants';
import { ConflictError } from '../../utils/errors';

export const authenticateResident = async (emailPayload: string, passwordPayload: string) => {
  const targetedUser = await prisma.user.findUnique({
    where: { email: emailPayload }
  });

  if (!targetedUser) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(passwordPayload, targetedUser.passwordHash);
  
  if (!isPasswordValid) {
    return null;
  }

  const generatedJwtToken = generateToken({
    userId: targetedUser.id,
    role: targetedUser.role,
    isVerified: targetedUser.isVerified,
    blockId: targetedUser.blockId
  });

  return {
    token: generatedJwtToken,
    user: {
      id: targetedUser.id,
      email: targetedUser.email,
      firstName: targetedUser.firstName,
      lastName: targetedUser.lastName,
      role: targetedUser.role,
      isVerified: targetedUser.isVerified,
      blockId: targetedUser.blockId
    },
    permissions: getPermissionsForRole(targetedUser.role)
  };
};

export const registerResident = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  apartmentNumber: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      apartmentNumber,
      isVerified: false
    }
  });

  const generatedJwtToken = generateToken({
    userId: newUser.id,
    role: newUser.role,
    isVerified: newUser.isVerified,
    blockId: newUser.blockId
  });

  return {
    token: generatedJwtToken,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      isVerified: newUser.isVerified,
      blockId: newUser.blockId
    },
    permissions: getPermissionsForRole(newUser.role)
  };
};

export const joinBlock = async (userId: string, blockCode: string) => {
  const block = await prisma.block.findUnique({ where: { code: blockCode } });
  if (!block) {
    throw new ConflictError('Invalid block code');
  }

  const existingRequest = await prisma.joinRequest.findUnique({
    where: { userId_blockId: { userId, blockId: block.id } }
  });
  if (existingRequest) {
    throw new ConflictError('Join request already submitted for this block');
  }

  return await prisma.joinRequest.create({
    data: {
      userId,
      blockId: block.id
    }
  });
};
