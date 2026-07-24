import AsyncStorage from "@react-native-async-storage/async-storage";

// Storing data (Convert objects/arrays to strings first)
const storeIP = async (key: string, value: string | "" | null) => {
  if (!value) return;
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

// Retrieving data
const getIP = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? value : null;
  } catch (e) {
    console.error("Failed to fetch data", e);
  }
};

export { storeIP, getIP };
