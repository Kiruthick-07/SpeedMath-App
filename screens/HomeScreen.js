import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    { value: 'mixed', label: 'Mixed', icon: '🔀', desc: 'All Operations' },
    { value: 'addition', label: 'Addition', icon: '➕', desc: 'Add Numbers' },
    { value: 'subtraction', label: 'Subtraction', icon: '➖', desc: 'Subtract Numbers' },
    { value: 'multiplication', label: 'Multiplication', icon: '✖️', desc: 'Multiply Numbers' },
    { value: 'division', label: 'Division', icon: '➗', desc: 'Divide Numbers' },
  ];

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    navigation.navigate('Difficulty', { topic });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Speed Math Trainer</Text>
          <Text style={styles.subtitle}>Choose Your Topic</Text>
        </View>

        <View style={styles.topicGrid}>
          {topics.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={styles.topicCard}
              onPress={() => handleTopicSelect(t.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.topicIcon}>{t.icon}</Text>
              <Text style={styles.topicLabel}>{t.label}</Text>
              <Text style={styles.topicDesc}>{t.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: 40,
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
  topicGrid: {
    flex: 1,
    gap: 15,
  },
  topicCard: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  topicIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  topicLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  topicDesc: {
    fontSize: 14,
    color: '#BFDBFE',
  },
});
