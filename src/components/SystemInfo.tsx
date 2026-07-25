import { useApp } from "@/context/provider";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SystemInfo = () => {
  const {
    data,
    isFullScreen,
    setIsFullScreen,
    isSettingVisible,
    setIsSettingVisible,
  } = useApp();
  return (
    <View style={styles.container}>
      <StatusBar hidden={isFullScreen} />
      <Ionicons name="time-outline" size={14} color="#38BDF8" />
      <Text style={styles.valueText}>
        System Uptime: <Text style={styles.highlight}>{Number(data.uptime_hours).toFixed(2)}</Text>{" "}
        hours
      </Text>
      <View style={{ marginLeft: "auto", flexDirection: "row", gap: 20 }}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsFullScreen(!isFullScreen)}
        >
          <Ionicons
            name={isFullScreen ? "contract" : "expand"}
            size={16}
            color="#64748B"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSettingVisible(!isSettingVisible)}>
          <Ionicons name="settings-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
    marginBottom: 5,
  },
  valueText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  highlight: {
    color: "#38BDF8",
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default SystemInfo;
