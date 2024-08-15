import React from 'react';
import { KeyContainer } from './styled';

interface KeyProps {
  value: string;
  onClick: () => void;
  status?: string;
}

const Key: React.FC<KeyProps> = ({ value, onClick, status }) => {
  return (
    <KeyContainer onClick={onClick} status={status}>
      {value}
    </KeyContainer>
  );
};

export default Key;
