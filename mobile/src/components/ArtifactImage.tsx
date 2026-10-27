import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ImageStyle, StyleProp } from "react-native";
import { colors } from "@/theme";

interface ArtifactImageProps {
  accessibilityLabel: string;
  source: string;
  style: StyleProp<ImageStyle>;
}

export function ArtifactImage({
  accessibilityLabel,
  source,
  style,
}: ArtifactImageProps) {
  const [hasLoadError, setHasLoadError] = useState(false);

  if (hasLoadError) {
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        style={[style, styles.placeholder]}
      >
        <Text style={styles.placeholderMark}>◇</Text>
        <Text style={styles.placeholderText}>Không tải được ảnh hiện vật</Text>
      </View>
    );
  }

  return (
    <Image
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      onError={() => setHasLoadError(true)}
      resizeMode="cover"
      source={{ uri: source }}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.highlight,
  },
  placeholderMark: {
    marginBottom: 8,
    color: colors.muted,
    fontSize: 28,
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
});
