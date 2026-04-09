import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwtUtils';

const prismaClientInstance = new PrismaClient();

export const authenticateResident = async (emailPayload: string, passwordPayload: string) => {
  const targetedUser = await prismaClientInstance.user.findUnique({
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
    role: targetedUser.role
  });

  return {
    token: generatedJwtToken,
    user: {
      id: targetedUser.id,
      email: targetedUser.email,
      firstName: targetedUser.firstName,
      lastName: targetedUser.lastName,
      role: targetedUser.role,
      isVerified: targetedUser.isVerified
    }
  };
};
