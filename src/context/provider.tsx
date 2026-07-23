import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SystemDataType, AppContextType } from "@/types/types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isPCon, setIsPCon] = useState(false);
  const [data, setData] = useState<SystemDataType>({
    cpu_usage: 0,
    ram_usage: 0,
    disk_usage: 0,
    net_up_mbps: 0,
    net_down_mbps: 0,
    uptime_hours: 0,
    cpu_temp: 0,
    cpu_load: 0,
    cpu_power: 0,
    cpu_clock_ghz: 0,
    cpu_voltage: 0,
    gpu_temp: 0,
    gpu_hotspot: 0,
    gpu_load: 0,
    gpu_power: 0,
    gpu_vram_used: 0,
    gpu_vram_total: 0,
    gpu_fan_rpm: 0,
    gpu_fan_pct: 0,
    cpu_fan_rpm: 0,
    cpu_fan_pct: 0,
    ram_used_gb: 0,
    ram_avail_gb: 0,
    nvme_temp: 0,
    nvme_used_pct: 0,
    net_up_str: "0",
    net_down_str: "0",
  });
  const getData = async () => {
    try {
      const res: any = await fetch("http://192.168.31.116:5000/data");
      const fetchedData: any = await res.json();
      setIsPCon(true);
      setData(fetchedData);
    } catch (error) {
      setIsPCon(false);
      alert("PC is not connected!");
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    getData();

    // Then poll every 2 seconds
    const interval = setInterval(() => {
      getData();
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);
  const [adminKey, setAdminKey] = useState<string>(
    process.env.EXPO_PUBLIC_ADMIN_KEY || "",
  );
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"shutdown" | "firmware" | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<
    "shutdown" | "firmware" | null
  >(null);
  const [shutdownTimer, setShutdownTimer] = useState<number | null>(null);
  const [firmwareTimer, setFirmwareTimer] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  return (
    <AppContext.Provider
      value={{
        adminKey,
        setAdminKey,
        showAlert,
        setShowAlert,
        alertType,
        setAlertType,
        isModalVisible,
        setIsModalVisible,
        pendingAction,
        setPendingAction,
        shutdownTimer,
        setShutdownTimer,
        firmwareTimer,
        setFirmwareTimer,
        data,
        setData,
        isFullScreen,
        setIsFullScreen,
        isPCon,
        setIsPCon,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
