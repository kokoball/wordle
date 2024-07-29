import { useEffect, useState } from 'react';
import axios from 'axios';
import Board from '@/components/Board/Board';
import Keyboard from '@/components/Keyboard/Keyboard';
import { ANSWER_STATUS, DICTIONARY_API } from '@/lib/consts';
import { useNavigate, useParams } from 'react-router-dom';
import { decrypt, formatTime } from '@/lib/utils';
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

        localStorage.setItem('wordle-guesses', JSON.stringify(guessesArr));
        localStorage.setItem('wordle-usedChars', JSON.stringify(usedChars));

        if (currentGuess === solution || guessesArr.length === 1) {
          const data = localStorage.getItem('wordle-data');
          if (data !== null) {
            const parsedData = JSON.parse(data)[0];
            const win =
              currentGuess === solution ? parsedData.win + 1 : parsedData.win;
            const total = parsedData.total + 1;
            const winRate = Math.floor((win / total) * 100);

            setGameData({ win, total, winRate });

            localStorage.setItem(
              'wordle-data',
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
    const savedGuesses = localStorage.getItem('wordle-guesses');
    const savedUsedChars = localStorage.getItem('wordle-usedChars');
    const savedData = localStorage.getItem('wordle-data');

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
    console.log(gameData, 12345);
  }, [gameData]);

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
      </div>
      {isGameOver && (
        <Dialog defaultOpen={true}>
          <DialogContent
            className="sm:max-w-md"
            onPointerDownOutside={avoidDefaultDomBehavior}
            onInteractOutside={avoidDefaultDomBehavior}
          >
            <DialogHeader>
              <DialogTitle>게임 종료!</DialogTitle>
              <DialogDescription>
                <ul>
                  <li>이번 게임 플레이 시간 : {checkTotalTime()}</li>
                  <li>승리 횟수 : {gameData.win}</li>
                  <li>
                    승률 :{' '}
                    {gameData.total === 0
                      ? '0%'
                      : gameData.win / gameData.total + '%'}
                  </li>
                  <li>시도 횟수 : {gameData.total}</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/wordle`)}
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
