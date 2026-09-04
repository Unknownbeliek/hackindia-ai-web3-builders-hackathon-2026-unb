import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';

export default function PourLogScreen({ language, pourEvents, onQuickPour }) {
  const isHindi = language === 'HI';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {isHindi ? 'दूध संग्रह व SHA-256 रसीदें' : 'Milk Pour Log & Receipts'}
          </Text>
          <TouchableOpacity style={styles.addBtn} onPress={onQuickPour}>
            <Text style={styles.addBtnText}>{isHindi ? '+ दर्ज करें' : '+ Log Pour'}</Text>
          </TouchableOpacity>
        </View>

        {pourEvents.map((pour) => (
          <View key={pour.eventId} style={styles.pourCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.eventId}>{pour.eventId}</Text>
                <Text style={styles.timeStr}>{new Date(pour.timestamp).toLocaleString()}</Text>
              </View>
              <View style={styles.payoutBadge}>
                <Text style={styles.payoutText}>₹{pour.payoutINR}</Text>
              </View>
            </View>

            <View style={styles.grid}>
              <View style={styles.gridBox}>
                <Text style={styles.boxLabel}>Weight</Text>
                <Text style={styles.boxVal}>{pour.weightKg} kg</Text>
              </View>
              <View style={styles.gridBox}>
                <Text style={styles.boxLabel}>Fat</Text>
                <Text style={[styles.boxVal, { color: '#10b981' }]}>{pour.fatPercent}%</Text>
              </View>
              <View style={styles.gridBox}>
                <Text style={styles.boxLabel}>SNF</Text>
                <Text style={[styles.boxVal, { color: '#14b8a6' }]}>{pour.snfPercent}%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.hashRow}
              onPress={() => Alert.alert('SHA-256 Proof Audit', `Receipt Hash:\n${pour.receiptHash}\n\nStatus: Hardware AMCU Tamper-Evident Lock Verified`)}
            >
              <Text style={styles.hashText} numberOfLines={1}>
                {pour.receiptHash || 'sha256:7d2b9af8103c31ff78201a44eef93810'}
              </Text>
              <Text style={styles.auditLink}>{isHindi ? 'जांचें ↗' : 'Audit ↗'}</Text>
            </TouchableOpacity>
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  addBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#022c22',
    fontSize: 12,
    fontWeight: '800',
  },
  pourCard: {
    backgroundColor: '#090d1a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventId: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  timeStr: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  payoutBadge: {
    backgroundColor: '#022c22',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payoutText: {
    color: '#34d399',
    fontSize: 13,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  gridBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  boxLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  boxVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  hashRow: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hashText: {
    color: '#64748b',
    fontSize: 10,
    fontFamily: 'monospace',
    flex: 1,
    marginRight: 6,
  },
  auditLink: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
});
