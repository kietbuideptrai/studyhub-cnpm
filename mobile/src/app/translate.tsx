import { StyleSheet, Text, View } from 'react-native';

export default function TranslateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translate</Text>
      <Text style={styles.subtitle}>
        StudyHub Translation
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
  },
});