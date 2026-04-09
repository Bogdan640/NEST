import { Response } from 'express';
import { retrieveAllPosts, createFeedPost, updateFeedPost, deleteFeedPost, retrievePostById } from '../../services/feed/feedService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getPostsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;
    
    const executedPosts = await retrieveAllPosts(search, sortBy, sortOrder);
    res.status(200).json(executedPosts);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Failed to retrieve feed posts' });
  }
};

export const getPostByIdController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const executedRetrieval = await retrievePostById(id as string);
    res.status(200).json(executedRetrieval);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Post untraceable') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to retrieve isolated post' });
  }
};

export const createPostController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { content, imageUrl } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Post content is necessary' });
    return;
  }

  try {
    const executedCreation = await createFeedPost(req.user.userId, content, imageUrl);
    res.status(201).json(executedCreation);
  } catch (executionError: unknown) {
    if (executionError instanceof Error && executionError.message === 'Daily post limit exceeded') {
      res.status(429).json({ error: executionError.message });
      return;
    }
    res.status(500).json({ error: 'Failed to create feed post' });
  }
};

export const updateFeedController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;
  const { content } = req.body;

  if (!id || !content) {
    res.status(400).json({ error: 'Payload configuration missing parameters' });
    return;
  }

  try {
    const executedUpdate = await updateFeedPost(req.user.userId, id as string, req.user.role, content);
    res.status(200).json(executedUpdate);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Post untraceable') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Unauthorized operational jurisdiction') {
        res.status(403).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: 'Feed synchronization failed' });
  }
};

export const deleteFeedController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;

  try {
    await deleteFeedPost(req.user.userId, id as string, req.user.role);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Post untraceable') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Unauthorized operational jurisdiction') {
        res.status(403).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: 'Feed synchronization failed' });
  }
};
