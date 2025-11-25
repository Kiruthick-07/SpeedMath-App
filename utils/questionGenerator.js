/**
 * Question Generator for Speed Math Trainer
 * Generates math questions based on topic and difficulty level
 */

/**
 * Get number range based on difficulty level
 * @param {number} difficulty - Level 1-5
 * @returns {object} { min, max }
 */
function getRange(difficulty) {
  switch (difficulty) {
    case 1:
      return { min: 1, max: 9 };
    case 2:
      return { min: 2, max: 99 };
    case 3:
      return { min: 10, max: 999 };
    case 4:
      return { min: 50, max: 9999 };
    case 5:
      return { min: 100, max: 99999 };
    default:
      return { min: 1, max: 9 };
  }
}

/**
 * Generate random integer within range
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Make a question based on topic and difficulty
 * @param {string} topic - 'addition', 'subtraction', 'multiplication', 'division', 'mixed'
 * @param {number} difficulty - Level 1-5
 * @returns {object} { text: string, answer: number }
 */
export function makeQuestion(topic, difficulty) {
  const { min, max } = getRange(difficulty);
  
  // If mixed, pick a random topic
  let actualTopic = topic;
  if (topic === 'mixed') {
    const topics = ['addition', 'subtraction', 'multiplication', 'division'];
    actualTopic = topics[Math.floor(Math.random() * topics.length)];
  }
  
  let num1, num2, answer, text;
  
  switch (actualTopic) {
    case 'addition':
      num1 = randomInt(min, max);
      num2 = randomInt(min, max);
      answer = num1 + num2;
      text = `${num1} + ${num2}`;
      break;
      
    case 'subtraction':
      num1 = randomInt(min, max);
      num2 = randomInt(min, max);
      // Ensure positive result
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      answer = num1 - num2;
      text = `${num1} − ${num2}`;
      break;
      
    case 'multiplication':
      num1 = randomInt(min, max);
      num2 = randomInt(min, max);
      answer = num1 * num2;
      text = `${num1} × ${num2}`;
      break;
      
    case 'division':
      // Generate divisor and quotient, then compute dividend
      num2 = randomInt(Math.max(min, 2), max); // divisor (avoid 0 and 1)
      const quotient = randomInt(min, max);
      num1 = num2 * quotient; // dividend (ensures clean division)
      answer = quotient;
      text = `${num1} ÷ ${num2}`;
      break;
      
    default:
      num1 = randomInt(min, max);
      num2 = randomInt(min, max);
      answer = num1 + num2;
      text = `${num1} + ${num2}`;
  }
  
  return { text, answer };
}
