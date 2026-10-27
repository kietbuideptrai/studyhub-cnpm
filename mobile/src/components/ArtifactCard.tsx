import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ArtifactListItem } from "../../../shared/types";
import { ArtifactImage } from "@/components/ArtifactImage";
import { colors } from "@/theme";

interface ArtifactCardProps {
  artifact: ArtifactListItem;
  onPress: () => void;
}

export function ArtifactCard({ artifact, onPress }: ArtifactCardProps) {
  return (
    <Pressable
      accessibilityHint="Mở thuyết minh chi tiết hiện vật"
      accessibilityLabel={`${artifact.title}. ${artifact.summary}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ArtifactImage
        accessibilityLabel={`Ảnh hiện vật ${artifact.title}`}
        source={artifact.image_url}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{artifact.title}</Text>
        <Text style={styles.summary} numberOfLines={3}>
          {artifact.summary}
        </Text>
        <Text style={styles.linkText}>Xem thuyết minh  →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.paper,
  },
  pressed: {
    opacity: 0.82,
  },
  image: {
    width: "100%",
    height: 190,
    backgroundColor: colors.highlight,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 7,
    color: colors.ink,
    fontSize: 19,
    fontWeight: "700",
  },
  summary: {
    marginBottom: 15,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
