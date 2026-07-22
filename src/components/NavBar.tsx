import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/provider";
import sendSystemAction from "@/hooks/systemActions";
import wol from "react-native-wol";
const NavBar = ({ title = "Title" }: { title?: string }) => {
  const {
    adminKey,
    showAlert,
    setIsModalVisible,
    setPendingAction,
    alertType,
    shutdownTimer,
    setShutdownTimer,
    firmwareTimer,
    setFirmwareTimer,
    data,
    isFullScreen,
    isPCon,
  } = useApp();

  if (isFullScreen) return null;

  const [isfirmware, setIsFirmware] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const powerPulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Network up/down arrows animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Power button glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(powerPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(powerPulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const netPulseStyle = {
    opacity: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        translateY: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -2],
        }),
      },
    ],
  };

  const netPulseDownStyle = {
    opacity: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.3],
    }),
    transform: [
      {
        translateY: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 2],
        }),
      },
    ],
  };

  const powerGlowStyle = {
    opacity: powerPulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1],
    }),
    transform: [
      {
        scale: powerPulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1.1],
        }),
      },
    ],
  };

  const handleCancelAction = async (type: "shutdown" | "firmware") => {
    await sendSystemAction({ cancel: true, key: adminKey });
    if (type === "shutdown") setShutdownTimer(null);
    if (type === "firmware") setFirmwareTimer(null);
  };

  const handleShutdown = () => {
    if (!isPCon) {
      // Send Wake on LAN packet
      wol.wake("30:68:93:71:D0:68", "192.168.31.255");
      alert("Wake packet sent!");
      return;
    }

    if (shutdownTimer !== null) {
      handleCancelAction("shutdown");
    } else {
      setPendingAction("shutdown");
      setIsModalVisible(true);
    }
  };

  const handleFirmware = () => {
    if (firmwareTimer !== null) {
      handleCancelAction("firmware");
    } else {
      setPendingAction("firmware");
      setIsModalVisible(true);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (shutdownTimer !== null && shutdownTimer > 0) {
      interval = setInterval(() => {
        setShutdownTimer((prev) =>
          prev !== null && prev > 1 ? prev - 1 : null,
        );
      }, 1000);
    } else if (shutdownTimer === 0) {
      setShutdownTimer(null);
    }
    return () => clearInterval(interval);
  }, [shutdownTimer, setShutdownTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (firmwareTimer !== null && firmwareTimer > 0) {
      interval = setInterval(() => {
        setFirmwareTimer((prev) =>
          prev !== null && prev > 1 ? prev - 1 : null,
        );
      }, 1000);
    } else if (firmwareTimer === 0) {
      setFirmwareTimer(null);
    }
    return () => clearInterval(interval);
  }, [firmwareTimer, setFirmwareTimer]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.leftLinks}>
        {/* <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={20} color="#38BDF8" />
        </TouchableOpacity> */}
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.rightLinks}>
        {data && (
          <View style={styles.networkStats}>
            <View style={styles.networkRow}>
              <Animated.View style={netPulseStyle}>
                <Ionicons name="arrow-up" size={12} color="#4ADE80" />
              </Animated.View>
              <Text style={styles.networkText}>
                {data.net_up_str && data.net_up_str !== "0"
                  ? data.net_up_str
                  : `${data.net_up_mbps?.toFixed(1)} Mbps`}
              </Text>
            </View>
            <View style={styles.networkRow}>
              <Animated.View style={netPulseDownStyle}>
                <Ionicons name="arrow-down" size={12} color="#38BDF8" />
              </Animated.View>
              <Text style={styles.networkText}>
                {data.net_down_str && data.net_down_str !== "0"
                  ? data.net_down_str
                  : `${data.net_down_mbps?.toFixed(1)} Mbps`}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={handleFirmware}
            style={[
              styles.iconButton,
              firmwareTimer !== null && styles.firmwareActive,
            ]}
          >
            {firmwareTimer !== null ? (
              <Text style={styles.timerText}>Cancel ({firmwareTimer}s)</Text>
            ) : (
              <Ionicons
                name="bug-sharp"
                size={18}
                color="#A78BFA"
                disabled={isShutdown}
              />
            )}
            {showAlert && alertType === "firmware" && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>!</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShutdown}
            style={[
              styles.iconButton,
              shutdownTimer !== null && styles.shutdownActive,
            ]}
          >
            {shutdownTimer !== null ? (
              <Text style={styles.timerTextAlert}>
                Cancel ({shutdownTimer}s)
              </Text>
            ) : (
              <Animated.View style={powerGlowStyle}>
                <Ionicons
                  name="power"
                  size={18}
                  color={isPCon ? "#F87171" : "#9CA3AF"}
                  disabled={isfirmware}
                />
              </Animated.View>
            )}
            {showAlert && alertType === "shutdown" && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>!</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#050505",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  leftLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rightLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuButton: {
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    padding: 8,
    borderRadius: 12,
  },
  titleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  networkStats: {
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 4,
    justifyContent: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  networkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  networkText: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "bold",
    width: 45,
    textAlign: "right",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    minWidth: 40,
  },
  firmwareActive: {
    backgroundColor: "rgba(167, 139, 250, 0.15)",
    borderColor: "#A78BFA",
    paddingHorizontal: 12,
  },
  shutdownActive: {
    backgroundColor: "rgba(248, 113, 113, 0.15)",
    borderColor: "#F87171",
    paddingHorizontal: 12,
  },
  timerText: {
    color: "#A78BFA",
    fontSize: 13,
    fontWeight: "bold",
  },
  timerTextAlert: {
    color: "#F87171",
    fontSize: 13,
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#38BDF8",
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#050505",
  },
  badgeText: {
    color: "black",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NavBar;
