
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

import { saveTranslationHistory } from '@/services/historyStorage';

const languages = [
  'English',
  'Vietnamese',
  'Japanese',
  'Korean',
  'Chinese',
];

const dictionaries: Record<string, Record<string, string>> = {
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
  sourceLanguage: string,
  targetLanguage: string,
): string | null {
  if (sourceLanguage === targetLanguage) {
    return text.trim();
  }

  const dictionaryKey = `${sourceLanguage}-${targetLanguage}`;
  const dictionary = dictionaries[dictionaryKey];
  const normalizedText = text.trim().toLowerCase();

  return dictionary?.[normalizedText] ?? null;
}

type LanguagePickerProps = {
  visible: boolean;
  selectedLanguage: string;
  onSelect: (language: string) => void;
  onClose: () => void;
};

function LanguagePicker({
  visible,
  selectedLanguage,
  onSelect,
  onClose,
}: LanguagePickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Select language</Text>

          {languages.map((language) => (
            <Pressable
              key={language}
              style={[
                styles.languageOption,
                selectedLanguage === language &&
                  styles.selectedLanguageOption,
              ]}
              onPress={() => {
                onSelect(language);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  selectedLanguage === language &&
                    styles.selectedLanguageText,
                ]}
              >
                {language}
              </Text>

              {selectedLanguage === language && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </Pressable>
          ))}

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function TranslateScreen() {
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Vietnamese');

  const [showSourceLanguages, setShowSourceLanguages] = useState(false);
  const [showTargetLanguages, setShowTargetLanguages] = useState(false);

  const [inputText, setInputText] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [resultIsError, setResultIsError] = useState(false);

  const handleTranslate = async () => {
    Keyboard.dismiss();

    const originalText = inputText.trim();

    if (!originalText) {
      setResultIsError(true);
      setTranslationResult('Please enter some text.');
      return;
    }

    if (isTranslating) return;

    setIsTranslating(true);
    setTranslationResult('');
    setResultIsError(false);

    try {
      const result = translateDemo(
        originalText,
        sourceLanguage,
        targetLanguage,
      );

      if (result === null) {
        setResultIsError(true);
        setTranslationResult(
          'This sentence is not available in the demo dictionary. No history was saved.',
        );
        return;
      }

      await saveTranslationHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sourceLanguage,
        targetLanguage,
        originalText,
        translatedText: result,
        createdAt: new Date().toISOString(),
      });

      setTranslationResult(result);
    } catch (error) {
      console.error('Translation or history saving failed:', error);
      setResultIsError(true);
      setTranslationResult(
        'Could not save the result. Please try again.',
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText('');
    setTranslationResult('');
    setResultIsError(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>StudyHub</Text>
      <Text style={styles.heading}>Translate</Text>
      <Text style={styles.subtitle}>
        Translate words and phrases with a demo dictionary.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Languages</Text>

        <View style={styles.languageRow}>
          <Pressable
            style={styles.languageBox}
            onPress={() => {
              Keyboard.dismiss();
              setShowSourceLanguages(true);
            }}
          >
            <Text style={styles.languageBoxLabel}>From</Text>
            <Text style={styles.languageName}>{sourceLanguage}</Text>
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
              setShowTargetLanguages(true);
            }}
          >
            <Text style={styles.languageBoxLabel}>To</Text>
            <Text style={styles.languageName}>{targetLanguage}</Text>
            <Text style={styles.chevron}>⌄</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Text to translate</Text>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setTranslationResult('');
            setResultIsError(false);
          }}
          placeholder="Enter text here..."
          placeholderTextColor="#8A8A8A"
          multiline
          textAlignVertical="top"
          editable={!isTranslating}
          accessibilityLabel="Text to translate"
        />

        <Pressable
          style={[
            styles.translateButton,
            isTranslating && styles.disabledButton,
          ]}
          onPress={handleTranslate}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.translateButtonText}>Translate</Text>
          )}
        </Pressable>

        {translationResult !== '' && (
          <View
            style={[
              styles.resultCard,
              resultIsError && styles.errorCard,
            ]}
          >
            <Text style={styles.resultLabel}>
              {resultIsError ? 'Notice' : 'Translation'}
            </Text>
            <Text
              style={[
                styles.resultText,
                resultIsError && styles.errorText,
              ]}
            >
              {translationResult}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Demo mode</Text>
        <Text style={styles.infoText}>
          This version uses a small built-in dictionary. Only supported
          demo phrases are saved to translation history. It does not use
          an online translation service.
        </Text>
      </View>

      <LanguagePicker
        visible={showSourceLanguages}
        selectedLanguage={sourceLanguage}
        onSelect={(language) => {
          setSourceLanguage(language);
          setTranslationResult('');
          setResultIsError(false);
        }}
        onClose={() => setShowSourceLanguages(false)}
      />

      <LanguagePicker
        visible={showTargetLanguages}
        selectedLanguage={targetLanguage}
        onSelect={(language) => {
          setTargetLanguage(language);
          setTranslationResult('');
          setResultIsError(false);
        }}
        onClose={() => setShowTargetLanguages(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  container: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4263EB',
    marginBottom: 6,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#182230',
  },
  subtitle: {
    fontSize: 14,
    color: '#667085',
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 21,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E7EAF0',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#344054',
    marginBottom: 10,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  languageBox: {
    flex: 1,
    minHeight: 76,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#DCE2EA',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
  },
  languageBoxLabel: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 4,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#182230',
  },
  chevron: {
    position: 'absolute',
    right: 9,
    top: 26,
    color: '#667085',
    fontSize: 18,
  },
  swapButton: {
    width: 36,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapText: {
    color: '#4263EB',
    fontSize: 23,
    fontWeight: '700',
  },
  textInput: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#DCE2EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 14,
    fontSize: 16,
    color: '#182230',
    lineHeight: 23,
    marginBottom: 16,
  },
  translateButton: {
    minHeight: 50,
    backgroundColor: '#4263EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  translateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultCard: {
    marginTop: 18,
    padding: 15,
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D7FE',
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4263EB',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 17,
    lineHeight: 25,
    color: '#182230',
  },
  errorCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#B42318',
    fontSize: 14,
  },
  infoCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3447A5',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#475467',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 40, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#182230',
    marginBottom: 12,
  },
  languageOption: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLanguageOption: {
    backgroundColor: '#EEF2FF',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#344054',
  },
  selectedLanguageText: {
    color: '#4263EB',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 18,
    color: '#4263EB',
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#667085',
  },
});
