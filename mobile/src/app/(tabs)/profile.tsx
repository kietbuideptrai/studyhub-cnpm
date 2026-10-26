import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/utils/languages";
import { colors } from "@/theme";

export default function ProfileScreen() {
  const { language, setLanguage, storageError } = useLanguage();

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
});
