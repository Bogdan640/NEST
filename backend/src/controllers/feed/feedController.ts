import { Response } from 'express';
import { retrieveAllPosts, createFeedPost } from '../../services/feed/feedService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getPostsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const executedPosts = await retrieveAllPosts();
    res.status(200).json(executedPosts);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Failed to retrieve feed posts' });
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
