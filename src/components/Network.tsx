import React, { useEffect, useRef } from 'react';
import { useApp } from "@/context/provider";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AnimatedArrow = ({ name, color }: { name: any, color: string }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 0, duration: 600, useNativeDriver: true })
      ])
    ).start();
  }, [animValue]);

  const animatedStyle = {
    opacity: animValue.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, name === 'arrow-up' ? -4 : 4] }) }]
  };

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={16} color={color} />
    </Animated.View>
  );
};

const Network = () => {
  const { data } = useApp();
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="globe-outline" size={20} color="#38BDF8" />
        <Text style={styles.title}>Network Traffic</Text>
      </View>
      
      <View style={styles.splitRow}>
        <View style={styles.statBox}>
          <View style={styles.statHeader}>
             <AnimatedArrow name="arrow-up" color="#38BDF8" />
             <Text style={styles.statLabel}>Upload</Text>
          </View>
          <Text style={styles.statValue}>{data.net_up_str && data.net_up_str !== "0" ? data.net_up_str : `${data.net_up_mbps?.toFixed(1)} Mbps`}</Text>
        </View>
        <View style={styles.statBox}>
          <View style={styles.statHeader}>
             <AnimatedArrow name="arrow-down" color="#4ADE80" />
             <Text style={styles.statLabel}>Download</Text>
          </View>
          <Text style={styles.statValue}>{data.net_down_str && data.net_down_str !== "0" ? data.net_down_str : `${data.net_down_mbps?.toFixed(1)} Mbps`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2235',
    borderRadius: 16,
    width: '100%',
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default Network;
