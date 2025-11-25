import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SessionLengthScreen({ route, navigation }) {
  const { topic, difficulty } = route.params;

  const sessionLengths = [
    { value: 30, label: '30 Seconds', icon: '⚡', desc: 'Quick Practice' },
    { value: 60, label: '60 Seconds', icon: '🔥', desc: 'Standard Session' },
    { value: 90, label: '90 Seconds', icon: '💪', desc: 'Extended Practice' },
    { value: 120, label: '120 Seconds', icon: '🚀', desc: 'Challenge Mode' },
  ];

  const handleSessionSelect = (sessionLength) => {
    navigation.navigate('Loading', { topic, difficulty, sessionLength });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Session Length</Text>
          <Text style={styles.subtitle}>How long do you want to practice?</Text>
        </View>

        <View style={styles.sessionList}>
          {sessionLengths.map((s) => (
            <TouchableOpacity
              key={s.value}
              style={styles.sessionCard}
              onPress={() => handleSessionSelect(s.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.sessionIcon}>{s.icon}</Text>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionLabel}>{s.label}</Text>
                <Text style={styles.sessionDesc}>{s.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#93C5FD',
    textAlign: 'center',
  },
  sessionList: {
    flex: 1,
    gap: 15,
  },
  sessionCard: {
    backgroundColor: '#2563EB',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sessionIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  sessionDesc: {
    fontSize: 14,
    color: '#BFDBFE',
  },
  backButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
