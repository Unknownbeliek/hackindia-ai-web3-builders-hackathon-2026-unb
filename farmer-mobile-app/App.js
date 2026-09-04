import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert
} from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import PourLogScreen from './src/screens/PourLogScreen';
import CattleScreen from './src/screens/CattleScreen';
import KccLoanScreen from './src/screens/KccLoanScreen';
import AmcuSyncScreen from './src/screens/AmcuSyncScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('HOME'); // 'HOME' | 'POURS' | 'CATTLE' | 'KCC' | 'AMCU' | 'CALC'
  const [language, setLanguage] = useState('EN'); // 'EN' | 'HI'

  const [farmer] = useState({
    farmerId: '201410000123',
    name: 'Ramesh Kumar',
    ndlmTag: '840003129940112',
    animalBreed: 'Murrah Buffalo',
    registeredCows: 4,
    purityScore: 87
  });

  const [pourEvents, setPourEvents] = useState([
    {
      eventId: 'PE-20260831-001',
      farmerId: '201410000123',
      farmerName: 'Ramesh Kumar',
      timestamp: new Date().toISOString(),
      weightKg: 8.5,
      fatPercent: 4.2,
      snfPercent: 8.7,
      payoutINR: 382.50,
      receiptHash: 'sha256:7d2b9af8103c31ff78201a44eef93810'
    },
    {
      eventId: 'PE-20260831-002',
      farmerId: '201410000123',
      farmerName: 'Ramesh Kumar',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      weightKg: 6.2,
      fatPercent: 4.5,
      snfPercent: 8.9,
      payoutINR: 297.60,
      receiptHash: 'sha256:8e3c0bf9114d42aa89312b55ff012b55'
    }
  ]);

  // Modal State
  const [showQuickPourModal, setShowQuickPourModal] = useState(false);
  const [pourWeightInput, setPourWeightInput] = useState('8.5');
  const [pourFatInput, setPourFatInput] = useState('4.2');
  const [pourSnfInput, setPourSnfInput] = useState('8.7');

  const handleAddPour = () => {
    const w = parseFloat(pourWeightInput) || 8.0;
    const f = parseFloat(pourFatInput) || 4.2;
    const s = parseFloat(pourSnfInput) || 8.7;
    const payout = +((f * 7.5 + s * 4.0) * w).toFixed(2);

    const newEvent = {
      eventId: `PE-20260831-${String(pourEvents.length + 1).padStart(3, '0')}`,
      farmerId: farmer.farmerId,
      farmerName: farmer.name,
      timestamp: new Date().toISOString(),
      weightKg: w,
      fatPercent: f,
      snfPercent: s,
      payoutINR: payout,
      receiptHash: `sha256:${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`
    };

    setPourEvents([newEvent, ...pourEvents]);
    setShowQuickPourModal(false);
    Alert.alert('Pour Recorded!', `Logged ${w} kg milk pour. Direct Payout ₹${payout} sent to bank.`);
  };

  const isHindi = language === 'HI';

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />

      {/* Main Top Header Navigation */}
      <View style={styles.headerBar}>
        <View style={styles.headerBrand}>
          <Text style={styles.headerTitle}>Anveshana Kisan</Text>
          <View style={styles.dpiTag}>
            <Text style={styles.dpiTagText}>NDLM DPI</Text>
          </View>
        </View>

        {/* Multi-Language Switcher (English EN / Hindi हिंदी) */}
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
        >
          <Text style={styles.langBtnText}>🌐 {language === 'EN' ? 'EN' : 'हिंदी'}</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Body Router */}
      <View style={styles.body}>
        {activeTab === 'HOME' && (
          <HomeScreen
            language={language}
            farmer={farmer}
            pourEvents={pourEvents}
            onQuickPour={() => setShowQuickPourModal(true)}
            onOpenKcc={() => setActiveTab('KCC')}
            onOpenCalculator={() => setActiveTab('CALC')}
          />
        )}

        {activeTab === 'POURS' && (
          <PourLogScreen
            language={language}
            pourEvents={pourEvents}
            onQuickPour={() => setShowQuickPourModal(true)}
          />
        )}

        {activeTab === 'CATTLE' && (
          <CattleScreen language={language} />
        )}

        {activeTab === 'KCC' && (
          <KccLoanScreen language={language} />
        )}

        {activeTab === 'AMCU' && (
          <AmcuSyncScreen language={language} />
        )}

        {activeTab === 'CALC' && (
          <CalculatorScreen language={language} />
        )}
      </View>

      {/* Bottom App Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'HOME' && styles.navItemActive]}
          onPress={() => setActiveTab('HOME')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'HOME' && styles.navTextActive]}>
            {isHindi ? 'मुख्य' : 'Home'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'POURS' && styles.navItemActive]}
          onPress={() => setActiveTab('POURS')}
        >
          <Text style={styles.navIcon}>🥛</Text>
          <Text style={[styles.navText, activeTab === 'POURS' && styles.navTextActive]}>
            {isHindi ? 'रसीदें' : 'Pours'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'CATTLE' && styles.navItemActive]}
          onPress={() => setActiveTab('CATTLE')}
        >
          <Text style={styles.navIcon}>🐄</Text>
          <Text style={[styles.navText, activeTab === 'CATTLE' && styles.navTextActive]}>
            {isHindi ? 'पशुधन' : 'Cattle'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'KCC' && styles.navItemActive]}
          onPress={() => setActiveTab('KCC')}
        >
          <Text style={styles.navIcon}>💳</Text>
          <Text style={[styles.navText, activeTab === 'KCC' && styles.navTextActive]}>
            {isHindi ? 'केसीसी' : 'KCC'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'AMCU' && styles.navItemActive]}
          onPress={() => setActiveTab('AMCU')}
        >
          <Text style={styles.navIcon}>⚡</Text>
          <Text style={[styles.navText, activeTab === 'AMCU' && styles.navTextActive]}>
            {isHindi ? 'एएमसीयू' : 'AMCU'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* QUICK POUR MODAL */}
      <Modal visible={showQuickPourModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isHindi ? 'दूध संग्रह दर्ज करें' : "Log Today's Milk Pour"}
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{isHindi ? 'वजन (kg)' : 'Weight (kg)'}</Text>
              <TextInput
                style={styles.fieldInput}
                keyboardType="numeric"
                value={pourWeightInput}
                onChangeText={setPourWeightInput}
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>{isHindi ? 'फैट (%)' : 'Fat (%)'}</Text>
                <TextInput
                  style={[styles.fieldInput, { color: '#34d399' }]}
                  keyboardType="numeric"
                  value={pourFatInput}
                  onChangeText={setPourFatInput}
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>{isHindi ? 'एसएनएफ (%)' : 'SNF (%)'}</Text>
                <TextInput
                  style={[styles.fieldInput, { color: '#2dd4bf' }]}
                  keyboardType="numeric"
                  value={pourSnfInput}
                  onChangeText={setPourSnfInput}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.submitModalBtn} onPress={handleAddPour}>
                <Text style={styles.submitModalText}>{isHindi ? 'दर्ज करें' : 'Submit to AMCU'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setShowQuickPourModal(false)}>
                <Text style={styles.cancelModalText}>{isHindi ? 'रद्द करें' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#070b14',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#090d1a',
    borderColor: '#1e293b',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  dpiTag: {
    backgroundColor: '#022c22',
    borderColor: '#10b981',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dpiTagText: {
    color: '#34d399',
    fontSize: 9,
    fontWeight: '800',
  },
  langBtn: {
    backgroundColor: '#042f2e',
    borderColor: '#14b8a6',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langBtnText: {
    color: '#2dd4bf',
    fontSize: 11,
    fontWeight: '800',
  },
  body: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#090d1a',
    borderTopWidth: 1,
    borderColor: '#1e293b',
    paddingVertical: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navItemActive: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
  },
  navIcon: {
    fontSize: 18,
  },
  navText: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  navTextActive: {
    color: '#34d399',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#090d1a',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 4,
  },
  fieldInput: {
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
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  submitModalBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitModalText: {
    color: '#022c22',
    fontSize: 12,
    fontWeight: '800',
  },
  cancelModalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelModalText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
});
