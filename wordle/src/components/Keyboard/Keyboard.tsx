import React from 'react';
import { Key } from '@/components';
import { KEYS } from '@/lib/consts';
import { KeyboardContainer, Row } from './styled';

interface KeyboardProps {
  onChar: (char: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  usedChars: { [key: string]: string };
}

const Keyboard: React.FC<KeyboardProps> = ({
  onChar,
  onEnter,
  onBackspace,
  usedChars,
}) => {
  const handleKeyClick = (key: string) => {
    if (key === 'Enter') {
      onEnter();
    } else if (key === 'Backspace') {
      onBackspace();
    } else {
      onChar(key);
    }
  };

  return (
    <KeyboardContainer>
      {KEYS.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              onClick={() => handleKeyClick(key)}
              status={usedChars[key]}
            />
          ))}
        </Row>
      ))}
    </KeyboardContainer>
  );
};

export default Keyboard;
