import { useApp } from "@/context/provider";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getIP, storeIP } from "@/hooks/IPAdd";

const SettingsPanel = () => {
  const { isSettingVisible, setIsSettingVisible, IPAddress, setIPAddress } =
    useApp();
  const [ip, setIP] = useState<string>(IPAddress);
  const [isHide, setIsHide] = useState<boolean>(true);
  const handleStoringIP = async () => {
    await storeIP("IP_ADDRESS", ip);
    setIPAddress(ip);
    setIsSettingVisible(false);
  };
  return (
    <View style={[styles.container, !isSettingVisible && { display: "none" }]}>
      <TouchableOpacity onPress={() => setIsSettingVisible(!isSettingVisible)}>
        <Ionicons name="close-outline" size={20} color="#64748B" />
      </TouchableOpacity>
      <View>
        <Text style={styles.keyText}>IP Address</Text>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <TextInput
            style={styles.valueText}
            placeholder="Enter Your System IP Address"
            placeholderTextColor="#64748B"
            value={ip}
            onChangeText={setIP}
            keyboardType="default"
          />
          <TouchableOpacity
            disabled={!ip}
            onPress={handleStoringIP}
            style={!ip && { opacity: 0.6 }}
          >
            <Text style={styles.saveBtn}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ipDisplayContainer}>
          <Text style={styles.ipDisplayText}>
            {isHide ? "••••••••••" : IPAddress || "Not Set"}
          </Text>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setIsHide(!isHide)}
          >
            <Ionicons
              name={isHide ? "eye" : "eye-off"}
              size={18}
              color="#5178afff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#050505",
    zIndex: 10,
    padding: 20,
    gap: 15,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E2E8F0",
    letterSpacing: 1,
    marginBottom: 5,
  },
  valueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#38BDF8",
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveBtn: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  ipDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 15,
  },
  ipDisplayText: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
  },
  toggleBtn: {
    padding: 6,
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsPanel;
