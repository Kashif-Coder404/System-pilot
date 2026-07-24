import GPU from "@/components/GPU";
import { Dispatch, SetStateAction } from "react";

export interface AppContextType {
  IPAddress: string;
  setIPAddress: (ip: string) => void;
  isSettingVisible: boolean;
  setIsSettingVisible: (show: boolean) => void;
  adminKey: string;
  setAdminKey: (key: string) => void;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  alertType: "shutdown" | "firmware" | null;
  setAlertType: (type: "shutdown" | "firmware" | null) => void;
  isModalVisible: boolean;
  setIsModalVisible: (show: boolean) => void;
  pendingAction: "shutdown" | "firmware" | null;
  setPendingAction: (action: "shutdown" | "firmware" | null) => void;
  isPCon: boolean;
  setIsPCon: (show: boolean) => void;
  shutdownTimer: number | null;
  setShutdownTimer: Dispatch<SetStateAction<number | null>>;
  firmwareTimer: number | null;
  setFirmwareTimer: Dispatch<SetStateAction<number | null>>;
  data: SystemDataType;
  setData: Dispatch<SetStateAction<SystemDataType>>;
  isFullScreen: boolean;
  setIsFullScreen: Dispatch<SetStateAction<boolean>>;
  isRefreshed: boolean;
  setIsRefreshed: Dispatch<SetStateAction<boolean>>;
}
export type SystemDataType = OthersInfoType & GPU & CPU;
interface OthersInfoType {
  ram_usage: number;
  disk_usage: number;
  net_up_mbps: number;
  net_down_mbps: number;
  uptime_hours: number;
  ram_used_gb: number;
  ram_avail_gb: number;
  nvme_temp: number;
  nvme_used_pct: number;
  net_up_str: string | null;
  net_down_str: string | null;
}
interface CPU {
  cpu_usage: number;
  cpu_temp: number;
  cpu_load: number;
  cpu_power: number;
  cpu_clock_ghz: number;
  cpu_voltage: number;
  cpu_fan_rpm: number;
  cpu_fan_pct: number;
}
interface GPU {
  gpu_temp: number;
  gpu_hotspot: number;
  gpu_load: number;
  gpu_power: number;
  gpu_vram_used: number;
  gpu_vram_total: number;
  gpu_fan_rpm: number;
  gpu_fan_pct: number;
}
export type Shutdown = {
  cancel?: false;
  shutdown: true;
  restart?: false;
  fw?: false;
  force?: boolean;
  timing?: number;
  key: string;
  isAdministrator: boolean;
  ipAddress: string;
};
export type Firmware = {
  cancel?: false;
  shutdown?: false;
  restart: true;
  fw: true;
  force?: false;
  timing?: number;
  key: string;
  isAdministrator: boolean;
  ipAddress: string;
};
export type Cancel = {
  cancel: true;
  shutdown?: false;
  restart?: false;
  fw?: false;
  force?: false;
  timing?: undefined;
  key: string;
  isAdministrator: boolean;
  ipAddress: string;
};

//Optional (currently not using it!)
export interface ActionData {
  success?: boolean;
  returncode?: number;
  output?: string;
  msg?: string;
  error?: string;
}
