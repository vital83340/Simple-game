import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { MediaItem } from '../types';
import { useAuthStore, usePostsStore } from '../store';

interface CreatePostModalProps {
  position: { x: number; y: number };
  onClose: () => void;
  onCreatePost: (postData: any) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  position,
  onClose,
  onCreatePost,
}) => {
  const { user } = useAuthStore();
  const { addPost } = usePostsStore();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        type: asset.type === 'video' ? 'video' : 'image',
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        duration: asset.duration,
      };
      setMedia([...media, newMedia]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        type: 'image',
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      };
      setMedia([...media, newMedia]);
    }
  };

  const removeMedia = (id: string) => {
    setMedia(media.filter((m) => m.id !== id));
  };

  const handlePost = async () => {
    if (!content.trim() && media.length === 0) {
      Alert.alert('Error', 'Please add some content or media to your post');
      return;
    }

    setIsUploading(true);

    try {
      const newPost = {
        id: Date.now().toString(),
        userId: user?.id || '',
        user: user || undefined,
        content: content.trim(),
        media,
        position,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        createdAt: new Date(),
        tags: extractHashtags(content),
        mentions: extractMentions(content),
      };

      addPost(newPost);
      onCreatePost(newPost);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const extractHashtags = (text: string): string[] => {
    const regex = /#\w+/g;
    return text.match(regex) || [];
  };

  const extractMentions = (text: string): string[] => {
    const regex = /@\w+/g;
    return text.match(regex) || [];
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Post</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={isUploading}
            style={[styles.postButton, isUploading && styles.postButtonDisabled]}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>{user?.displayName || 'Unknown'}</Text>
              <Text style={styles.positionText}>
                Position: ({Math.round(position.x)}, {Math.round(position.y)})
              </Text>
            </View>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#666"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={500}
          />

          {media.length > 0 && (
            <ScrollView
              horizontal
              style={styles.mediaContainer}
              showsHorizontalScrollIndicator={false}
            >
              {media.map((item) => (
                <View key={item.id} style={styles.mediaItem}>
                  {item.type === 'image' ? (
                    <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                  ) : (
                    <Video
                      source={{ uri: item.uri }}
                      style={styles.mediaPreview}
                      shouldPlay={false}
                      isLooping={false}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMedia(item.id)}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={24} color="#fff" />
              <Text style={styles.mediaButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
              <Text style={styles.mediaButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton}>
              <MaterialIcons name="videocam" size={24} color="#fff" />
              <Text style={styles.mediaButtonText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton}>
              <MaterialIcons name="audiotrack" size={24} color="#fff" />
              <Text style={styles.mediaButtonText}>Audio</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  postButton: {
    backgroundColor: '#ff2d55',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  positionText: {
    color: '#666',
    fontSize: 12,
  },
  textInput: {
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
  },
  mediaContainer: {
    marginBottom: 16,
  },
  mediaItem: {
    marginRight: 10,
    position: 'relative',
  },
  mediaPreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  mediaButton: {
    alignItems: 'center',
  },
  mediaButtonText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CreatePostModal;