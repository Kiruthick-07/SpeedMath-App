# Speed Math Trainer

A React Native mobile app built with Expo to help users improve mental arithmetic skills.

## Features

- **Multiple Topics**: Practice addition, subtraction, multiplication, division, or mixed operations
- **5 Difficulty Levels**: From basic (1-9) to advanced (100-99999)
- **Timed Sessions**: Choose 30, 60, 90, or 120-second practice sessions
- **Real-time Tracking**: Monitor correct answers, accuracy, and average response time
- **Session History**: View your last 30 practice sessions
- **Offline-First**: All data stored locally using AsyncStorage

## Tech Stack

- **Expo** (React Native)
- **JavaScript**
- **React Navigation** for screen navigation
- **AsyncStorage** for local data persistence
- **React Hooks** for state management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

## Project Structure

```
SpeedMath-App/
├── App.js                          # Main app with navigation setup
├── screens/
│   ├── HomeScreen.js              # Topic, difficulty, and session length selection
│   ├── PracticeScreen.js          # Practice session with timer and questions
│   └── SummaryScreen.js           # Results and session history
├── utils/
│   └── questionGenerator.js       # Math question generation logic
├── package.json
├── app.json
└── babel.config.js
```

## How to Use

1. **Home Screen**: Select your practice preferences
   - Choose a topic (mixed, addition, subtraction, multiplication, or division)
   - Select difficulty level (1-5)
   - Pick session length (30-120 seconds)
   - Tap "Start Practice"

2. **Practice Screen**: Answer questions as fast as you can
   - Type your answer in the input field
   - Tap "Submit" to check your answer
   - Tap "Skip" to move to the next question
   - Track your progress in real-time
   - End session early if needed

3. **Summary Screen**: Review your performance
   - See detailed results for your session
   - View accuracy and average response time
   - Browse your last 30 session history
   - Return to home to start a new session

## Question Difficulty Levels

- **Level 1**: Numbers 1-9
- **Level 2**: Numbers 2-99
- **Level 3**: Numbers 10-999
- **Level 4**: Numbers 50-9999
- **Level 5**: Numbers 100-99999

## Data Storage

All session data is stored locally on your device using AsyncStorage. The app keeps a maximum of 30 sessions, automatically removing older ones.

## License

MIT
