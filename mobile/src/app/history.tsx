
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import {
  clearTranslationHistory,
  getTranslationHistory,
  type TranslationHistoryItem,
} from '@/services/historyStorage';

export default function HistoryScreen() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const items = await getTranslationHistory();
    setHistory(items);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const handleClearHistory = () => {
    Alert.alert(
      'Clear history',
      'Are you sure you want to delete all translation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearTranslationHistory();
            setHistory([]);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>StudyHub</Text>
          <Text style={styles.heading}>Translation History</Text>
        </View>

        {history.length > 0 && (
          <Pressable onPress={handleClearHistory}>
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <Text style={styles.message}>Loading history...</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            history.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No translation history yet</Text>
              <Text style={styles.message}>
                Your translated text will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.languages}>
                {item.sourceLanguage} → {item.targetLanguage}
              </Text>

              <Text style={styles.label}>Original text</Text>
              <Text style={styles.content}>{item.originalText}</Text>

              <Text style={styles.label}>Translation</Text>
              <Text style={styles.content}>{item.translatedText}</Text>

              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 55,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 8,
  },
  clearText: {
    color: '#c62828',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  languages: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777777',
    marginTop: 8,
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: '#222222',
  },
  date: {
    fontSize: 12,
    color: '#888888',
    marginTop: 12,
  },
});
