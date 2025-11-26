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
import * as Haptics from 'expo-haptics';

export default function SessionLengthScreen({ route, navigation }) {
  const { topic, difficulty } = route.params;

  let [fontsLoaded] = useFonts({
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const sessionLengths = [
    { value: 30, label: '30 Seconds', icon: '⚡', desc: 'Quick Practice' },
    { value: 60, label: '60 Seconds', icon: '🔥', desc: 'Standard Session' },
    { value: 90, label: '90 Seconds', icon: '💪', desc: 'Extended Practice' },
    { value: 120, label: '120 Seconds', icon: '🚀', desc: 'Challenge Mode' },
  ];

  const handleSessionSelect = (sessionLength) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Loading', { topic, difficulty, sessionLength });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Session Length</Text>
          <Text style={styles.subtitle}>How long do you want to practice?</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sessionList}>
          {sessionLengths.map((s) => (
            <TouchableOpacity
              key={s.value}
              style={styles.sessionCard}
              onPress={() => handleSessionSelect(s.value)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.sessionIcon}>{s.icon}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionLabel}>{s.label}</Text>
                <Text style={styles.sessionDesc}>{s.desc}</Text>
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
  sessionList: {
    gap: 16,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3A7AFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionIcon: {
    fontSize: 28,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  sessionDesc: {
    fontSize: 14,
    color: '#636A74',
  },
});
