import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Post, Comment } from '../types';
import { useAuthStore, usePostsStore } from '../store';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const { user } = useAuthStore();
  const { updatePost } = usePostsStore();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    updatePost(post.id, {
      isLiked: !isLiked,
      likes: isLiked ? likesCount - 1 : likesCount + 1,
    });
  };

  const handleComment = () => {
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      userId: user?.id || '',
      user: user || undefined,
      content: comment.trim(),
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    setComments([...comments, newComment]);
    setComment('');
    updatePost(post.id, { comments: post.comments + 1 });
  };

  const renderMedia = () => {
    if (post.media.length === 0) return null;

    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.mediaContainer}
      >
        {post.media.map((media) => (
          <View key={media.id} style={styles.mediaItem}>
            {media.type === 'image' ? (
              <Image source={{ uri: media.uri }} style={styles.mediaFull} />
            ) : media.type === 'video' ? (
              <Video
                source={{ uri: media.uri }}
                style={styles.mediaFull}
                useNativeControls
                resizeMode="contain"
              />
            ) : (
              <View style={styles.audioPlayer}>
                <Ionicons name="musical-notes" size={60} color="#fff" />
                <Text style={styles.audioText}>Audio Player</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: item.user?.avatar || 'https://via.placeholder.com/32' }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.user?.username || 'Unknown'}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTime}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Post</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.userHeader}>
            <Image
              source={{ uri: post.user?.avatar || 'https://via.placeholder.com/48' }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{post.user?.username || 'Unknown'}</Text>
              <Text style={styles.timestamp}>
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {renderMedia()}

          {post.content && <Text style={styles.postContent}>{post.content}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? '#ff3b30' : '#fff'}
              />
              <Text style={styles.actionText}>{likesCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={28} color="#fff" />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={28} color="#fff" />
              <Text style={styles.actionText}>{post.shares}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        <View style={styles.commentInput}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/32' }}
            style={styles.commentInputAvatar}
          />
          <TextInput
            style={styles.commentTextInput}
            placeholder="Add a comment..."
            placeholderTextColor="#666"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={handleComment} disabled={!comment.trim()}>
            <Ionicons
              name="send"
              size={24}
              color={comment.trim() ? '#ff2d55' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#ff2d55',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mediaContainer: {
    height: 400,
  },
  mediaItem: {
    width: 375,
    height: 400,
  },
  mediaFull: {
    width: '100%',
    height: '100%',
  },
  audioPlayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  audioText: {
    color: '#fff',
    marginTop: 10,
  },
  postContent: {
    color: '#fff',
    fontSize: 16,
    padding: 16,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    color: '#fff',
    marginLeft: 4,
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentTextInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
});

export default PostDetailModal;