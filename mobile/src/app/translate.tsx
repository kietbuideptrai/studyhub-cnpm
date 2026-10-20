
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { saveTranslationHistory } from '@/services/historyStorage';

const C = Colors.light;

const LANGUAGES = [
  'English',
  'Vietnamese',
  'Japanese',
  'Korean',
  'Chinese',
];

const DICTIONARY: Record<string, Record<string, string>> = {
  'English-Vietnamese': {
    hello: 'Xin chào',
    'thank you': 'Cảm ơn',
    'good morning': 'Chào buổi sáng',
    goodbye: 'Tạm biệt',
    welcome: 'Chào mừng',
    'how are you?': 'Bạn khỏe không?',
    'good night': 'Chúc ngủ ngon',
    'i love you': 'Tôi yêu bạn',
    'see you later': 'Hẹn gặp lại',
    sorry: 'Xin lỗi',
  },
  'Vietnamese-English': {
    'xin chào': 'Hello',
    'cảm ơn': 'Thank you',
    'chào buổi sáng': 'Good morning',
    'tạm biệt': 'Goodbye',
    'chào mừng': 'Welcome',
    'bạn khỏe không?': 'How are you?',
    'chúc ngủ ngon': 'Good night',
    'tôi yêu bạn': 'I love you',
    'hẹn gặp lại': 'See you later',
    'xin lỗi': 'Sorry',
  },
};

function translateDemo(
  text: string,
  from: string,
  to: string,
): string | null {
  if (from === to) return text.trim();

  return DICTIONARY[`${from}-${to}`]?.[text.trim().toLowerCase()] ?? null;
}

export default function TranslateScreen() {
  const [from, setFrom] = useState('English');
  const [to, setTo] = useState('Vietnamese');
  const [picker, setPicker] = useState<'from' | 'to' | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetResult = () => {
    setResult('');
    setError(false);
  };

  const handleTranslate = async () => {
    Keyboard.dismiss();

    const originalText = input.trim();

    if (!originalText) {
      setError(true);
      setResult('Please enter some text.');
      return;
    }

    if (loading) return;

    setLoading(true);
    resetResult();

    try {
      const translatedText = translateDemo(originalText, from, to);

      if (translatedText === null) {
        setError(true);
        setResult('Phrase not found in demo dictionary.');
        return;
      }

      await saveTranslationHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sourceLanguage: from,
        targetLanguage: to,
        originalText,
        translatedText,
        createdAt: new Date().toISOString(),
      });

      setResult(translatedText);
    } catch (e) {
      console.error('Translation or history saving failed:', e);
      setError(true);
      setResult('Could not save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setFrom(to);
    setTo(from);
    setInput('');
    resetResult();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>StudyHub</Text>
          <Text style={styles.tagline}>Translate words and phrases</Text>
        </View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>
      </View>

      <Text style={styles.heading}>Translate</Text>
      <Text style={styles.subtitle}>Translate with ease.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Languages</Text>

        <View style={styles.languageRow}>
          <Pressable
            style={styles.languageBox}
            onPress={() => {
              Keyboard.dismiss();
              setPicker('from');
            }}
          >
            <Text style={styles.muted}>From</Text>
            <Text style={styles.languageName}>{from}</Text>
            <Text style={styles.chevron}>⌄</Text>
          </Pressable>

          <Pressable
            style={styles.swapButton}
            onPress={swapLanguages}
            accessibilityLabel="Swap languages"
          >
            <Text style={styles.swapText}>⇄</Text>
          </Pressable>

          <Pressable
            style={styles.languageBox}
            onPress={() => {
              Keyboard.dismiss();
              setPicker('to');
            }}
          >
            <Text style={styles.muted}>To</Text>
            <Text style={styles.languageName}>{to}</Text>
            <Text style={styles.chevron}>⌄</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Your text</Text>

        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={(text) => {
            setInput(text);
            resetResult();
          }}
          placeholder="Enter text here..."
          placeholderTextColor={C.textSecondary}
          multiline
          textAlignVertical="top"
          editable={!loading}
          accessibilityLabel="Text to translate"
        />

        <Pressable
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleTranslate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Translate</Text>
          )}
        </Pressable>

        {result !== '' && (
          <View style={[styles.resultCard, error && styles.errorCard]}>
            <Text style={[styles.resultLabel, error && styles.errorText]}>
              {error ? 'Notice' : 'Result'}
            </Text>
            <Text style={[styles.resultText, error && styles.errorText]}>
              {result}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Demo mode</Text>
        <Text style={styles.infoText}>
          Demo dictionary only. Supported phrases are saved to history.
        </Text>
      </View>

      <Modal
        visible={picker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setPicker(null)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Select language</Text>

            {LANGUAGES.map((language) => {
              const selected =
                language === (picker === 'from' ? from : to);

              return (
                <Pressable
                  key={language}
                  style={[
                    styles.languageOption,
                    selected && styles.selectedOption,
                  ]}
                  onPress={() => {
                    if (picker === 'from') setFrom(language);
                    else setTo(language);

                    resetResult();
                    setPicker(null);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.selectedText,
                    ]}
                  >
                    {language}
                  </Text>
                  {selected && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              );
            })}

            <Pressable
              style={styles.cancelButton}
              onPress={() => setPicker(null)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  container: {
    paddingHorizontal: Spacing.three + 6,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
  },
  brand: {
    color: C.primary,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    color: C.textSecondary,
    fontSize: 12,
    marginTop: Spacing.half,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },
  heading: {
    color: C.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: C.textSecondary,
    fontSize: 14,
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
  },
  card: {
    backgroundColor: C.backgroundElement,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: Spacing.three,
  },
  label: {
    color: C.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  languageBox: {
    flex: 1,
    minHeight: 72,
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: Spacing.two,
    justifyContent: 'center',
  },
  muted: {
    color: C.textSecondary,
    fontSize: 12,
    marginBottom: Spacing.one,
  },
  languageName: {
    color: C.text,
    fontSize: 14,
    fontWeight: '700',
  },
  chevron: {
    position: 'absolute',
    right: 9,
    top: 24,
    color: C.textSecondary,
    fontSize: 18,
  },
  swapButton: {
    width: 36,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapText: {
    color: C.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  textInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    backgroundColor: C.backgroundElement,
    padding: Spacing.three - 2,
    fontSize: 16,
    color: C.text,
    lineHeight: 23,
    marginBottom: Spacing.three,
  },
  button: {
    minHeight: 48,
    backgroundColor: C.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultCard: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  resultLabel: {
    color: C.primary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  resultText: {
    color: C.text,
    fontSize: 17,
    lineHeight: 25,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  errorText: {
    color: C.error,
  },
  infoCard: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    backgroundColor: C.primaryLight,
    borderRadius: 14,
  },
  infoTitle: {
    color: C.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  infoText: {
    color: C.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 40, 0.45)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    backgroundColor: C.backgroundElement,
    borderRadius: 18,
    padding: Spacing.three,
  },
  modalTitle: {
    color: C.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  languageOption: {
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: C.backgroundSelected,
  },
  optionText: {
    color: C.text,
    fontSize: 16,
  },
  selectedText: {
    color: C.primary,
    fontWeight: '700',
  },
  checkmark: {
    color: C.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: Spacing.two,
    padding: Spacing.two,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  cancelText: {
    color: C.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
});
