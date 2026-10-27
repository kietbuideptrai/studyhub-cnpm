import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { ListRenderItem } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArtifactCard } from "@/components/ArtifactCard";
import { EmptyState } from "@/components/EmptyState";
import { useLanguage } from "@/context/LanguageContext";
import type { ArtifactListItem } from "../../../../shared/types";
import { colors, styles as sharedStyles } from "@/theme";
import { useArtifacts } from "@/hooks/useArtifacts";

export default function ArtifactsScreen() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { state, retry } = useArtifacts(language, searchQuery);
  const artifacts = state.status === "success" ? state.data : [];
  const isLoading = state.status === "loading";

  const renderArtifact: ListRenderItem<ArtifactListItem> = ({ item }) => (
    <ArtifactCard
      artifact={item}
      onPress={() =>
        router.push({
          pathname: "/artifacts/[slug]",
          params: { slug: item.slug },
        })
      }
    />
  );

  return (
    <SafeAreaView edges={["top"]} style={sharedStyles.screen}>
      <FlatList
        data={artifacts}
        keyExtractor={(artifact) => artifact.slug}
        renderItem={renderArtifact}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Text style={sharedStyles.screenTitle}>Hiện vật</Text>
            <Text style={styles.fieldLabel}>Tìm hiện vật theo tên</Text>
            <TextInput
              accessibilityLabel="Tìm hiện vật theo tên"
              autoCapitalize="none"
              clearButtonMode="while-editing"
              onChangeText={setSearchQuery}
              placeholder="Nhập tên hiện vật..."
              placeholderTextColor={colors.muted}
              returnKeyType="search"
              style={styles.searchInput}
              value={searchQuery}
            />
            {state.status === "success" ? (
              <Text style={styles.resultCount} accessibilityLiveRegion="polite">
                {state.data.length} hiện vật
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.feedback}>
              <ActivityIndicator color={colors.primary} size="large" />
              <Text style={styles.feedbackText}>Đang tải hiện vật...</Text>
            </View>
          ) : state.status === "error" ? (
            <View style={styles.errorState}>
              <EmptyState
                title="Không thể tải hiện vật"
                message={state.error.message}
              />
              <Pressable
                accessibilityRole="button"
                onPress={retry}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </Pressable>
            </View>
          ) : (
            <EmptyState
              title={
                searchQuery.trim()
                  ? "Không tìm thấy hiện vật phù hợp"
                  : "Chưa có hiện vật bằng ngôn ngữ này"
              }
              message={
                searchQuery.trim()
                  ? `Không có kết quả cho “${searchQuery.trim()}”. Hãy thử từ khóa khác.`
                  : "Hiện chưa có hiện vật được xuất bản bằng ngôn ngữ này."
              }
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  fieldLabel: {
    marginBottom: 8,
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
  },
  searchInput: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.paper,
    color: colors.ink,
    fontSize: 16,
  },
  resultCount: {
    marginTop: 10,
    marginBottom: 16,
    color: colors.muted,
    fontSize: 13,
  },
  feedback: {
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  feedbackText: {
    color: colors.muted,
    fontSize: 15,
  },
  errorState: {
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
});
