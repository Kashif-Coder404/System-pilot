import { useApp } from "@/context/provider";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedProgressBar from "./AnimatedProgressBar";

const RAM = () => {
  const { data } = useApp();
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="hardware-chip" size={20} color="#FACC15" />
        <Text style={styles.title}>Memory (RAM)</Text>
      </View>
      
      <View style={styles.usageContainer}>
        <View style={styles.usageHeader}>
          <Text style={styles.usageLabel}>Usage</Text>
          <Text style={styles.usageValue}>{data.ram_usage}%</Text>
        </View>
        <AnimatedProgressBar progress={data.ram_usage} color="#FACC15" />
      </View>
      
      <View style={styles.splitRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Used</Text>
          <Text style={styles.statValue}>{data.ram_used_gb} <Text style={styles.statUnit}>GB</Text></Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Available</Text>
          <Text style={styles.statValue}>{data.ram_avail_gb} <Text style={styles.statUnit}>GB</Text></Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  title: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  usageContainer: {
    marginBottom: 20,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  usageValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#050505',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statUnit: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'normal',
  }
});

export default RAM;
