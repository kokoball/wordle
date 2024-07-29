import styled from 'styled-components';
import { ANSWER_STATUS } from '@/lib/consts';

export const KeyContainer = styled.div<{ status?: string }>`
  padding: 0 10px;
  min-width: 43px;
  height: 58px;
  border-radius: 4px;
  background-color: ${({ status }) => {
    if (status === ANSWER_STATUS.CORRECT) return '#538d4e';
    if (status === ANSWER_STATUS.PRESENT) return '#b59f3b';
    if (status === ANSWER_STATUS.ABSENT) return '#3a3a3c';
    return '#818384';
  }};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
`;
