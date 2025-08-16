import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore, usePostsStore } from '../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SIZE = SCREEN_WIDTH / 3;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, logout } = useAuthStore();
  const { posts } = usePostsStore();
  
  const userPosts = posts.filter(post => post.userId === user?.id);

  const renderPost = ({ item }: { item: any }) => {
    const firstMedia = item.media[0];
    return (
      <TouchableOpacity style={styles.gridItem}>
        {firstMedia?.type === 'image' ? (
          <Image source={{ uri: firstMedia.uri }} style={styles.gridImage} />
        ) : firstMedia?.type === 'video' ? (
          <View style={styles.gridVideo}>
            <Image source={{ uri: firstMedia.thumbnailUri || firstMedia.uri }} style={styles.gridImage} />
            <Ionicons name="play-circle" size={30} color="#fff" style={styles.playIcon} />
          </View>
        ) : (
          <View style={styles.gridPlaceholder}>
            <Ionicons name="document-text" size={30} color="#666" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Auth' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user?.username}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.followers || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.following || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.displayName}>{user?.displayName}</Text>
            {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Ionicons name="grid" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="play-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="bookmark-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
  },
  userDetails: {
    marginBottom: 20,
  },
  displayName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    height: 36,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  shareButton: {
    width: 36,
    height: 36,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tab: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  grid: {
    paddingBottom: 20,
  },
  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridVideo: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;