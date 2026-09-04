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

export default function CattleScreen({ language }) {
  const isHindi = language === 'HI';

  const [cattleList] = useState([
    { id: '1', breed: 'Murrah Buffalo (मुर्रा भैंस)', tag: '840003129940112', dailyYield: '12.5 L/day', status: 'HEALTHY', vaccine: 'FMD Verified', icon: '🐂' },
    { id: '2', breed: 'Sahiwal Cow (साहीवाल गाय)', tag: '840003129940113', dailyYield: '9.0 L/day', status: 'HEALTHY', vaccine: 'HS Booster Done', icon: '🐄' },
    { id: '3', breed: 'Gir Cow (गीर गाय)', tag: '840003129940114', dailyYield: '10.2 L/day', status: 'HEALTHY', vaccine: 'Brucellosis Clear', icon: '🐄' },
    { id: '4', breed: 'Murrah Buffalo (मुर्रा भैंस #2)', tag: '840003129940115', dailyYield: '11.8 L/day', status: 'HEALTHY', vaccine: 'FMD Verified', icon: '🐂' }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {isHindi ? 'पंजीकृत पशुधन व NDLM टैग' : 'Registered Cattle & NDLM Tags'}
          </Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => Alert.alert('Register NDLM Tag', 'Scan or enter 15-digit ear tag number to pair with cattle.')}
          >
            <Text style={styles.addBtnText}>{isHindi ? '+ नया टैग' : '+ Add Tag'}</Text>
          </TouchableOpacity>
        </View>

        {cattleList.map((item) => (
          <View key={item.id} style={styles.cattleCard}>
            <View style={styles.leftCol}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View>
                <Text style={styles.breedText}>{item.breed}</Text>
                <Text style={styles.tagText}>NDLM: #{item.tag}</Text>
                <View style={styles.subRow}>
                  <View style={styles.vacBadge}>
                    <Text style={styles.vacText}>{item.vaccine}</Text>
                  </View>
                  <Text style={styles.yieldText}>• {item.dailyYield}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
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
  cattleCard: {
    backgroundColor: '#090d1a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  breedText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  tagText: {
    color: '#34d399',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  vacBadge: {
    backgroundColor: '#022c22',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vacText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '700',
  },
  yieldText: {
    color: '#94a3b8',
    fontSize: 10,
  },
  statusBadge: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700',
  },
});
