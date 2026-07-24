import { useApp } from "@/context/provider";

import { useCallback, useState } from "react";

export const useGetData = () => {
  const { setIsPCon, setData, IPAddress } = useApp();
  const [isAlerted, setIsAlerted] = useState(false);
  
  const fetchSystemData = useCallback(async (manualRefresh = false) => {
    const url = `http://${IPAddress}:5000/data`;
    if (!IPAddress) {
      setIsPCon(false);
      return;
    }
    
    if (manualRefresh) {
      setIsAlerted(false);
    }

    try {
      const res = await fetch(url);
      const fetchedData = await res.json();
      setIsPCon(true);
      setData(fetchedData);

      if (!fetchedData["LHM ERROR"]) {
        if (!isAlerted || manualRefresh) {
          alert(`LHM ERROR: \nPlease run the LibreHardwareMonitor.exe on PC!`);
          console.log("Error From LHM: ", fetchedData.lhm_error_msg);
          setIsAlerted(true);
        }
      } else {
        setIsAlerted(false);
      }
    } catch (error: any) {
      setIsPCon(false);
      // Removed alert here to prevent annoying popups on every failed polling tick
      console.log("PC is not connected!", "ERROR : ", error.message);
    }
  }, [IPAddress, setIsPCon, setData]);

  return fetchSystemData;
};
