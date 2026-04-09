import { PrismaClient } from '@prisma/client';

const prismaClientInstance = new PrismaClient();

export const retrieveAllPosts = async (search?: string, sortBy: string = 'createdAt', sortOrder: string = 'desc') => {
  const queryFilter: any = {};
  if (search) queryFilter.content = { contains: search };

  return await prismaClientInstance.post.findMany({
    where: queryFilter,
    orderBy: { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, profileImage: true }
      }
    }
  });
};

export const retrievePostById = async (postId: string) => {
  const postResult = await prismaClientInstance.post.findUnique({
    where: { id: postId },
    include: { author: { select: { id: true, firstName: true, lastName: true, profileImage: true } } }
  });
  if (!postResult) throw new Error('Post untraceable');
  return postResult;
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

export const updateFeedPost = async (userId: string, postId: string, userRole: string, newContent: string) => {
  const existingPost = await prismaClientInstance.post.findUnique({ where: { id: postId } });
  if (!existingPost) throw new Error('Post untraceable');
  
  if (existingPost.authorId !== userId && userRole !== 'ADMIN') {
    throw new Error('Unauthorized operational jurisdiction');
  }

  return await prismaClientInstance.post.update({
    where: { id: postId },
    data: { content: newContent }
  });
};

export const deleteFeedPost = async (userId: string, postId: string, userRole: string) => {
  const existingPost = await prismaClientInstance.post.findUnique({ where: { id: postId } });
  if (!existingPost) throw new Error('Post untraceable');
  
  if (existingPost.authorId !== userId && userRole !== 'ADMIN') {
    throw new Error('Unauthorized operational jurisdiction');
  }

  return await prismaClientInstance.post.delete({ where: { id: postId } });
};
