import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function DifficultyScreen({ route, navigation }) {
  const { topic } = route.params;

  const difficulties = [
    { value: 1, label: 'Level 1', icon: '⭐', desc: 'Numbers 1-9', color: '#10B981' },
    { value: 2, label: 'Level 2', icon: '⭐⭐', desc: 'Numbers 2-99', color: '#3B82F6' },
    { value: 3, label: 'Level 3', icon: '⭐⭐⭐', desc: 'Numbers 10-999', color: '#8B5CF6' },
    { value: 4, label: 'Level 4', icon: '⭐⭐⭐⭐', desc: 'Numbers 50-9999', color: '#F59E0B' },
    { value: 5, label: 'Level 5', icon: '⭐⭐⭐⭐⭐', desc: 'Numbers 100-99999', color: '#EF4444' },
  ];

  const handleDifficultySelect = (difficulty) => {
    navigation.navigate('SessionLength', { topic, difficulty });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Difficulty</Text>
          <Text style={styles.subtitle}>Select your skill level</Text>
        </View>

        <View style={styles.difficultyList}>
          {difficulties.map((d) => (
            <TouchableOpacity
              key={d.value}
              style={[styles.difficultyCard, { borderLeftColor: d.color }]}
              onPress={() => handleDifficultySelect(d.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.difficultyIcon}>{d.icon}</Text>
              <View style={styles.difficultyInfo}>
                <Text style={styles.difficultyLabel}>{d.label}</Text>
                <Text style={styles.difficultyDesc}>{d.desc}</Text>
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
  difficultyList: {
    flex: 1,
    gap: 15,
  },
  difficultyCard: {
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
    borderLeftWidth: 6,
  },
  difficultyIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  difficultyDesc: {
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
