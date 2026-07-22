import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const AnimatedProgressBar = ({ progress = 0, color = "#38BDF8" }: { progress: number, color?: string }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: '#050505',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  }
});

export default AnimatedProgressBar;
