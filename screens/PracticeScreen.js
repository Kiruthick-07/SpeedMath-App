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
  const handleSubmit = () => {
    if (!sessionActive) return;
    if (userAnswer.trim() === '') return;

    const responseTime = Date.now() - questionStartTime;
    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;

    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    
    if (isCorrect) {
      correctRef.current += 1;
      setCorrect(correctRef.current);
    }
    
    responseTimesRef.current.push(responseTime);
    setResponseTimes(responseTimesRef.current);

    // Clear input and generate new question
    setUserAnswer('');
    generateNewQuestion();
    Keyboard.dismiss();
  };

  // Handle skip
  const handleSkip = () => {
    if (!sessionActive) return;

    const responseTime = Date.now() - questionStartTime;
    
    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    
    responseTimesRef.current.push(responseTime);
    setResponseTimes(responseTimesRef.current);

    setUserAnswer('');
    generateNewQuestion();
    Keyboard.dismiss();
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      {/* Header with timer and progress */}
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time</Text>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {correct} / {attempts}
          </Text>
          <Text style={styles.progressLabel}>
            {accuracy}% accuracy
          </Text>
        </View>
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
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}
          disabled={!sessionActive}
        >
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* End Session Button */}
      <TouchableOpacity
        style={styles.endButton}
        onPress={handleEndSession}
        disabled={!sessionActive}
      >
        <Text style={styles.endButtonText}>End Session</Text>
      </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  questionContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  skipButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  endButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
