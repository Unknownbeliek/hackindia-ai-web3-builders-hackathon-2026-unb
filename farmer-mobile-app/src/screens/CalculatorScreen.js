import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';

export default function CalculatorScreen({ language }) {
  const isHindi = language === 'HI';
  const [weight, setWeight] = useState('10.0');
  const [fat, setFat] = useState('4.5');
  const [snf, setSnf] = useState('8.8');

  const w = parseFloat(weight) || 0;
  const f = parseFloat(fat) || 0;
  const s = parseFloat(snf) || 0;

  const ratePerLiter = +(f * 7.5 + s * 4.0).toFixed(2);
  const totalPayout = +(w * ratePerLiter).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isHindi ? '🧮 दूध दर एवं भुगतान कैलकुलेटर' : '🧮 Milk Rate & Payout Calculator'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{isHindi ? 'दूध का वजन (kg)' : 'Milk Weight (kg)'}</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{isHindi ? 'फैट (%)' : 'Fat (%)'}</Text>
              <TextInput
                style={[styles.textInput, { color: '#34d399' }]}
                keyboardType="numeric"
                value={fat}
                onChangeText={setFat}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{isHindi ? 'एसएनएफ (%)' : 'SNF (%)'}</Text>
              <TextInput
                style={[styles.textInput, { color: '#2dd4bf' }]}
                keyboardType="numeric"
                value={snf}
                onChangeText={setSnf}
              />
            </View>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resRow}>
              <Text style={styles.resLabel}>{isHindi ? 'गणना की गई दर:' : 'Calculated Rate:'}</Text>
              <Text style={styles.resValTeal}>₹{ratePerLiter} / L</Text>
            </View>

            <View style={styles.resRow}>
              <Text style={styles.resLabel}>{isHindi ? 'अनुमानित कुल भुगतान:' : 'Est. Total Payout:'}</Text>
              <Text style={styles.resValGreen}>₹{totalPayout}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b14',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#090d1a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  resultCard: {
    backgroundColor: '#022c22',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    gap: 8,
  },
  resRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resLabel: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  resValTeal: {
    color: '#2dd4bf',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  resValGreen: {
    color: '#34d399',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
});
