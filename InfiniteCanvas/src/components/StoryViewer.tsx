import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Story } from '../types';
import { useStoriesStore, useAuthStore } from '../store';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose }) => {
  const { markAsViewed } = useStoriesStore();
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Mark story as viewed
    if (user?.id) {
      markAsViewed(story.id, user.id);
    }

    // Start progress animation
    startProgress();

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const startProgress = () => {
    const duration = story.media.type === 'video' ? 15000 : 5000; // 15s for video, 5s for image
    const interval = 50;
    const increment = (interval / duration) * 100;

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose();
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const pauseProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setIsPaused(true);
  };

  const resumeProgress = () => {
    setIsPaused(false);
    startProgress();
  };

  const handleReply = () => {
    if (replyText.trim()) {
      // Send reply
      console.log('Sending reply:', replyText);
      setReplyText('');
      setShowReply(false);
    }
  };

  const timeAgo = () => {
    const now = new Date();
    const storyTime = new Date(story.createdAt);
    const diff = now.getTime() - storyTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    return `${hours}h ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.userInfo} onPress={onClose}>
            <Image
              source={{ uri: story.user?.avatar || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>{story.user?.username || 'Unknown'}</Text>
              <Text style={styles.timestamp}>{timeAgo()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Media */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.mediaContainer}
          onPressIn={pauseProgress}
          onPressOut={resumeProgress}
        >
          {story.media.type === 'image' ? (
            <Image
              source={{ uri: story.media.uri }}
              style={styles.media}
              resizeMode="contain"
            />
          ) : (
            <Video
              source={{ uri: story.media.uri }}
              style={styles.media}
              shouldPlay={!isPaused}
              isLooping={false}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        {/* Footer */}
        {!showReply ? (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => setShowReply(true)}
            >
              <Text style={styles.replyButtonText}>Send message</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="paper-plane-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Reply to story..."
              placeholderTextColor="#999"
              value={replyText}
              onChangeText={setReplyText}
              autoFocus
            />
            <TouchableOpacity onPress={handleReply}>
              <Ionicons
                name="send"
                size={24}
                color={replyText.trim() ? '#007aff' : '#666'}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Viewers count */}
        <View style={styles.viewersContainer}>
          <Ionicons name="eye-outline" size={16} color="#fff" />
          <Text style={styles.viewersText}>{story.viewers.length}</Text>
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
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 8,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#ccc',
    fontSize: 12,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  replyButton: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  replyInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    paddingHorizontal: 16,
    color: '#fff',
    marginRight: 12,
  },
  viewersContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
});

export default StoryViewer;