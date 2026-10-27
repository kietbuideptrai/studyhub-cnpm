import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { useLanguage } from "@/context/LanguageContext";
import { useLocalData } from "@/context/LocalDataContext";
import type { FontSize } from "@/context/LocalDataContext";
import { useArtifacts } from "@/hooks/useArtifacts";
import { languages } from "@/utils/languages";
import { colors } from "@/theme";

export default function ProfileScreen() {
  const { language, setLanguage, storageError } = useLanguage();
  const {
    fontSize,
    historySlugs,
    setFontSize,
    storageError: localStorageError,
  } = useLocalData();
  const { state, retry } = useArtifacts(language, "");
  const artifactsBySlug = useMemo(
    () =>
      state.status === "success"
        ? new Map(state.data.map((artifact) => [artifact.slug, artifact]))
        : new Map(),
    [state],
  );
  const history = historySlugs
    .map((slug) => artifactsBySlug.get(slug))
    .filter((artifact) => artifact !== undefined);

  return (
    <Screen title="Cá nhân">
      <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
      <Text style={styles.description}>
        Chọn ngôn ngữ dùng cho nội dung hiện vật.
      </Text>
      <View style={styles.languageList}>
        {languages.map((item) => {
          const isSelected = item.code === language;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              key={item.code}
              onPress={() => void setLanguage(item.code)}
              style={({ pressed }) => [
                styles.languageOption,
                isSelected && styles.selectedLanguageOption,
                pressed && styles.languageOptionPressed,
              ]}
            >
              <Text
                style={[
                  styles.languageLabel,
                  isSelected && styles.selectedLanguageLabel,
                ]}
              >
                {item.label}
              </Text>
              <Text style={styles.radioMark}>{isSelected ? "●" : "○"}</Text>
            </Pressable>
          );
        })}
      </View>
      {storageError ? (
        <Text style={styles.storageError} accessibilityRole="alert">
          {storageError}
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>Cỡ chữ</Text>
      <Text style={styles.description}>
        Điều chỉnh cỡ chữ trong nội dung thuyết minh.
      </Text>
      <View style={styles.fontSizeOptions}>
        {([
          ["small", "Nhỏ"],
          ["medium", "Vừa"],
          ["large", "Lớn"],
        ] as const).map(([value, label]) => {
          const isSelected = fontSize === value;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              key={value}
              onPress={() => setFontSize(value as FontSize)}
              style={({ pressed }) => [
                styles.fontSizeOption,
                isSelected && styles.selectedFontSizeOption,
                pressed && styles.languageOptionPressed,
              ]}
            >
              <Text
                style={[
                  styles.fontSizeLabel,
                  isSelected && styles.selectedLanguageLabel,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Công cụ học tập</Text>
      <View style={styles.learningActions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/translate")}
          style={({ pressed }) => [
            styles.learningAction,
            pressed && styles.languageOptionPressed,
          ]}
        >
          <Text style={styles.learningActionTitle}>Dịch cụm từ</Text>
          <Text style={styles.learningActionDescription}>
            Bản demo Anh–Việt với các cụm từ thông dụng.
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/translation-history")}
          style={({ pressed }) => [
            styles.learningAction,
            pressed && styles.languageOptionPressed,
          ]}
        >
          <Text style={styles.learningActionTitle}>Lịch sử bản dịch</Text>
          <Text style={styles.learningActionDescription}>
            Xem hoặc xóa các bản dịch đã lưu.
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Lịch sử đã xem</Text>
      {localStorageError ? (
        <Text style={styles.storageError} accessibilityRole="alert">
          {localStorageError}
        </Text>
      ) : null}
      {historySlugs.length === 0 ? (
        <EmptyState
          title="Chưa có hiện vật đã xem"
          message="Các hiện vật bạn đã mở sẽ xuất hiện tại đây."
        />
      ) : state.status === "loading" ? (
        <View style={styles.historyFeedback}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.description}>Đang tải lịch sử...</Text>
        </View>
      ) : state.status === "error" ? (
        <View style={styles.historyFeedback}>
          <Text style={styles.storageError} accessibilityRole="alert">
            {state.error.message}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={retry}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonLabel}>Thử lại</Text>
          </Pressable>
        </View>
      ) : history.length === 0 ? (
        <EmptyState
          title="Không có lịch sử bằng ngôn ngữ này"
          message="Các hiện vật trong lịch sử chưa có bản dịch bằng ngôn ngữ đang chọn."
        />
      ) : (
        <View style={styles.historyList}>
          {history.map((artifact) => (
            <Pressable
              accessibilityHint="Mở lại thuyết minh hiện vật"
              accessibilityRole="button"
              key={artifact.slug}
              onPress={() =>
                router.push({
                  pathname: "/artifacts/[slug]",
                  params: { slug: artifact.slug },
                })
              }
              style={({ pressed }) => [
                styles.historyItem,
                pressed && styles.languageOptionPressed,
              ]}
            >
              <Text style={styles.historyTitle}>{artifact.title}</Text>
              <Text style={styles.historySummary} numberOfLines={2}>
                {artifact.summary}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 6,
    color: colors.ink,
    fontSize: 17,
    fontWeight: "700",
  },
  description: {
    marginBottom: 16,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  languageList: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  languageOption: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  selectedLanguageOption: {
    backgroundColor: colors.highlight,
  },
  languageOptionPressed: {
    opacity: 0.75,
  },
  languageLabel: {
    color: colors.ink,
    fontSize: 15,
  },
  selectedLanguageLabel: {
    color: colors.primary,
    fontWeight: "700",
  },
  radioMark: {
    color: colors.primary,
    fontSize: 18,
  },
  storageError: {
    marginTop: 14,
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
  },
  fontSizeOptions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
  },
  fontSizeOption: {
    minHeight: 44,
    minWidth: 82,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.paper,
  },
  selectedFontSizeOption: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  fontSizeLabel: {
    color: colors.ink,
    fontSize: 14,
  },
  learningActions: {
    gap: 10,
    marginBottom: 28,
  },
  learningAction: {
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  learningActionTitle: {
    marginBottom: 4,
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  learningActionDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  historyFeedback: {
    gap: 12,
    marginBottom: 16,
  },
  historyList: {
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  historyItem: {
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  historyTitle: {
    marginBottom: 5,
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  historySummary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  retryButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  retryButtonLabel: {
    color: colors.paper,
    fontSize: 14,
    fontWeight: "700",
  },
});
