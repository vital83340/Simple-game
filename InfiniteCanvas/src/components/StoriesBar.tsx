import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStoriesStore, useAuthStore } from '../store';
import { Story } from '../types';
import StoryViewer from './StoryViewer';

const StoriesBar = () => {
  const { stories } = useStoriesStore();
  const { user } = useAuthStore();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleStoryPress = (story: Story) => {
    setSelectedStory(story);
  };

  const handleAddStory = () => {
    // Open camera or media picker for story creation
    console.log('Add story');
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Add Story Button */}
        <TouchableOpacity style={styles.storyItem} onPress={handleAddStory}>
          <View style={styles.addStoryContainer}>
            <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/60' }}
              style={styles.avatar}
            />
            <View style={styles.addButton}>
              <Ionicons name="add" size={20} color="#fff" />
            </View>
          </View>
          <Text style={styles.storyText}>Your Story</Text>
        </TouchableOpacity>

        {/* Stories */}
        {stories.map((story) => {
          const hasViewed = story.viewers.includes(user?.id || '');
          return (
            <TouchableOpacity
              key={story.id}
              style={styles.storyItem}
              onPress={() => handleStoryPress(story)}
            >
              <LinearGradient
                colors={hasViewed ? ['#666', '#666'] : ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
                style={styles.storyRing}
              >
                <View style={styles.storyInner}>
                  <Image
                    source={{ uri: story.user?.avatar || 'https://via.placeholder.com/60' }}
                    style={styles.avatar}
                  />
                </View>
              </LinearGradient>
              <Text style={styles.storyText} numberOfLines={1}>
                {story.user?.username || 'Unknown'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Story Viewer Modal */}
      <Modal
        visible={!!selectedStory}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setSelectedStory(null)}
      >
        {selectedStory && (
          <StoryViewer
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  storyItem: {
    marginHorizontal: 6,
    alignItems: 'center',
  },
  addStoryContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2,
  },
  storyInner: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 31,
    padding: 2,
  },
  storyText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    width: 70,
    textAlign: 'center',
  },
});

export default StoriesBar;