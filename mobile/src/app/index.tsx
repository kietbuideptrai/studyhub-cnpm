
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

const BLUE = Colors.light.primary;
const DARK = Colors.light.text;
const MUTED = Colors.light.textSecondary;
const LIGHT_BLUE = Colors.light.primaryLight;
const BORDER = Colors.light.border;
const BACKGROUND = Colors.light.background;
const CARD = Colors.light.backgroundElement;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + 110,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>StudyHub</Text>
          <Text style={styles.tagline}>Your learning companion</Text>
        </View>

        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>WELCOME BACK 👋</Text>

        <Text style={styles.heading}>
          Learn something{'\n'}new today.
        </Text>

        <Text style={styles.description}>
          Practice languages, review your progress, and keep learning at your
          own pace.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.navigate('/translate')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            Start translating  →
          </Text>
        </TouchableOpacity>

        <View style={styles.heroDecoration}>
          <Text style={styles.heroEmoji}>📚</Text>
          <View>
            <Text style={styles.heroCardTitle}>Small steps,</Text>
            <Text style={styles.heroCardTitle}>big progress.</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your workspace</Text>
        <Text style={styles.sectionSubtitle}>
          Choose where to start
        </Text>
      </View>

      <TouchableOpacity
        style={styles.featureCard}
        onPress={() => router.navigate('/translate')}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.featureIcon,
            { backgroundColor: LIGHT_BLUE },
          ]}
        >
          <Text style={styles.featureEmoji}>🌐</Text>
        </View>

        <View style={styles.featureBody}>
          <Text style={styles.featureTitle}>Translate</Text>
          <Text style={styles.featureDescription}>
            Practice words and phrases in different languages.
          </Text>
          <Text style={styles.featureLink}>
            Open translator  →
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.featureCard}
        onPress={() => router.navigate('/history')}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.featureIcon,
            { backgroundColor: '#E8F8F0' },
          ]}
        >
          <Text style={styles.featureEmoji}>🕘</Text>
        </View>

        <View style={styles.featureBody}>
          <Text style={styles.featureTitle}>
            Translation history
          </Text>
          <Text style={styles.featureDescription}>
            Review the phrases you have translated before.
          </Text>
          <Text style={styles.featureLink}>
            View history  →
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Learning tip</Text>
        <Text style={styles.tipText}>
          Learn a few useful phrases every day and revisit them regularly to
          remember more.
        </Text>
      </View>

      <Text style={styles.footer}>
        STUDYHUB · LEARN AT YOUR OWN PACE
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  content: {
    paddingHorizontal: Spacing.three + 6,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 27,
    fontWeight: '800',
    color: BLUE,
    letterSpacing: -0.6,
  },
  tagline: {
    marginTop: Spacing.one,
    fontSize: 13,
    color: MUTED,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  hero: {
    backgroundColor: CARD,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDER,
  },
  eyebrow: {
    color: BLUE,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  heading: {
    color: DARK,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  description: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: BLUE,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  heroDecoration: {
    marginTop: 20,
    padding: 16,
    backgroundColor: LIGHT_BLUE,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroEmoji: {
    fontSize: 34,
  },
  heroCardTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  sectionHeader: {
    gap: 5,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: MUTED,
    fontSize: 14,
  },
  featureCard: {
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: {
    fontSize: 25,
  },
  featureBody: {
    flex: 1,
  },
  featureTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: '800',
  },
  featureDescription: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  featureLink: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  tipCard: {
    backgroundColor: '#FFF7E8',
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  tipTitle: {
    color: '#8A5B16',
    fontSize: 16,
    fontWeight: '800',
  },
  tipText: {
    color: '#795D35',
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    textAlign: 'center',
    color: '#929AAF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
});
