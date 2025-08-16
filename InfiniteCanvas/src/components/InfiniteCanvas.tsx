import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useCanvasStore, usePostsStore } from '../store';
import PostNode from './PostNode';
import { Post } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface InfiniteCanvasProps {
  onPostPress: (post: Post) => void;
  onEmptySpacePress: (x: number, y: number) => void;
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  onPostPress,
  onEmptySpacePress,
}) => {
  const { viewport, setViewport } = useCanvasStore();
  const { posts } = usePostsStore();

  const translateX = useSharedValue(viewport.x);
  const translateY = useSharedValue(viewport.y);
  const scale = useSharedValue(viewport.scale);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchRef = useRef(null);
  const panRef = useRef(null);

  const updateViewport = useCallback(
    (x: number, y: number, s: number) => {
      setViewport({ x, y, scale: s });
    },
    [setViewport]
  );

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      runOnJS(updateViewport)(translateX.value, translateY.value, scale.value);
    },
  });

  const pinchGestureEvent = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startScale: number }
  >({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = Math.max(0.5, Math.min(3, ctx.startScale * event.scale));
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      runOnJS(updateViewport)(translateX.value, translateY.value, scale.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleCanvasPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const canvasX = (locationX - translateX.value) / scale.value;
    const canvasY = (locationY - translateY.value) / scale.value;
    onEmptySpacePress(canvasX, canvasY);
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={panGestureEvent}
        simultaneousHandlers={[pinchRef]}
      >
        <Animated.View style={StyleSheet.absoluteFillObject}>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={pinchGestureEvent}
            simultaneousHandlers={[panRef]}
          >
            <Animated.View
              style={[styles.canvas, animatedStyle]}
              onTouchEnd={handleCanvasPress}
            >
              {/* Grid background */}
              <View style={styles.gridBackground}>
                {Array.from({ length: 50 }).map((_, i) => (
                  <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: i * 100 }]} />
                ))}
                {Array.from({ length: 50 }).map((_, i) => (
                  <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * 100 }]} />
                ))}
              </View>

              {/* Posts */}
              {posts.map((post) => (
                <PostNode
                  key={post.id}
                  post={post}
                  onPress={() => onPostPress(post)}
                />
              ))}
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            scale.value = withSpring(Math.min(scale.value * 1.2, 3));
            updateViewport(translateX.value, translateY.value, scale.value * 1.2);
          }}
        >
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            scale.value = withSpring(Math.max(scale.value * 0.8, 0.5));
            updateViewport(translateX.value, translateY.value, scale.value * 0.8);
          }}
        >
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  canvas: {
    width: SCREEN_WIDTH * 5,
    height: SCREEN_HEIGHT * 5,
  },
  gridBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  horizontalLine: {
    width: '100%',
    height: 1,
  },
  verticalLine: {
    height: '100%',
    width: 1,
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
  zoomButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  zoomButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default InfiniteCanvas;