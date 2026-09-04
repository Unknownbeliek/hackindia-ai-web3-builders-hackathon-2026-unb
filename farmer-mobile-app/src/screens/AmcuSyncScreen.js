import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView
} from 'react-native';

export default function AmcuSyncScreen({ language }) {
  const isHindi = language === 'HI';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>
              {isHindi ? 'AMCU Essae-SN8831 हार्डवेयर सिंक' : 'AMCU Essae-SN8831 Hardware Sync'}
            </Text>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>● ONLINE</Text>
            </View>
          </View>
          <Text style={styles.sub}>Serial: ESSAE-SN8831-VLC22 (Nissing Station)</Text>

          <View style={styles.grid}>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Lactometer Calibration</Text>
              <Text style={styles.gridValGreen}>100% Calibrated</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Bluetooth / NFC Signal</Text>
              <Text style={styles.gridValTeal}>-48 dBm (Strong)</Text>
            </View>
          </View>

          <View style={styles.bufferBox}>
            <Text style={styles.bufferLabel}>{isHindi ? 'ऑफलाइन कतार बफर:' : 'Offline Queue Buffer:'}</Text>
            <Text style={styles.bufferVal}>0 Pending • Cloud Sync Active</Text>
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
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  sub: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
    marginBottom: 14,
  },
  onlineBadge: {
    backgroundColor: '#022c22',
    borderColor: '#10b981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  onlineText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  gridBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  gridLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  gridValGreen: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  gridValTeal: {
    color: '#2dd4bf',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  bufferBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bufferLabel: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  bufferVal: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
