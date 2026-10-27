import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { colors, styles } from "@/theme";

export default function HomeScreen() {
  return (
    <Screen title="Trang chủ">
      <Text style={styles.bodyText}>
        Khám phá hiện vật và nghe những câu chuyện lịch sử.
      </Text>
      <View style={homeStyles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/translate")}
          style={({ pressed }) => [
            homeStyles.action,
            pressed && homeStyles.pressed,
          ]}
        >
          <Text style={homeStyles.actionTitle}>Dịch cụm từ</Text>
          <Text style={homeStyles.actionDescription}>
            Thử các cụm từ tiếng Anh và tiếng Việt thông dụng.
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/translation-history")}
          style={({ pressed }) => [
            homeStyles.action,
            pressed && homeStyles.pressed,
          ]}
        >
          <Text style={homeStyles.actionTitle}>Lịch sử bản dịch</Text>
          <Text style={homeStyles.actionDescription}>
            Xem các cụm từ đã dịch trên thiết bị này.
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const homeStyles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 24,
  },
  action: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  actionTitle: {
    marginBottom: 6,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  actionDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
