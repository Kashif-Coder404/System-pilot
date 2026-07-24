import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/provider";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedProgressBar from "./AnimatedProgressBar";
import MiniChart from "./MiniChart";

const StatItem = ({ label, value, unit, icon, color, animation }: any) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const speedRef = useRef(2000);

  // Update speed reference without interrupting the animation
  useEffect(() => {
    if (animation === "spin" && typeof value === "number" && value > 0) {
      const minRPM = 1200;
      const maxRPM = 1900;
      const slowestDuration = 2000;
      const fastestDuration = 150;

      const clampedRPM = Math.max(minRPM, Math.min(value, maxRPM));
      const ratio = (clampedRPM - minRPM) / (maxRPM - minRPM);

      // Interpolate the rotational speed (1/duration) for a natural acceleration curve
      const minSpeed = 1 / slowestDuration;
      const maxSpeed = 1 / fastestDuration;
      const currentSpeed = minSpeed + ratio * (maxSpeed - minSpeed);
      
      speedRef.current = 1 / currentSpeed;
    }
  }, [value, animation]);

  useEffect(() => {
    let active = true;
    let animLoop: Animated.CompositeAnimation | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    if (animation === "spin") {
      const spin = () => {
        if (!active) return;
        animValue.setValue(0);
        Animated.timing(animValue, {
          toValue: 1,
          duration: speedRef.current,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && active) {
            spin();
          }
        });
      };
      spin();
    } else if (animation === "pulse") {
      animLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      animLoop.start();
    } else if (animation === "spark") {
      const sparkAnim = () => {
        if (!active) return;
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
      };
      interval = setInterval(sparkAnim, 2000 + Math.random() * 1500); // Trigger every 2-3.5s
    }

    return () => {
      active = false;
      animValue.stopAnimation();
      if (animLoop) animLoop.stop();
      if (interval) clearInterval(interval);
    };
  }, [animation]);

  const animatedStyle =
    animation === "spin"
      ? {
          transform: [
            {
              rotate: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }
      : animation === "pulse"
        ? {
            opacity: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
            transform: [
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1.1],
                }),
              },
            ],
          }
        : animation === "spark"
          ? {
              opacity: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.4],
              }),
              transform: [
                {
                  scale: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.4],
                  }),
                },
                {
                  rotate: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "25deg"],
                  }),
                },
              ],
            }
          : {};

  return (
    <View style={styles.statBox}>
      <Animated.View style={[styles.statIcon, animatedStyle]}>
        <Ionicons name={icon} size={16} color={color} />
      </Animated.View>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>
          {value}
          <Text style={styles.statUnit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
};

const getTempColor = (temp: number) => {
  if (!temp) return "#94A3B8";
  if (temp < 50) return "#4ADE80";
  if (temp < 60) return "#FB923C";
  if (temp < 70) return "#F87171";
  if (temp < 80) return "#f52424ff";
  return "#da0303ff";
};

const CPU = () => {
  const { data } = useApp();
  const tempColor = getTempColor(data.cpu_temp);
  const isHot = data.cpu_temp >= 80;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="hardware-chip" size={20} color="#F472B6" />
          <Text style={styles.title}>Processor (CPU)</Text>
        </View>
        <MiniChart
          dataValue={data.cpu_load}
          maxVal={100}
          maxFontSize={10}
          color="#38BDF8"
          height={24}
          width={60}
        />
      </View>

      <View style={styles.heroSection}>
        <View style={styles.heroLeft}>
          <Text style={[styles.heroTemp, { color: tempColor }]}>
            {data.cpu_temp}
            <Text style={styles.heroUnit}>°C</Text>
          </Text>
          <Text style={styles.heroLabel}>Core Temperature</Text>
        </View>
        <MiniChart
          dataValue={data.cpu_temp}
          maxVal={100}
          maxFontSize={20}
          isTemp={true}
          height={70}
          width={130}
        />
      </View>

      <View style={styles.usageSection}>
        <View style={styles.usageHeader}>
          <Text style={styles.usageLabel}>Usage</Text>
          <Text style={styles.usageValue}>{data.cpu_usage}%</Text>
        </View>
        <AnimatedProgressBar progress={data.cpu_usage} color="#38BDF8" />
      </View>

      <View style={styles.grid}>
        <StatItem
          label="Load"
          value={data.cpu_load}
          unit="%"
          icon="bar-chart"
          color="#38BDF8"
        />
        <StatItem
          label="Power"
          value={data.cpu_power}
          unit="W"
          icon="flash"
          color="#FACC15"
          animation="spark"
        />
        <StatItem
          label="Clock"
          value={data.cpu_clock_ghz}
          unit="GHz"
          icon="speedometer"
          color="#A78BFA"
        />
        <StatItem
          label="Voltage"
          value={data.cpu_voltage}
          unit="V"
          icon="battery-charging"
          color="#4ADE80"
        />
        <StatItem
          label="Fan"
          value={data.cpu_fan_rpm}
          unit=" RPM"
          icon="aperture"
          color="#94A3B8"
          animation={data.cpu_fan_rpm > 0 ? "spin" : "spin"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    width: "100%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  heroSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  heroLeft: {},
  heroTemp: {
    fontSize: 56,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  heroUnit: {
    fontSize: 24,
    fontWeight: "600",
    color: "#64748B",
  },
  heroLabel: {
    color: "#64748B",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: -5,
  },
  usageSection: {
    marginBottom: 24,
  },
  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usageLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  usageValue: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "47%",
    backgroundColor: "#050505",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  statIcon: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 6,
    borderRadius: 8,
  },
  statLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statValue: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "bold",
  },
  statUnit: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "normal",
  },
});

export default CPU;
