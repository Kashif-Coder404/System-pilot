import CPU from "@/components/CPU";
import GPU from "@/components/GPU";
import RAM from "@/components/RAM";
import Network from "@/components/Network";
import Storage from "@/components/Storage";
import SystemInfo from "@/components/SystemInfo";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/provider";
import { useGetData } from "@/hooks/getData";
import { useEffect, useCallback } from "react";

export default function HomeScreen() {
  const { isRefreshed, setIsRefreshed } = useApp();
  const fetchSystemData = useGetData();

  const onRefresh = useCallback(async () => {
    setIsRefreshed(true);
    await fetchSystemData();
    setIsRefreshed(false);
  }, [fetchSystemData, setIsRefreshed]);

  useEffect(() => {
    fetchSystemData(); // Initial fetch

    const interval = setInterval(() => {
      fetchSystemData(); // Poll every second
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchSystemData]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshed}
            onRefresh={onRefresh}
            colors={["#38BDF8"]}
          />
        }
      >
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
