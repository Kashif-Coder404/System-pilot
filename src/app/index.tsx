import CPU from "@/components/CPU";
import GPU from "@/components/GPU";
import RAM from "@/components/RAM";
import Network from "@/components/Network";
import Storage from "@/components/Storage";
import SystemInfo from "@/components/SystemInfo";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <SystemInfo />
        <CPU />
        <GPU />
        <RAM />
        <Storage />
        <Network />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 15,
  },
});
