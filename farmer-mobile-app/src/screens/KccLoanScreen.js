import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';

export default function KccLoanScreen({ language }) {
  const isHindi = language === 'HI';
  const [approved, setApproved] = useState(false);

  const handleApply = () => {
    setApproved(true);
    Alert.alert(
      'NABARD Loan Approved!',
      '₹1,60,000 pre-approved credit sanctioned and disbursed to your SBI account **4012 based on Anveshana Purity Score 87.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.icon}>🏛️</Text>
          <Text style={styles.title}>
            {isHindi ? 'नाबार्ड इंस्टेंट KCC लोन' : 'NABARD Instant KCC Loan'}
          </Text>
          <Text style={styles.sub}>
            {isHindi ? 'अन्वेषण शुद्धता स्कोर 87 के आधार पर पूर्व-स्वीकृत' : 'Pre-approved based on Anveshana Purity Score 87.'}
          </Text>

          <View style={styles.box}>
            <View style={styles.row}>
              <Text style={styles.label}>Approved Limit:</Text>
              <Text style={styles.valGreen}>₹1,60,000</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Interest Subvention:</Text>
              <Text style={styles.valWhite}>4.0% p.a.</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Security Guarantee:</Text>
              <Text style={styles.valGreen}>FSSAI Hardware Lock</Text>
            </View>
          </View>

          {approved ? (
            <View style={styles.approvedBox}>
              <Text style={styles.approvedTitle}>✅ LOAN SANCTIONED</Text>
              <Text style={styles.approvedText}>₹1,60,000 Credited to SBI Account **4012</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>
                {isHindi ? 'स्वीकृत करें और ऋण प्राप्त करें' : 'Confirm & Sanction Loan'}
              </Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 44,
    marginBottom: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  sub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  box: {
    width: '100%',
    backgroundColor: '#090d1a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
  },
  valGreen: {
    color: '#34d399',
    fontSize: 13,
    fontWeight: '800',
  },
  valWhite: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  applyBtn: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  applyText: {
    color: '#022c22',
    fontSize: 13,
    fontWeight: '800',
  },
  approvedBox: {
    width: '100%',
    backgroundColor: '#022c22',
    borderColor: '#10b981',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  approvedTitle: {
    color: '#34d399',
    fontSize: 14,
    fontWeight: '900',
  },
  approvedText: {
    color: '#ffffff',
    fontSize: 11,
    marginTop: 4,
  },
});
