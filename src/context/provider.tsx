import { createContext, ReactNode, useContext, useState } from "react";
interface AppContextType {
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
  shutdownTimer: number | null;
  setShutdownTimer: (val: number | null) => void;
  firmwareTimer: number | null;
  setFirmwareTimer: (val: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [adminKey, setAdminKey] = useState<string>(
    process.env.EXPO_PUBLIC_ADMIN_KEY || "",
  );
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"shutdown" | "firmware" | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<
    "shutdown" | "firmware" | null
  >(null);
  const [shutdownTimer, setShutdownTimer] = useState<number | null>(null);
  const [firmwareTimer, setFirmwareTimer] = useState<number | null>(null);
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
