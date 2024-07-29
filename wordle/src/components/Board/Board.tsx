import React from 'react';
import { BoardContainer, Cell, Row } from './styled';
import { ANSWER_STATUS } from '@/lib/consts';

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
}

const Board: React.FC<BoardProps> = ({ guesses, currentGuess, solution }) => {
  const getStatus = (char: string, index: number) => {
    if (!solution.includes(char)) return ANSWER_STATUS.ABSENT;
    if (solution[index] === char) return ANSWER_STATUS.CORRECT;
    return ANSWER_STATUS.PRESENT;
  };

  return (
    <BoardContainer>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <Row key={rowIndex}>
          {Array.from({ length: 5 }).map((_, colIndex) => {
            const char =
              guesses[rowIndex]?.[colIndex] ||
              (rowIndex === guesses.length ? currentGuess[colIndex] : '');
            const status =
              rowIndex < guesses.length ? getStatus(char, colIndex) : undefined;
            return (
              <Cell key={colIndex} status={status}>
                {char}
              </Cell>
            );
          })}
        </Row>
      ))}
    </BoardContainer>
  );
};

export default Board;
