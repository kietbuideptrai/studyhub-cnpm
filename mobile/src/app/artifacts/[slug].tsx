import { useCallback } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Language } from "../../../../shared/types";
import { ArtifactImage } from "@/components/ArtifactImage";
import { EmptyState } from "@/components/EmptyState";
import { useLanguage } from "@/context/LanguageContext";
import { useArtifact } from "@/hooks/useArtifact";
import { useSpeech } from "@/hooks/useSpeech";
import { colors, styles as sharedStyles } from "@/theme";
import { getLanguageLabel, languages } from "@/utils/languages";

export default function ArtifactDetailScreen() {
  const { slug: requestedSlug } = useLocalSearchParams<{ slug: string }>();
  const slug = Array.isArray(requestedSlug) ? requestedSlug[0] : requestedSlug;
  const { language, setLanguage, storageError } = useLanguage();
  const { state, isNotFound, retry } = useArtifact(slug, language);
  const artifact = state.status === "success" ? state.data : null;
  const translation = artifact?.translation;
  const speech = useSpeech(translation?.content ?? "", language);
  const stopSpeech = speech.stop;

  useFocusEffect(
    useCallback(() => () => stopSpeech(), [stopSpeech]),
  );

  if (state.status === "loading") {
    return (
      <View style={[sharedStyles.screen, styles.feedback]}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.feedbackText}>Đang tải thuyết minh...</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={[sharedStyles.screen, styles.errorState]}>
        <EmptyState
          title={isNotFound ? "Không tìm thấy hiện vật" : "Không thể tải hiện vật"}
          message={
            isNotFound
              ? `Không có hiện vật với mã "${slug ?? ""}".`
              : state.error.message
          }
        />
        {!isNotFound ? (
          <Pressable
            accessibilityRole="button"
            onPress={retry}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (!artifact) {
    return null;
  }

  if (!translation) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ArtifactImage
          accessibilityLabel={`Ảnh hiện vật ${artifact.slug}`}
          source={artifact.image_url}
          style={styles.image}
        />
        <EmptyState
          title={`Chưa có thuyết minh bằng ${getLanguageLabel(language)}`}
          message={`Ngôn ngữ này chưa có bản dịch. Nội dung hiện có: ${artifact.available_languages
            .map(getLanguageLabel)
            .join(", ")}.`}
        />
        <LanguageSelector
          language={language}
          onChange={setLanguage}
          storageError={storageError}
        />
      </ScrollView>
    );
  }

  const paragraphs = splitIntoParagraphs(translation.content);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ArtifactImage
        accessibilityLabel={`Ảnh hiện vật ${translation.title}`}
        source={artifact.image_url}
        style={styles.image}
      />
      <LanguageSelector
        language={language}
        onChange={setLanguage}
        storageError={storageError}
      />
      <Text style={styles.languageTag}>{getLanguageLabel(language)}</Text>
      <Text style={styles.title}>{translation.title}</Text>
      <Text style={styles.summary}>{translation.summary}</Text>
      <View style={styles.speechControls}>
        {speech.voiceAvailability === "unavailable" ? (
          <Text style={styles.speechMessage} accessibilityRole="alert">
            Thiết bị không có giọng đọc {getLanguageLabel(language)}. Bạn vẫn có
            thể đọc nội dung bên dưới.
          </Text>
        ) : speech.status === "idle" ? (
          <Pressable
            accessibilityLabel={`Nghe thuyết minh bằng ${getLanguageLabel(language)}`}
            accessibilityRole="button"
            disabled={speech.voiceAvailability === "checking"}
            onPress={speech.play}
            style={[
              styles.speechButton,
              speech.voiceAvailability === "checking" && styles.disabledButton,
            ]}
          >
            <Text style={styles.speechButtonText}>
              {speech.voiceAvailability === "checking"
                ? "Đang kiểm tra giọng đọc..."
                : "▶  Nghe thuyết minh"}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.speechButtonRow}>
            {speech.status === "paused" ? (
              <Pressable
                accessibilityRole="button"
                onPress={speech.resume}
                style={styles.speechButton}
              >
                <Text style={styles.speechButtonText}>▶  Tiếp tục</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={speech.pause}
                style={styles.speechButton}
              >
                <Text style={styles.speechButtonText}>Ⅱ  Tạm dừng</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={speech.stop}
              style={styles.stopButton}
            >
              <Text style={styles.stopButtonText}>Dừng</Text>
            </Pressable>
          </View>
        )}
        {speech.error ? (
          <Text style={styles.speechError} accessibilityRole="alert">
            {speech.error}
          </Text>
        ) : null}
      </View>
      <View style={styles.article}>
        {paragraphs.map((paragraph, index) => (
          <Text key={`${index}-${paragraph}`} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => Promise<void>;
  storageError: string | null;
}

function LanguageSelector({
  language,
  onChange,
  storageError,
}: LanguageSelectorProps) {
  return (
    <View style={styles.languageSelector}>
      <Text style={styles.languageSelectorLabel}>Ngôn ngữ thuyết minh</Text>
      <View style={styles.languageOptions}>
        {languages.map((item) => {
          const isSelected = item.code === language;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              key={item.code}
              onPress={() => void onChange(item.code)}
              style={[
                styles.languageOption,
                isSelected && styles.selectedLanguageOption,
              ]}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  isSelected && styles.selectedLanguageOptionText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {storageError ? (
        <Text style={styles.storageError} accessibilityRole="alert">
          {storageError}
        </Text>
      ) : null}
    </View>
  );
}

function splitIntoParagraphs(content: string): string[] {
  return (
    content
      .match(/[^.!?。！？]+[.!?。！？]?/gu)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) ?? []
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: 230,
    marginBottom: 22,
    borderRadius: 14,
  },
  feedback: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  feedbackText: {
    color: colors.muted,
    fontSize: 15,
  },
  errorState: {
    justifyContent: "center",
    gap: 14,
  },
  retryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    color: colors.paper,
    fontSize: 15,
    fontWeight: "700",
  },
  languageSelector: {
    marginBottom: 18,
  },
  languageSelectorLabel: {
    marginBottom: 9,
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  languageOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageOption: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.paper,
  },
  selectedLanguageOption: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  languageOptionText: {
    color: colors.ink,
    fontSize: 14,
  },
  selectedLanguageOptionText: {
    color: colors.primary,
    fontWeight: "700",
  },
  storageError: {
    marginTop: 10,
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
  },
  languageTag: {
    marginBottom: 8,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    marginBottom: 10,
    color: colors.ink,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 38,
  },
  summary: {
    marginBottom: 18,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 25,
  },
  speechControls: {
    marginBottom: 22,
  },
  speechButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  speechButtonText: {
    color: colors.paper,
    fontSize: 15,
    fontWeight: "700",
  },
  speechButtonRow: {
    flexDirection: "row",
    gap: 10,
  },
  stopButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.paper,
  },
  stopButtonText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
  speechMessage: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  speechError: {
    marginTop: 10,
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  article: {
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paragraph: {
    marginBottom: 18,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 29,
  },
});
