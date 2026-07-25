import { useApp } from "@/context/provider";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedProgressBar from "./AnimatedProgressBar";

const StatItem = ({ label, value, unit, icon, color }: any) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={16} color={color} style={styles.statIcon} />
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}>{unit}</Text>
      </Text>
    </View>
  </View>
);

const Storage = () => {
  const { data } = useApp();
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="server-outline" size={20} color="#10B981" />
        <Text style={styles.title}>Storage</Text>
      </View>

      {data.disks && data.disks.length > 0 ? (
        data.disks.map((disk, index) => (
          <View key={index} style={styles.diskSection}>
            <View style={styles.usageHeader}>
              <Text style={styles.usageLabel}>
                {disk.name.length > 20
                  ? disk.name.substring(0, 20) + "..."
                  : disk.name}
              </Text>
              <Text style={styles.usageValue}>
                {Number(disk.used_pct).toFixed(1)}%
              </Text>
            </View>
            <View style={{ marginBottom: 16 }}>
              <AnimatedProgressBar
                progress={disk.used_pct}
                color={index % 2 === 0 ? "#A78BFA" : "#F472B6"}
              />
            </View>
            <View style={styles.grid}>
              <StatItem
                label="Temp"
                value={disk.temp}
                unit="°C"
                icon="thermometer"
                color={disk.temp > 50 ? "#F87171" : "#4ADE80"}
              />
              <StatItem
                label="Read"
                value={disk.read_rate}
                unit=""
                icon="arrow-up-circle-outline"
                color="#38BDF8"
              />
              <StatItem
                label="Write"
                value={disk.write_rate}
                unit=""
                icon="download-outline"
                color="#FACC15"
              />
            </View>
          </View>
        ))
      ) : (
        <>
          <View style={styles.usageSection}>
            <View style={styles.usageHeader}>
              <Text style={styles.usageLabel}>NVMe Usage</Text>
              <Text style={styles.usageValue}>
                {Number(data.nvme_used_pct).toFixed(1)}%
              </Text>
            </View>
            <AnimatedProgressBar
              progress={data.nvme_used_pct}
              color="#A78BFA"
            />
          </View>

          <View style={styles.grid}>
            <StatItem
              label="NVMe Temp"
              value={data.nvme_temp}
              unit="°C"
              icon="thermometer"
              color="#F87171"
            />
          </View>
        </>
      )}
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
    marginBottom: 20,
    gap: 8,
  },
  title: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  usageSection: {
    marginBottom: 20,
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
    width: "100%",
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
  diskSection: {
    marginBottom: 20,
    backgroundColor: "#050505",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
});

export default Storage;
