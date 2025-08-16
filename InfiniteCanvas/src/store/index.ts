import { create } from 'zustand';
import { User, Post, Story, CanvasViewport, Conversation } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  setPosts: (posts: Post[]) => void;
  setSelectedPost: (post: Post | null) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  selectedPost: null,
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),
  setPosts: (posts) => set({ posts }),
  setSelectedPost: (post) => set({ selectedPost: post }),
}));

interface CanvasState {
  viewport: CanvasViewport;
  isDragging: boolean;
  setViewport: (viewport: Partial<CanvasViewport>) => void;
  setIsDragging: (isDragging: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetViewport: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  viewport: { x: 0, y: 0, scale: 1 },
  isDragging: false,
  setViewport: (viewport) =>
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    })),
  setIsDragging: (isDragging) => set({ isDragging }),
  zoomIn: () =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        scale: Math.min(state.viewport.scale * 1.2, 3),
      },
    })),
  zoomOut: () =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        scale: Math.max(state.viewport.scale * 0.8, 0.5),
      },
    })),
  resetViewport: () => set({ viewport: { x: 0, y: 0, scale: 1 } }),
}));

interface StoriesState {
  stories: Story[];
  setStories: (stories: Story[]) => void;
  addStory: (story: Story) => void;
  markAsViewed: (storyId: string, userId: string) => void;
}

export const useStoriesStore = create<StoriesState>((set) => ({
  stories: [],
  setStories: (stories) => set({ stories }),
  addStory: (story) => set((state) => ({ stories: [story, ...state.stories] })),
  markAsViewed: (storyId, userId) =>
    set((state) => ({
      stories: state.stories.map((s) =>
        s.id === storyId
          ? { ...s, viewers: [...s.viewers, userId] }
          : s
      ),
    })),
}));

interface MessagesState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  conversations: [],
  activeConversation: null,
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
}));