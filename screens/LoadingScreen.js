import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoadingScreen({ route, navigation }) {
  const { topic, difficulty, sessionLength } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [spinAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Navigate to Practice after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Practice', {
        topic,
        difficulty,
        sessionLength,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getTopicLabel = (t) => {
    const labels = {
      mixed: 'Mixed',
      addition: 'Addition',
      subtraction: 'Subtraction',
      multiplication: 'Multiplication',
      division: 'Division',
    };
    return labels[t] || t;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.loadingCircle,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <Text style={styles.loadingIcon}>🧮</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.loadingText}>Preparing Questions...</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Topic:</Text>
              <Text style={styles.infoValue}>{getTopicLabel(topic)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Difficulty:</Text>
              <Text style={styles.infoValue}>Level {difficulty}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{sessionLength}s</Text>
            </View>
          </View>
        </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingIcon: {
    fontSize: 64,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#2563EB',
    borderRadius: 15,
    padding: 20,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#93C5FD',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
