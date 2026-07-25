import { useApp } from "@/context/provider";

import { useCallback, useRef } from "react";

export const useGetData = () => {
  const { setIsPCon, setData, IPAddress } = useApp();
  const isAlerted = useRef(false);
  
  const fetchSystemData = useCallback(async (manualRefresh = false) => {
    const url = `http://${IPAddress}:3000/api/system`;
    if (!IPAddress) {
      setIsPCon(false);
      return;
    }
    
    if (manualRefresh) {
      isAlerted.current = false;
    }

    try {
      const res = await fetch(url);
      const fetchedData = await res.json();
      setIsPCon(true);
      
      if (fetchedData.error) {
        if (!isAlerted.current || manualRefresh) {
          alert(`ERROR: \nPlease run the LibreHardwareMonitor.exe on PC!\nDetails: ${fetchedData.error}`);
          console.log("Error From LHM: ", fetchedData.error);
          isAlerted.current = true;
        }
      } else {
        setData(fetchedData);
        isAlerted.current = false;
      }
    } catch (error: any) {
      setIsPCon(false);
      // Removed alert here to prevent annoying popups on every failed polling tick
      console.log("PC is not connected!", "ERROR : ", error.message);
    }
  }, [IPAddress, setIsPCon, setData]);

  return fetchSystemData;
};
