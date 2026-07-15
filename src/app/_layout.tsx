import AlertPop from "@/components/AlertPop";
import NavBar from "@/components/NavBar";
import { AppProvider } from "@/context/provider";
import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Layout() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <NavBar title="System-Info" />
        <Slot />
      </View>
      <AlertPop />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
