
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import {
  clearTranslationHistory,
  getTranslationHistory,
  type TranslationHistoryItem,
} from '@/services/historyStorage';

const C = Colors.light;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const items = await getTranslationHistory();
      setHistory(items);
    } catch (error) {
      console.error('Failed to load translation history:', error);
      Alert.alert('Error', 'Could not load translation history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const handleClearHistory = () => {
    Alert.alert('Clear history', 'Delete all translation history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearTranslationHistory();
            setHistory([]);
          } catch (error) {
            console.error('Failed to clear history:', error);
            Alert.alert('Error', 'Could not clear history.');
          }
        },
      },
    ]);
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 20 },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.brand}>StudyHub</Text>
          <Text style={styles.heading}>Translation History</Text>
          <Text style={styles.subtitle}>
            Review your translated phrases.
          </Text>
        </View>

        {history.length > 0 && !loading && (
          <Pressable
            onPress={handleClearHistory}
            style={styles.clearButton}
            accessibilityRole="button"
          >
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={styles.message}>Loading history...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            history.length === 0
              ? styles.emptyList
              : styles.list
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyEmoji}>🕘</Text>
              </View>
              <Text style={styles.emptyTitle}>
                No history yet
              </Text>
              <Text style={styles.message}>
                Your translated phrases will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.languageBadge}>
                <Text style={styles.languages}>
                  {item.sourceLanguage} → {item.targetLanguage}
                </Text>
              </View>

              <Text style={styles.label}>Original</Text>
              <Text style={styles.content}>
                {item.originalText}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.label}>Translation</Text>
              <Text style={styles.translation}>
                {item.translatedText}
              </Text>

              <Text style={styles.date}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
    paddingHorizontal: Spacing.three + 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  headerText: {
    flex: 1,
  },
  brand: {
    color: C.primary,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heading: {
    color: C.text,
    fontSize: 25,
    fontWeight: '800',
    marginTop: Spacing.two,
  },
  subtitle: {
    color: C.textSecondary,
    fontSize: 13,
    marginTop: Spacing.one,
  },
  clearButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: C.backgroundElement,
    borderRadius: 10,
  },
  clearText: {
    color: C.error,
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    paddingBottom: Spacing.five,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: Spacing.five,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: C.backgroundElement,
    borderRadius: 20,
    padding: Spacing.five,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  emptyEmoji: {
    fontSize: 28,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: C.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  card: {
    backgroundColor: C.backgroundElement,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  languageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.primaryLight,
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    marginBottom: Spacing.two,
  },
  languages: {
    color: C.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  content: {
    color: C.text,
    fontSize: 15,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginTop: Spacing.two,
  },
  translation: {
    color: C.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
  },
  date: {
    color: C.textSecondary,
    fontSize: 11,
    marginTop: Spacing.three,
    textAlign: 'right',
  },
});
