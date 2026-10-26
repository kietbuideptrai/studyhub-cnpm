import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

const tabSymbols: Record<string, string> = {
  index: "⌂",
  artifacts: "▤",
  scan: "QR",
  favorites: "♡",
  profile: "●",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const isScannerTab = route.name === "scan";

        return {
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, focused }) =>
            isScannerTab ? (
              <View style={styles.scanButton}>
                <Text style={styles.scanButtonText}>{tabSymbols.scan}</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.tabSymbol,
                  { color },
                  focused && styles.tabSymbolFocused,
                ]}
              >
                {tabSymbols[route.name] ?? ""}
              </Text>
            ),
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Trang chủ" }} />
      <Tabs.Screen name="artifacts" options={{ title: "Hiện vật" }} />
      <Tabs.Screen name="scan" options={{ title: "Quét QR" }} />
      <Tabs.Screen name="favorites" options={{ title: "Yêu thích" }} />
      <Tabs.Screen name="profile" options={{ title: "Cá nhân" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 76,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopColor: colors.border,
    backgroundColor: colors.paper,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  tabSymbol: {
    width: 28,
    height: 28,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 23,
  },
  tabSymbolFocused: {
    fontWeight: "700",
  },
  scanButton: {
    width: 58,
    height: 58,
    marginTop: -25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.paper,
    borderRadius: 32,
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: "#18392E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  scanButtonText: {
    color: colors.paper,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
