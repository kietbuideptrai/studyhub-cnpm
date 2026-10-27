import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, styles as sharedStyles } from "@/theme";
import {
  translationLanguages,
  translatePhrase,
  type TranslationLanguage,
} from "@/utils/translation";
import { saveTranslationHistory } from "@/services/translationHistory";

export default function TranslateScreen() {
  const [sourceLanguage, setSourceLanguage] =
    useState<TranslationLanguage>("en");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const targetLanguage = sourceLanguage === "en" ? "vi" : "en";

  function swapLanguages() {
    setSourceLanguage(targetLanguage);
    setInput("");
    setResult("");
    setMessage("");
  }

  async function handleTranslate() {
    Keyboard.dismiss();
    const originalText = input.trim();
    if (!originalText) {
      setResult("");
      setMessage("Hãy nhập cụm từ bạn muốn dịch.");
      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setResult("");
    setMessage("");

    const translatedText = translatePhrase(originalText, sourceLanguage);
    if (!translatedText) {
      setMessage(
        "Cụm từ chưa có trong từ điển mẫu. Hiện chỉ hỗ trợ một số cụm tiếng Anh và tiếng Việt thông dụng.",
      );
      setIsSaving(false);
      return;
    }

    setResult(translatedText);
    try {
      await saveTranslationHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sourceLanguage,
        targetLanguage,
        originalText,
        translatedText,
        createdAt: new Date().toISOString(),
      });
      setMessage("Đã lưu bản dịch vào lịch sử.");
    } catch {
      setMessage("Bản dịch hiển thị nhưng chưa lưu được vào lịch sử.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={sharedStyles.screenContent}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView edges={["top"]} style={sharedStyles.screen}>
        <Text style={sharedStyles.screenTitle}>Dịch cụm từ</Text>
        <Text style={styles.description}>
          Bản demo dịch một số cụm từ tiếng Anh và tiếng Việt; chưa kết nối dịch
          máy.
        </Text>

        <View style={styles.languageRow}>
          <View style={styles.languageCard}>
            <Text style={styles.languageCaption}>Dịch từ</Text>
            <Text style={styles.languageName}>
              {translationLanguages[sourceLanguage]}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Đổi ngôn ngữ dịch"
            accessibilityRole="button"
            onPress={swapLanguages}
            style={({ pressed }) => [
              styles.swapButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.swapLabel}>⇄</Text>
          </Pressable>
          <View style={styles.languageCard}>
            <Text style={styles.languageCaption}>Dịch sang</Text>
            <Text style={styles.languageName}>
              {translationLanguages[targetLanguage]}
            </Text>
          </View>
        </View>

        <TextInput
          accessibilityLabel="Cụm từ cần dịch"
          autoCapitalize="sentences"
          multiline
          maxLength={200}
          onChangeText={(text) => {
            setInput(text);
            setResult("");
            setMessage("");
          }}
          placeholder={
            sourceLanguage === "en"
              ? "Ví dụ: hello"
              : "Ví dụ: xin chào"
          }
          placeholderTextColor={colors.muted}
          style={styles.input}
          textAlignVertical="top"
          value={input}
        />

        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={() => void handleTranslate()}
          style={({ pressed }) => [
            styles.translateButton,
            (pressed || isSaving) && styles.pressed,
          ]}
        >
          <Text style={styles.translateButtonLabel}>
            {isSaving ? "Đang xử lý..." : "Dịch"}
          </Text>
        </Pressable>

        {result ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultCaption}>Bản dịch</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
        {message ? (
          <Text
            accessibilityRole={result ? "text" : "alert"}
            style={result ? styles.notice : styles.errorMessage}
          >
            {message}
          </Text>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  languageCard: {
    flex: 1,
    minHeight: 72,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  languageCaption: {
    marginBottom: 5,
    color: colors.muted,
    fontSize: 12,
  },
  languageName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  swapButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.highlight,
  },
  swapLabel: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: "700",
  },
  input: {
    minHeight: 140,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
  translateButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  translateButtonLabel: {
    color: colors.paper,
    fontSize: 16,
    fontWeight: "700",
  },
  resultCard: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  resultCaption: {
    marginBottom: 8,
    color: colors.muted,
    fontSize: 13,
  },
  resultText: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },
  notice: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  errorMessage: {
    marginTop: 12,
    color: colors.error,
    fontSize: 14,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.75,
  },
});
