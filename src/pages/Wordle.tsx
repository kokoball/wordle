import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { Board, Keyboard, Spacing } from '@/components';
import { ANSWER_STATUS, DICTIONARY_API, WORDLE_STORAGE } from '@/lib/consts';
import { useNavigate, useParams } from 'react-router-dom';
import { clearWordleStorage, decrypt, formatTime } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Wrapper = styled.div`
  position: relative;
  color: #000;
  max-width: 100%;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Wordle = () => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [usedChars, setUsedChars] = useState<{ [key: string]: string }>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [gameData, setGameData] = useState<{
    win: number;
    total: number;
    winRate: number;
  }>({ win: 0, total: 0, winRate: 0 });

  const navigate = useNavigate();
  const { toast } = useToast();
  const params = useParams<{ word: string }>();
  const solution = decrypt(params.word)?.toUpperCase() || 'WORLD';

  const onEnter = async () => {
    if (currentGuess.length !== 5) return;

    try {
      const response = await axios.get(DICTIONARY_API + currentGuess);
      if (response.status === 200) {
        const guessesArr = [...guesses, currentGuess];
        setGuesses(guessesArr);
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

        localStorage.setItem(
          WORDLE_STORAGE.guesses,
          JSON.stringify(guessesArr)
        );
        localStorage.setItem(
          WORDLE_STORAGE.usedChars,
          JSON.stringify(usedChars)
        );

        if (currentGuess === solution || guessesArr.length === 6) {
          const data = localStorage.getItem(WORDLE_STORAGE.data);
          if (data !== null) {
            const parsedData = JSON.parse(data)[0];
            const win =
              currentGuess === solution ? parsedData.win + 1 : parsedData.win;
            const total = parsedData.total + 1;
            const winRate = Math.floor((win / total) * 100);

            setGameData({ win, total, winRate });

            localStorage.setItem(
              WORDLE_STORAGE.data,
              JSON.stringify([{ win, total, winRate }])
            );
          }

          setIsGameOver(true);
        }
      }
    } catch (error) {
      toast({
        title: '단어를 찾을 수 없습니다.',
        description: '옳바른 워들을 입력해 주세요.',
      });
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

  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault();
  };

  const checkTotalTime = () => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    return formatTime(elapsed);
  };

  useEffect(() => {
    const savedGuesses = localStorage.getItem(WORDLE_STORAGE.guesses);
    const savedUsedChars = localStorage.getItem(WORDLE_STORAGE.usedChars);
    const savedData = localStorage.getItem(WORDLE_STORAGE.data);

    if (savedGuesses) setGuesses(JSON.parse(savedGuesses));
    if (savedUsedChars) setUsedChars(JSON.parse(savedUsedChars));
    if (!savedData) {
      localStorage.setItem(
        'wordle-data',
        JSON.stringify([{ win: 0, total: 0, winRate: 0 }])
      );
    }

    if (
      currentGuess === solution ||
      (savedGuesses !== null && JSON.parse(savedGuesses).length === 6)
    ) {
      setIsGameOver(true);
    }

    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onEnter();
      if (e.key === 'Backspace') onBackspace();
      if (/^[a-zA-Z]$/.test(e.key)) onChar(e.key.toUpperCase());
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess]);

  return (
    <>
      <Wrapper>
        <Board
          guesses={guesses}
          currentGuess={currentGuess}
          solution={solution}
        />
        <Spacing size={50} />
        <Keyboard
          onChar={onChar}
          onEnter={onEnter}
          onBackspace={onBackspace}
          usedChars={usedChars}
        />
      </Wrapper>
      {isGameOver && (
        <Dialog defaultOpen={true}>
          <DialogContent
            className="sm:max-w-md"
            onPointerDownOutside={avoidDefaultDomBehavior}
            onInteractOutside={avoidDefaultDomBehavior}
          >
            <DialogHeader>
              <DialogTitle>게임 종료!</DialogTitle>
              <Spacing size={10} />
              <DialogDescription>
                이번 게임 플레이 시간 : {checkTotalTime()}
              </DialogDescription>
              <DialogDescription>승리 횟수 : {gameData.win}</DialogDescription>
              <DialogDescription>
                승률 :{' '}
                {gameData.total === 0
                  ? '0%'
                  : Math.floor((gameData.win / gameData.total) * 100) + '%'}
              </DialogDescription>
              <DialogDescription>
                시도 횟수 : {gameData.total}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    clearWordleStorage();
                    navigate(`/wordle`);
                  }}
                >
                  처음으로
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Wordle;
