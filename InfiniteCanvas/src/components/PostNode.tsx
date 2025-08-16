import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { Post } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface PostNodeProps {
  post: Post;
  onPress: () => void;
}

const PostNode: React.FC<PostNodeProps> = ({ post, onPress }) => {
  const renderMedia = () => {
    if (post.media.length === 0) return null;

    const firstMedia = post.media[0];

    if (firstMedia.type === 'image') {
      return (
        <Image
          source={{ uri: firstMedia.uri }}
          style={styles.mediaPreview}
          resizeMode="cover"
        />
      );
    } else if (firstMedia.type === 'video') {
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: firstMedia.uri }}
            style={styles.mediaPreview}
            resizeMode="cover"
            shouldPlay={false}
            isLooping={false}
            isMuted={true}
          />
          <View style={styles.playOverlay}>
            <Ionicons name="play-circle" size={40} color="white" />
          </View>
        </View>
      );
    } else if (firstMedia.type === 'audio') {
      return (
        <View style={styles.audioContainer}>
          <Ionicons name="musical-notes" size={40} color="white" />
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          left: post.position.x,
          top: post.position.y,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: post.user?.avatar || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user?.username || 'Unknown'}</Text>
          <Text style={styles.timestamp}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {renderMedia()}

      {post.content && (
        <Text style={styles.content} numberOfLines={3}>
          {post.content}
        </Text>
      )}

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={post.isLiked ? '#ff3b30' : '#ccc'}
          />
          <Text style={styles.statText}>{post.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={20} color="#ccc" />
          <Text style={styles.statText}>{post.comments}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="share-outline" size={20} color="#ccc" />
          <Text style={styles.statText}>{post.shares}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 280,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  videoContainer: {
    position: 'relative',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  audioContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  content: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 5,
  },
});

export default PostNode;