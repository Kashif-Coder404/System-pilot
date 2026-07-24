import { useApp } from "@/context/provider";

import { useCallback } from "react";

export const useGetData = () => {
  const { setIsPCon, setData } = useApp();
  
  const fetchSystemData = useCallback(async () => {
    try {
      const res = await fetch("http://192.168.31.116:5000/data");
      const fetchedData = await res.json();
      setIsPCon(true);
      setData(fetchedData);
    } catch (error) {
      setIsPCon(false);
      // Removed alert here to prevent annoying popups on every failed polling tick
      console.log("PC is not connected!");
    }
  }, [setIsPCon, setData]);
  
  return fetchSystemData;
};
