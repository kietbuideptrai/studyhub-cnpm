import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { ArtifactCard } from "@/components/ArtifactCard";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { useLanguage } from "@/context/LanguageContext";
import { useLocalData } from "@/context/LocalDataContext";
import { useArtifacts } from "@/hooks/useArtifacts";
import { colors } from "@/theme";

export default function FavoritesScreen() {
  const { language } = useLanguage();
  const { favoriteSlugs } = useLocalData();
  const { state, retry } = useArtifacts(language, "");
  const artifactsBySlug = useMemo(
    () =>
      state.status === "success"
        ? new Map(state.data.map((artifact) => [artifact.slug, artifact]))
        : new Map(),
    [state],
  );
  const favorites = favoriteSlugs
    .map((slug) => artifactsBySlug.get(slug))
    .filter((artifact) => artifact !== undefined);

  return (
    <Screen title="Yêu thích">
      {favoriteSlugs.length === 0 ? (
        <EmptyState
          title="Chưa có hiện vật yêu thích"
          message="Hiện vật bạn yêu thích sẽ xuất hiện tại đây."
        />
      ) : state.status === "loading" ? (
        <View style={styles.feedback}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.message}>Đang tải hiện vật yêu thích...</Text>
        </View>
      ) : state.status === "error" ? (
        <View style={styles.feedback}>
          <EmptyState title="Không thể tải hiện vật" message={state.error.message} />
          <Pressable
            accessibilityRole="button"
            onPress={retry}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : favorites.length === 0 ? (
        <EmptyState
          title="Chưa có hiện vật trong ngôn ngữ này"
          message="Các hiện vật yêu thích chưa có bản dịch bằng ngôn ngữ đang chọn."
        />
      ) : (
        favorites.map((artifact) => (
          <ArtifactCard
            artifact={artifact}
            key={artifact.slug}
            onPress={() =>
              router.push({
                pathname: "/artifacts/[slug]",
                params: { slug: artifact.slug },
              })
            }
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  feedback: {
    gap: 14,
  },
  message: {
    color: colors.muted,
    fontSize: 15,
    textAlign: "center",
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
