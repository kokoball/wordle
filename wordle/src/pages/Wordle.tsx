import React, { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import Board from '@/components/Board/Board';
import Keyboard from '@/components/Keyboard/Keyboard';
import { ANSWER_STATUS, DICTIONARY_API } from '@/lib/consts';
import { useParams } from 'react-router-dom';
import { decrypt } from '@/lib/utils';

const App: React.FC = () => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [usedChars, setUsedChars] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const params = useParams<{ word: string }>();
  const solution = decrypt(params.word)?.toUpperCase() || 'WORLD';

  const onEnter = async () => {
    if (currentGuess.length !== 5) return;

    try {
      const response = await axios.get(DICTIONARY_API + currentGuess);
      if (response.status === 200) {
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess('');

        const updatedChars = { ...usedChars };

        currentGuess.split('').forEach((char, index) => {
          if (solution[index] === char) {
            updatedChars[char] = ANSWER_STATUS.CORRECT;
          } else if (solution.includes(char)) {
            updatedChars[char] = ANSWER_STATUS.PRESENT;
          } else {
            updatedChars[char] = ANSWER_STATUS.ABSENT;
          }
        });

        setUsedChars(updatedChars);

        if (currentGuess === solution) {
          setIsGameOver(true);
        } else if (guesses.length + 1 === 6) {
          setIsGameOver(true);
        }

        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Not a valid word');
      setCurrentGuess('');
    }
  };

  const onBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const onChar = (char: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + char);
    }
  };

  return (
    <>
      <div>
        <Board
          guesses={guesses}
          currentGuess={currentGuess}
          solution={solution}
        />
        <Keyboard
          onChar={onChar}
          onEnter={onEnter}
          onBackspace={onBackspace}
          usedChars={usedChars}
        />
        {errorMessage && <div>{errorMessage}</div>}
        {isGameOver && (
          <div>
            {guesses[guesses.length - 1] === solution
              ? 'Congratulations! You won!'
              : `Game Over! The word was ${solution}.`}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
