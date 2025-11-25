import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  const [topic, setTopic] = useState('mixed');
  const [difficulty, setDifficulty] = useState(1);
  const [sessionLength, setSessionLength] = useState(60);

  const topics = [
    { value: 'mixed', label: 'Mixed' },
    { value: 'addition', label: 'Addition' },
    { value: 'subtraction', label: 'Subtraction' },
    { value: 'multiplication', label: 'Multiplication' },
    { value: 'division', label: 'Division' },
  ];

  const difficulties = [
    { value: 1, label: 'Level 1', desc: '(1-9)' },
    { value: 2, label: 'Level 2', desc: '(2-99)' },
    { value: 3, label: 'Level 3', desc: '(10-999)' },
    { value: 4, label: 'Level 4', desc: '(50-9999)' },
    { value: 5, label: 'Level 5', desc: '(100-99999)' },
  ];

  const sessionLengths = [
    { value: 30, label: '30s' },
    { value: 60, label: '60s' },
    { value: 90, label: '90s' },
    { value: 120, label: '120s' },
  ];

  const handleStartPractice = () => {
    navigation.navigate('Practice', {
      topic,
      difficulty,
      sessionLength,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Speed Math Trainer</Text>
        <Text style={styles.subtitle}>Improve Your Mental Arithmetic</Text>

        {/* Topic Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Topic</Text>
          <View style={styles.optionGrid}>
            {topics.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.optionButton,
                  topic === t.value && styles.optionButtonSelected,
                ]}
                onPress={() => setTopic(t.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    topic === t.value && styles.optionTextSelected,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Difficulty</Text>
          <View style={styles.optionGrid}>
            {difficulties.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[
                  styles.optionButton,
                  difficulty === d.value && styles.optionButtonSelected,
                ]}
                onPress={() => setDifficulty(d.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    difficulty === d.value && styles.optionTextSelected,
                  ]}
                >
                  {d.label}
                </Text>
                <Text
                  style={[
                    styles.optionDesc,
                    difficulty === d.value && styles.optionDescSelected,
                  ]}
                >
                  {d.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Session Length Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Length</Text>
          <View style={styles.optionRow}>
            {sessionLengths.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[
                  styles.optionButton,
                  sessionLength === s.value && styles.optionButtonSelected,
                ]}
                onPress={() => setSessionLength(s.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    sessionLength === s.value && styles.optionTextSelected,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartPractice}
        >
          <Text style={styles.startButtonText}>Start Practice</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    minWidth: 100,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
  optionDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  optionDescSelected: {
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#34C759',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});
