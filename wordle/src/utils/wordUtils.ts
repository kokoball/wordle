import { ANSWER_STATUS } from './consts';

const WORDS = ['apple', 'grape', 'melon', 'berry', 'peach'];

export const getRandomWord = () =>
  WORDS[Math.floor(Math.random() * WORDS.length)];

export const checkGuess = (guess: string, answer: string) => {
  return guess.split('').map((letter, index) => {
    if (letter === answer[index]) return ANSWER_STATUS.CORRECT;
    if (answer.includes(letter)) return ANSWER_STATUS.PRESENT;
    return ANSWER_STATUS.ABSENT;
  });
};
