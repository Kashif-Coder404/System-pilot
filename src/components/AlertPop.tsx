import { useApp } from "@/context/provider";
import sendSystemAction from "@/hooks/systemActions";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AlertPop = () => {
  const {
    isModalVisible,
    setIsModalVisible,
    adminKey,
    pendingAction,
    setPendingAction,
    setShowAlert,
    setAlertType,
    setShutdownTimer,
    setFirmwareTimer,
  } = useApp();

  const [timerInput, setTimerInput] = useState<string>("");

  useEffect(() => {
    if (isModalVisible) {
      setTimerInput(pendingAction === "shutdown" ? "5" : "0");
    }
  }, [isModalVisible, pendingAction]);

  const executeAction = async (timing: number) => {
    const currentAction = pendingAction;
    setIsModalVisible(false);
    setPendingAction(null);

    // 1. User clicked confirm, let's check biometrics
    const isHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (isHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate to confirm ${currentAction}`,
        cancelLabel: "Cancel",
      });

      // If they cancel the fingerprint, stop here
      if (!result.success) {
        return;
      }
    }

    let data: any;
    if (currentAction === "shutdown") {
      data = await sendSystemAction({
        cancel: false,
        shutdown: true,
        restart: false,
        fw: false,
        timing,
        key: adminKey,
      });
    }
    if (currentAction === "firmware") {
      data = await sendSystemAction({
        cancel: false,
        restart: true,
        shutdown: false,
        fw: true,
        timing,
        key: adminKey,
      });
    }

    if (!data || !data?.success) {
      setShowAlert(true);
      setAlertType(currentAction);
    } else {
      setShowAlert(false);
      setAlertType(null);
      let parsedTime = 0;
      if (data.msg) {
        const match = data.msg.match(/(\d+)\s*sec/i) || data.msg.match(/(\d+)/);
        if (match) {
          parsedTime = parseInt(match[1], 10);
        }
      }
      if (parsedTime === 0 && timing !== 0) {
        parsedTime = timing;
      }

      if (currentAction === "shutdown") {
        setShutdownTimer(parsedTime);
      } else if (currentAction === "firmware") {
        setFirmwareTimer(parsedTime);
      }
    }
  };

  const handleConfirm = () => {
    const timing = parseInt(timerInput, 10) || 0;
    executeAction(timing);
  };

  const handleImmediate = () => {
    executeAction(0);
  };

  return (
    <SafeAreaView>
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              width: "80%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                marginBottom: 15,
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                color: "#333",
              }}
            >
              Are you sure you want to proceed with {pendingAction}?
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 20,
                fontSize: 16,
                textAlign: "center",
              }}
              keyboardType="numeric"
              placeholder="Timer (seconds)"
              value={timerInput}
              onChangeText={(text) =>
                setTimerInput(text.replace(/[^0-9]/g, ""))
              }
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: "#f0f0f0",
                }}
                onPress={() => {
                  setIsModalVisible(false);
                  setPendingAction(null);
                }}
              >
                <Text style={{ fontSize: 16, color: "#666" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: "#ff4444",
                }}
                onPress={handleConfirm}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                backgroundColor: "#ff8800",
                alignItems: "center",
              }}
              onPress={handleImmediate}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Immediate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AlertPop;
