export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  authorId: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

export interface UpdatePostRequest {
  content?: string;
  imageUrl?: string;
}
