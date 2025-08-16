import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Modal,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InfiniteCanvas from '../components/InfiniteCanvas';
import CreatePostModal from '../components/CreatePostModal';
import PostDetailModal from '../components/PostDetailModal';
import StoriesBar from '../components/StoriesBar';
import { Post } from '../types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuthStore, usePostsStore, useStoriesStore } from '../store';
import { mockPosts, mockStories } from '../utils/mockData';

const CanvasScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { setPosts } = usePostsStore();
  const { setStories } = useStoriesStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [createPostPosition, setCreatePostPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load mock data on mount
    setPosts(mockPosts);
    setStories(mockStories);
  }, []);

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
  };

  const handleEmptySpacePress = (x: number, y: number) => {
    setCreatePostPosition({ x, y });
    setShowCreatePost(true);
  };

  const handleCreatePost = (postData: any) => {
    // Create post at the selected position
    console.log('Creating post at', createPostPosition, postData);
    setShowCreatePost(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <InfiniteCanvas
        onPostPress={handlePostPress}
        onEmptySpacePress={handleEmptySpacePress}
      />

      {/* Stories Bar */}
      <SafeAreaView style={styles.storiesContainer}>
        <StoriesBar />
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="compass" size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.createButton]}
          onPress={() => setShowCreatePost(true)}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Messages')}
        >
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile', { userId: user?.id })}
        >
          <Ionicons name="person-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Side Controls */}
      <View style={styles.sideControls}>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialIcons name="layers" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialIcons name="grid-on" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialIcons name="filter-center-focus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreatePost(false)}
      >
        <CreatePostModal
          position={createPostPosition}
          onClose={() => setShowCreatePost(false)}
          onCreatePost={handleCreatePost}
        />
      </Modal>

      {/* Post Detail Modal */}
      <Modal
        visible={!!selectedPost}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedPost(null)}
      >
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  storiesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    padding: 10,
  },
  createButton: {
    backgroundColor: '#ff2d55',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideControls: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -100 }],
  },
  controlButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default CanvasScreen;