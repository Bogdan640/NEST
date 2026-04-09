import { PrismaClient } from '@prisma/client';

const prismaClientInstance = new PrismaClient();

export const retrieveAllPosts = async () => {
  return await prismaClientInstance.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, profileImage: true }
      }
    }
  });
};

export const createFeedPost = async (authorIdPayload: string, contentPayload: string, imageUrlPayload?: string) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const existingPostToday = await prismaClientInstance.post.findFirst({
    where: {
      authorId: authorIdPayload,
      createdAt: {
        gte: currentDate
      }
    }
  });

  if (existingPostToday) {
    throw new Error('Daily post limit exceeded');
  }

  return await prismaClientInstance.post.create({
    data: {
      content: contentPayload,
      imageUrl: imageUrlPayload,
      authorId: authorIdPayload
    }
  });
};
