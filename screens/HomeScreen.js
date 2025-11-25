import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

export default function HomeScreen({ navigation }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  let [fontsLoaded] = useFonts({
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const topics = [
    { value: 'mixed', label: 'Mixed', icon: '🔀', desc: 'All Operations', accent: '#3A7AFE' },
    { value: 'addition', label: 'Addition', icon: '➕', desc: 'Add Numbers', accent: '#43A047' },
    { value: 'subtraction', label: 'Subtraction', icon: '➖', desc: 'Subtract Numbers', accent: '#FB8C00' },
    { value: 'multiplication', label: 'Multiplication', icon: '✖️', desc: 'Multiply Numbers', accent: '#8E24AA' },
    { value: 'division', label: 'Division', icon: '➗', desc: 'Divide Numbers', accent: '#EF5350' },
  ];

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    navigation.navigate('Difficulty', { topic });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Speed Math Trainer</Text>
        <Text style={styles.subtitle}>Choose Your Topic</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topicGrid}>
          {topics.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={styles.topicCard}
              onPress={() => handleTopicSelect(t.value)}
              activeOpacity={0.7}
            >
              <View style={[styles.accentBar, { backgroundColor: t.accent }]} />
              <View style={styles.iconContainer}>
                <Text style={styles.topicIcon}>{t.icon}</Text>
              </View>
              <View style={styles.topicContent}>
                <Text style={styles.topicLabel}>{t.label}</Text>
                <Text style={styles.topicDesc}>{t.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>Developed by Kiruthick R</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7EF',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#636A74',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topicGrid: {
    gap: 16,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3A7AFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 16,
  },
  topicIcon: {
    fontSize: 28,
  },
  topicContent: {
    flex: 1,
  },
  topicLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  topicDesc: {
    fontSize: 14,
    color: '#636A74',
  },
  watermark: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  watermarkText: {
    fontSize: 11,
    color: '#375a8bff',
    opacity: 0.6,
  },
});
