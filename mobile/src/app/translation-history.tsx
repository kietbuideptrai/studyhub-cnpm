import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import {
  clearTranslationHistory,
  getTranslationHistory,
  type TranslationHistoryItem,
} from "@/services/translationHistory";
import { colors } from "@/theme";
import { translationLanguages } from "@/utils/translation";

export default function TranslationHistoryScreen() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setHistory(await getTranslationHistory());
    } catch {
      setErrorMessage("Không thể tải lịch sử bản dịch. Hãy thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  function confirmClearHistory() {
    Alert.alert("Xóa lịch sử", "Bạn có chắc muốn xóa toàn bộ lịch sử bản dịch?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => void handleClearHistory(),
      },
    ]);
  }

  async function handleClearHistory() {
    try {
      await clearTranslationHistory();
      setHistory([]);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Không thể xóa lịch sử bản dịch. Hãy thử lại.");
    }
  }

  return (
    <Screen title="Lịch sử bản dịch">
      {history.length > 0 && !isLoading ? (
        <Pressable
          accessibilityRole="button"
          onPress={confirmClearHistory}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.clearButtonLabel}>Xóa lịch sử</Text>
        </Pressable>
      ) : null}

      {isLoading ? (
        <View style={styles.feedback}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.feedbackText}>Đang tải lịch sử...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.feedback}>
          <Text accessibilityRole="alert" style={styles.errorMessage}>
            {errorMessage}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void loadHistory()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonLabel}>Thử lại</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={confirmClearHistory}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonLabel}>Xóa dữ liệu lịch sử</Text>
          </Pressable>
        </View>
      ) : history.length === 0 ? (
        <EmptyState
          title="Chưa có bản dịch"
          message="Các cụm từ đã dịch sẽ được lưu tại đây trên thiết bị."
        />
      ) : (
        <View style={styles.historyList}>
          {history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.languagePair}>
                {translationLanguages[item.sourceLanguage]} →{" "}
                {translationLanguages[item.targetLanguage]}
              </Text>
              <Text style={styles.originalText}>{item.originalText}</Text>
              <Text style={styles.translatedText}>{item.translatedText}</Text>
              <Text style={styles.dateText}>
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.paper,
  },
  clearButtonLabel: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "700",
  },
  historyList: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  languagePair: {
    marginBottom: 8,
    color: colors.muted,
    fontSize: 12,
  },
  originalText: {
    marginBottom: 4,
    color: colors.ink,
    fontSize: 15,
  },
  translatedText: {
    marginBottom: 8,
    color: colors.primary,
    fontSize: 17,
    fontWeight: "700",
  },
  dateText: {
    color: colors.muted,
    fontSize: 12,
  },
  feedback: {
    minHeight: 190,
    justifyContent: "center",
    gap: 12,
  },
  feedbackText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
  errorMessage: {
    color: colors.error,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
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
  pressed: {
    opacity: 0.75,
  },
});
