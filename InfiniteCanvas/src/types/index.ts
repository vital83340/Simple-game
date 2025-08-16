export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  verified?: boolean;
  createdAt: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  thumbnailUri?: string;
  duration?: number;
  width?: number;
  height?: number;
}

export interface Post {
  id: string;
  userId: string;
  user?: User;
  content?: string;
  media: MediaItem[];
  position: {
    x: number;
    y: number;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  createdAt: Date;
  tags?: string[];
  mentions?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: Date;
  replies?: Comment[];
}

export interface Story {
  id: string;
  userId: string;
  user?: User;
  media: MediaItem;
  viewers: string[];
  createdAt: Date;
  expiresAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  media?: MediaItem;
  readBy: string[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface CanvasViewport {
  x: number;
  y: number;
  scale: number;
}