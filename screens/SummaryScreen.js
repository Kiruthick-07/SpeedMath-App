import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

const STORAGE_KEY = '@mm_sessions';

export default function SummaryScreen({ route, navigation }) {
  const { sessionData } = route.params;
  
  let [fontsLoaded] = useFonts({
    Poppins_800ExtraBold,
  });

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!fontsLoaded) return;
    loadSessions();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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

  const deleteSession = async (sessionId) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedSessions = sessions.filter(s => s.id !== sessionId);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
              setSessions(updatedSessions);
            } catch (error) {
              console.error('Error deleting session:', error);
            }
          },
        },
      ]
    );
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
                    <View style={styles.historyHeaderLeft}>
                      <Text style={styles.historyTopic}>
                        {getTopicLabel(session.topic)} - Level {session.difficulty}
                      </Text>
                      <Text style={styles.historyDate}>
                        {formatDate(session.timestamp)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteSession(session.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
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
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#3A7AFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultLabel: {
    fontSize: 15,
    color: '#636A74',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  correctText: {
    color: '#43A047',
    fontSize: 18,
    fontWeight: '700',
  },
  accuracyText: {
    color: '#3A7AFE',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  historyTitle: {
    fontSize: 26,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#3A7AFE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyHeaderLeft: {
    flex: 1,
  },
  historyTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#9AA3B1',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 10,
  },
  deleteIcon: {
    fontSize: 20,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  historyStat: {
    alignItems: 'center',
  },
  historyStatValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A7AFE',
  },
  historyStatLabel: {
    fontSize: 12,
    color: '#636A74',
    marginTop: 4,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 15,
    color: '#9AA3B1',
  },
  backButton: {
    backgroundColor: '#3A7AFE',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
