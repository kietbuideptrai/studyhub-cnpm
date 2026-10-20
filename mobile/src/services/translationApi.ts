const API_URL = 'http://YOUR_BACKEND_URL/translate';

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      sourceLanguage,
      targetLanguage,
    }),
  });

  if (!response.ok) {
    throw new Error('Translation request failed');
  }

  const data = await response.json();

  return data.translation;
}