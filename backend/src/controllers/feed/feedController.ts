import { Response, NextFunction } from 'express';
import { retrieveAllPosts, createFeedPost, updateFeedPost, deleteFeedPost, retrievePostById } from '../../services/feed/feedService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getPostsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const result = await retrieveAllPosts(search, sortBy, sortOrder, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPostByIdController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await retrievePostById(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { content, imageUrl } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Post content is required' });
    return;
  }

  try {
    const result = await createFeedPost(req.user.userId, content, imageUrl);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateFeedController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  try {
    const result = await updateFeedPost(req.user.userId, req.params.id as string, req.user.role, content);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteFeedController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    await deleteFeedPost(req.user.userId, req.params.id as string, req.user.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
