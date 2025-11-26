import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { makeQuestion } from '../utils/questionGenerator';

const STORAGE_KEY = '@mm_sessions';
const MAX_SESSIONS = 30;

export default function PracticeScreen({ route, navigation }) {
  const { topic, difficulty, sessionLength } = route.params;

  const [timeLeft, setTimeLeft] = useState(sessionLength);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionActive, setSessionActive] = useState(true);

  const timerRef = useRef(null);
  const attemptsRef = useRef(0);
  const correctRef = useRef(0);
  const responseTimesRef = useRef([]);

  // Initialize first question
  useEffect(() => {
    generateNewQuestion();
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start countdown timer
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Generate new question
  const generateNewQuestion = () => {
    const question = makeQuestion(topic, difficulty);
    setCurrentQuestion(question);
    setQuestionStartTime(Date.now());
  };

  // Handle answer submission
  const handleSubmit = async () => {
    if (!sessionActive) return;
    if (userAnswer.trim() === '') return;

    const responseTime = Date.now() - questionStartTime;
    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;

    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    
    if (isCorrect) {
      correctRef.current += 1;
      setCorrect(correctRef.current);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    responseTimesRef.current.push(responseTime);
    setResponseTimes(responseTimesRef.current);

    // Clear input and generate new question
    setUserAnswer('');
    generateNewQuestion();
  };

  // Handle skip
  const handleSkip = async () => {
    if (!sessionActive) return;

    const responseTime = Date.now() - questionStartTime;
    
    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    
    responseTimesRef.current.push(responseTime);
    setResponseTimes(responseTimesRef.current);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setUserAnswer('');
    generateNewQuestion();
  };

  // End session manually
  const handleEndSession = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this session early?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End', style: 'destructive', onPress: endSession },
      ]
    );
  };

  // End session and save results
  const endSession = async () => {
    setSessionActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Use ref values to ensure we get the latest counts
    const finalAttempts = attemptsRef.current;
    const finalCorrect = correctRef.current;
    const finalResponseTimes = responseTimesRef.current;

    // Calculate average response time
    const avgResponseMs =
      finalResponseTimes.length > 0
        ? Math.round(
            finalResponseTimes.reduce((a, b) => a + b, 0) / finalResponseTimes.length
          )
        : 0;

    const sessionData = {
      id: Date.now(),
      topic,
      difficulty,
      lengthSeconds: sessionLength,
      attempts: finalAttempts,
      correct: finalCorrect,
      avgResponseMs,
      timestamp: new Date().toISOString(),
    };

    // Save to AsyncStorage
    try {
      const existingSessions = await AsyncStorage.getItem(STORAGE_KEY);
      let sessions = existingSessions ? JSON.parse(existingSessions) : [];
      
      // Add new session at the beginning
      sessions.unshift(sessionData);
      
      // Keep only last 30 sessions
      if (sessions.length > MAX_SESSIONS) {
        sessions = sessions.slice(0, MAX_SESSIONS);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }

    // Navigate to Summary screen
    navigation.replace('Summary', { sessionData });
  };

  // Calculate accuracy
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with timer and progress */}
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time Left</Text>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
        
        <TouchableOpacity
          style={styles.endButton}
          onPress={handleEndSession}
          disabled={!sessionActive}
        >
          <Text style={styles.endButtonText}>End</Text>
        </TouchableOpacity>
      </View>

      {/* Question Display */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {currentQuestion ? currentQuestion.text : ''}
        </Text>
      </View>

      {/* Answer Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userAnswer}
          onChangeText={setUserAnswer}
          keyboardType="numeric"
          placeholder="Your answer"
          placeholderTextColor="#999"
          autoFocus
          onSubmitEditing={handleSubmit}
          editable={sessionActive}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={!sessionActive}
        >
          <Text style={styles.buttonText}>✓ Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}
          disabled={!sessionActive}
        >
          <Text style={[styles.buttonText, styles.skipButtonText]}>→ Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Display */}
      <View style={styles.progressCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Attempts</Text>
          <Text style={styles.statValue}>{attempts}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Correct</Text>
          <Text style={[styles.statValue, styles.correctValue]}>{correct}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={[styles.statValue, styles.accuracyValue]}>{accuracy}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  timerContainer: {
    alignItems: 'flex-start',
  },
  timerLabel: {
    fontSize: 14,
    color: '#636A74',
    marginBottom: 4,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#EF5350',
  },
  endButton: {
    backgroundColor: '#EF5350',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    marginBottom: 30,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  questionText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: '#43A047',
  },
  skipButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButtonText: {
    color: '#FB8C00',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#3A7AFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: '#636A74',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  correctValue: {
    color: '#43A047',
  },
  accuracyValue: {
    color: '#3A7AFE',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E7EF',
  },
});
