import { useApp } from "@/context/provider";
import sendSystemAction from "@/hooks/systemActions";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ActionData {
  success?: boolean;
  returncode?: number;
  output?: string;
  msg?: string;
  error?: string;
}

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
  } = useApp();
  const [isfirmware, setIsFirmware] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);

  const handleCancelAction = async (type: "shutdown" | "firmware") => {
    await sendSystemAction({ cancel: true, key: adminKey });
    if (type === "shutdown") setShutdownTimer(null);
    if (type === "firmware") setFirmwareTimer(null);
  };

  const handleShutdown = () => {
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
    let interval: NodeJS.Timeout;
    if (shutdownTimer !== null && shutdownTimer > 0) {
      interval = setInterval(() => {
        setShutdownTimer(prev => (prev !== null && prev > 1 ? prev - 1 : null));
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
        setFirmwareTimer(prev => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    } else if (firmwareTimer === 0) {
       setFirmwareTimer(null);
    }
    return () => clearInterval(interval);
  }, [firmwareTimer, setFirmwareTimer]);


  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.leftLinks}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
      <View style={styles.rightLinks}>
        <TouchableOpacity onPress={handleFirmware} style={styles.iconWrapper}>
          {firmwareTimer !== null ? (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Cancel ({firmwareTimer}s)</Text>
          ) : (
            <Ionicons
              name="bug-sharp"
              size={24}
              color="white"
              disabled={isShutdown}
            />
          )}
          {showAlert && alertType === "firmware" && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>!</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShutdown} style={styles.iconWrapper}>
          {shutdownTimer !== null ? (
            <Text style={{ color: '#ff4444', fontSize: 16, fontWeight: 'bold' }}>Cancel ({shutdownTimer}s)</Text>
          ) : (
            <Ionicons
              name="power"
              size={24}
              style={styles.powerIcon}
              disabled={isfirmware}
            />
          )}
          {showAlert && alertType === "shutdown" && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>!</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgb(54, 112, 118)",
    paddingHorizontal: 20,
  },
  leftLinks: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  rightLinks: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  titleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  powerIcon: {
    color: "#ff4444",
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#ffcc00",
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgb(54, 112, 118)",
  },
  badgeText: {
    color: "black",
    fontSize: 9,
    fontWeight: "bold",
    lineHeight: 10,
    textAlign: "center",
  },
});

export default NavBar;
