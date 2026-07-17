import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Scaffold shell — implement screens from docs/wireframes/
 * API base: http://localhost:4000/api/v1 (see docs/openapi.yaml)
 */
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>e-Food Center</Text>
      <Text style={styles.tagline}>Order food in a few taps</Text>
      <Text style={styles.hint}>Scaffold ready · Wireframes approved · API contract locked</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: '#C45C26',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#1C1917',
    marginBottom: 16,
  },
  hint: {
    fontSize: 13,
    color: '#57534E',
    textAlign: 'center',
  },
});
