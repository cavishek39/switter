export type Post = {
  id: string;
  created_at: Date;
  content: string;
  authorId: string;
  isEdited: boolean;
  likes: number;
  likedById: string;
};
