import prisma from '../../config/prisma';
import { NotFoundError, TooManyRequestsError } from '../../utils/errors';
import { assertOwnerOrAdmin } from '../../utils/authHelpers';

export const retrieveAllPosts = async (
  search?: string,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc',
  page: number = 1,
  limit: number = 20
) => {
  const queryFilter: any = {};
  if (search) queryFilter.content = { contains: search };

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where: queryFilter,
      orderBy: { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, profileImage: true }
        }
      }
    }),
    prisma.post.count({ where: queryFilter })
  ]);

  return { data, total, page, limit };
};

export const retrievePostById = async (postId: string) => {
  const postResult = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: { select: { id: true, firstName: true, lastName: true, profileImage: true } } }
  });
  if (!postResult) throw new NotFoundError('Post not found');
  return postResult;
};

export const createFeedPost = async (authorIdPayload: string, contentPayload: string, imageUrlPayload?: string) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const existingPostToday = await prisma.post.findFirst({
    where: {
      authorId: authorIdPayload,
      createdAt: {
        gte: currentDate
      }
    }
  });

  if (existingPostToday) {
    throw new TooManyRequestsError('Daily post limit exceeded');
  }

  return await prisma.post.create({
    data: {
      content: contentPayload,
      imageUrl: imageUrlPayload,
      authorId: authorIdPayload
    }
  });
};

export const updateFeedPost = async (userId: string, postId: string, userRole: string, newContent: string) => {
  const existingPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!existingPost) throw new NotFoundError('Post not found');
  
  assertOwnerOrAdmin(existingPost.authorId, userId, userRole);

  return await prisma.post.update({
    where: { id: postId },
    data: { content: newContent }
  });
};

export const deleteFeedPost = async (userId: string, postId: string, userRole: string) => {
  const existingPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!existingPost) throw new NotFoundError('Post not found');
  
  assertOwnerOrAdmin(existingPost.authorId, userId, userRole);

  return await prisma.post.delete({ where: { id: postId } });
};
