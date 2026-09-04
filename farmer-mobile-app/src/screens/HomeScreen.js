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
import * as Speech from 'expo-speech';

export default function HomeScreen({ language, farmer, pourEvents, onQuickPour, onOpenKcc, onOpenCalculator }) {
  const [spoken, setSpoken] = useState(false);

  const speakHindi = () => {
    const textToSpeak = `नमस्ते ${farmer.name} जी। अन्वेषण किसान ऐप में आपका स्वागत है। आपका फार्म शुद्धता स्कोर 87 प्रतिशत है। आज का दूध 8.5 किलो दर्ज हुआ है। आपकी राशि ₹382.5 आपके बैंक खाते में जमा कर दी गई है।`;
    Speech.speak(textToSpeak, {
      language: 'hi-IN',
      rate: 0.95,
      onDone: () => setSpoken(false),
      onError: () => setSpoken(false)
    });
    setSpoken(true);
  };

  const isHindi = language === 'HI';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View>
              <View style={styles.row}>
                <Text style={styles.farmerName}>{farmer.name}</Text>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>NDLM VERIFIED</Text>
                </View>
              </View>
              <Text style={styles.farmerSub}>
                ID: {farmer.farmerId} • {farmer.animalBreed}
              </Text>
            </View>
          </View>

          {/* Hindi Voice Narration Trigger */}
          <TouchableOpacity
            onPress={speakHindi}
            style={[styles.speechBtn, spoken && styles.speechBtnActive]}
          >
            <Text style={styles.speechBtnText}>{spoken ? '🔊' : '🗣️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Anveshana Purity Index Score Gauge */}
        <View style={styles.purityCard}>
          <Text style={styles.purityHeader}>
            {isHindi ? 'फार्म शुद्धता स्कोर (अन्वेषण इंडेक्स)' : 'FARM PURITY SCORE (ANVESHANA INDEX)'}
          </Text>

          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{farmer.purityScore}</Text>
            <Text style={styles.scoreGrade}>{isHindi ? 'श्रेणी A+' : 'GRADE A+'}</Text>
          </View>

          <Text style={styles.puritySub}>
            NDLM Ear Tag <Text style={styles.highlight}>#{farmer.ndlmTag}</Text> linked • Zero synthetic dilution detected in 90 days.
          </Text>
        </View>

        {/* Quick Actions Bar */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.primaryActionBtn} onPress={onQuickPour}>
            <Text style={styles.primaryActionText}>
              {isHindi ? '+ दूध दर्ज करें' : '+ Log Milk Pour'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionBtn} onPress={onOpenCalculator}>
            <Text style={styles.secondaryActionText}>
              {isHindi ? '🧮 दर कैलकुलेटर' : '🧮 Calculator'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pre-Approved KCC Loan Card */}
        <View style={styles.kccBanner}>
          <View style={styles.kccTextCol}>
            <Text style={styles.kccTitle}>
              {isHindi ? '✨ पूर्व-स्वीकृत KCC लोन' : '✨ Pre-Approved Kisan Credit Card'}
            </Text>
            <Text style={styles.kccSub}>
              {isHindi ? 'शुद्धता स्कोर 87 के आधार पर ₹1,60,000 लोन' : 'Instant credit up to ₹1,60,000 based on Purity Score 87.'}
            </Text>
          </View>

          <TouchableOpacity style={styles.applyBtn} onPress={onOpenKcc}>
            <Text style={styles.applyBtnText}>{isHindi ? 'आवेदन करें' : 'Apply Now'}</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Milk Collection Summary */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {isHindi ? 'आज का सत्यापित दूध संग्रह' : "Today's Verified Milk Pours"}
          </Text>
          <Text style={styles.sectionCount}>
            {pourEvents.length} {isHindi ? 'सत्र पूर्ण' : 'Sessions'}
          </Text>
        </View>

        {pourEvents.map((pour) => (
          <View key={pour.eventId} style={styles.pourCard}>
            <View style={styles.pourCardHeader}>
              <Text style={styles.pourTime}>
                {new Date(pour.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <View style={styles.payoutBadge}>
                <Text style={styles.payoutBadgeText}>₹{pour.payoutINR} Direct Payout</Text>
              </View>
            </View>

            <View style={styles.metricGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Weight</Text>
                <Text style={styles.metricVal}>{pour.weightKg} kg</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Fat</Text>
                <Text style={[styles.metricVal, { color: '#10b981' }]}>{pour.fatPercent}%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>SNF</Text>
                <Text style={[styles.metricVal, { color: '#14b8a6' }]}>{pour.snfPercent}%</Text>
              </View>
            </View>
          </View>
        ))}

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
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#090d1a',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  farmerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  tagBadge: {
    backgroundColor: '#022c22',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagBadgeText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '700',
  },
  farmerSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  speechBtn: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  speechBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  speechBtnText: {
    fontSize: 18,
  },
  purityCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  purityHeader: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scoreCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  scoreNumber: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
  },
  scoreGrade: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700',
  },
  puritySub: {
    color: '#cbd5e1',
    fontSize: 12,
    textAlign: 'center',
  },
  highlight: {
    color: '#34d399',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  primaryActionBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#022c22',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: '#042f2e',
    borderColor: 'rgba(20, 184, 166, 0.4)',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#2dd4bf',
    fontSize: 13,
    fontWeight: '800',
  },
  kccBanner: {
    backgroundColor: 'rgba(6, 78, 59, 0.6)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  kccTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  kccTitle: {
    color: '#6ee7b7',
    fontSize: 13,
    fontWeight: '800',
  },
  kccSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  applyBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  applyBtnText: {
    color: '#022c22',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCount: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
  pourCard: {
    backgroundColor: '#090d1a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  pourCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pourTime: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  payoutBadge: {
    backgroundColor: '#022c22',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  payoutBadgeText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  metricVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
});
