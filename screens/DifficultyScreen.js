import React from 'react';
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

export default function DifficultyScreen({ route, navigation }) {
  const { topic } = route.params;

  let [fontsLoaded] = useFonts({
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const difficulties = [
    { value: 1, label: 'Level 1', icon: '⭐', desc: 'Numbers 1-9', color: '#43A047' },
    { value: 2, label: 'Level 2', icon: '⭐⭐', desc: 'Numbers 2-99', color: '#1E88E5' },
    { value: 3, label: 'Level 3', icon: '⭐⭐⭐', desc: 'Numbers 10-999', color: '#FB8C00' },
    { value: 4, label: 'Level 4', icon: '⭐⭐⭐⭐', desc: 'Numbers 50-9999', color: '#8E24AA' },
    { value: 5, label: 'Level 5', icon: '⭐⭐⭐⭐⭐', desc: 'Numbers 100-99999', color: '#EF5350' },
  ];

  const handleDifficultySelect = (difficulty) => {
    navigation.navigate('SessionLength', { topic, difficulty });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Choose Difficulty</Text>
          <Text style={styles.subtitle}>Select your skill level</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.difficultyList}>
          {difficulties.map((d) => (
            <TouchableOpacity
              key={d.value}
              style={[styles.difficultyCard, { borderLeftColor: d.color }]}
              onPress={() => handleDifficultySelect(d.value)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.difficultyIcon}>{d.icon}</Text>
              </View>
              <View style={styles.difficultyInfo}>
                <Text style={styles.difficultyLabel}>{d.label}</Text>
                <Text style={styles.difficultyDesc}>{d.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7EF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 32,
    color: '#3A7AFE',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#636A74',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  difficultyList: {
    gap: 16,
  },
  difficultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3A7AFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 6,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  difficultyIcon: {
    fontSize: 20,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  difficultyDesc: {
    fontSize: 14,
    color: '#636A74',
  },
});
