import styled from 'styled-components';
import { ANSWER_STATUS } from '../../utils/consts';

export const BoardContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 10px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
`;

export const Cell = styled.div<{ status?: string }>`
  width: 50px;
  height: 50px;
  border: 2px solid #3a3a3c;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  background-color: ${({ status }) => {
    if (status === ANSWER_STATUS.CORRECT) return '#538d4e';
    if (status === ANSWER_STATUS.PRESENT) return '#b59f3b';
    if (status === ANSWER_STATUS.ABSENT) return '#3a3a3c';
    return '#d3d6da';
  }};
  color: #ffffff;
`;
