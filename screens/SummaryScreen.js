import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mm_sessions';

export default function SummaryScreen({ route, navigation }) {
  const { sessionData } = route.params;
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const existingSessions = await AsyncStorage.getItem(STORAGE_KEY);
      if (existingSessions) {
        setSessions(JSON.parse(existingSessions));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const accuracy = sessionData.attempts > 0
    ? Math.round((sessionData.correct / sessionData.attempts) * 100)
    : 0;

  const getTopicLabel = (topic) => {
    return topic.charAt(0).toUpperCase() + topic.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Session Complete!</Text>

        {/* Current Session Results */}
        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Topic:</Text>
            <Text style={styles.resultValue}>
              {getTopicLabel(sessionData.topic)}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Difficulty:</Text>
            <Text style={styles.resultValue}>Level {sessionData.difficulty}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Session Length:</Text>
            <Text style={styles.resultValue}>{sessionData.lengthSeconds}s</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Correct Answers:</Text>
            <Text style={[styles.resultValue, styles.correctText]}>
              {sessionData.correct}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Attempts:</Text>
            <Text style={styles.resultValue}>{sessionData.attempts}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Accuracy:</Text>
            <Text style={[styles.resultValue, styles.accuracyText]}>
              {accuracy}%
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Avg Response Time:</Text>
            <Text style={styles.resultValue}>
              {(sessionData.avgResponseMs / 1000).toFixed(2)}s
            </Text>
          </View>
        </View>

        {/* Session History */}
        <Text style={styles.historyTitle}>Recent Sessions</Text>
        
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No previous sessions yet</Text>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {sessions.map((session, index) => {
              const sessAccuracy = session.attempts > 0
                ? Math.round((session.correct / session.attempts) * 100)
                : 0;
              
              return (
                <View key={session.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyTopic}>
                      {getTopicLabel(session.topic)} - Level {session.difficulty}
                    </Text>
                    <Text style={styles.historyDate}>
                      {formatDate(session.timestamp)}
                    </Text>
                  </View>
                  
                  <View style={styles.historyStats}>
                    <View style={styles.historyStat}>
                      <Text style={styles.historyStatValue}>
                        {session.correct}/{session.attempts}
                      </Text>
                      <Text style={styles.historyStatLabel}>Correct</Text>
                    </View>
                    
                    <View style={styles.historyStat}>
                      <Text style={styles.historyStatValue}>{sessAccuracy}%</Text>
                      <Text style={styles.historyStatLabel}>Accuracy</Text>
                    </View>
                    
                    <View style={styles.historyStat}>
                      <Text style={styles.historyStatValue}>
                        {(session.avgResponseMs / 1000).toFixed(1)}s
                      </Text>
                      <Text style={styles.historyStatLabel}>Avg Time</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Back to Home Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToHome}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
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
    marginBottom: 25,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  correctText: {
    color: '#34C759',
    fontSize: 20,
    fontWeight: 'bold',
  },
  accuracyText: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    marginBottom: 10,
  },
  historyTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  historyStat: {
    alignItems: 'center',
  },
  historyStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  historyStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
