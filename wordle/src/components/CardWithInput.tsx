import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import axios from 'axios';
import { DICTIONARY_API } from '@/lib/consts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { encrypt } from '@/lib/utils';

export default function CardWithForm({
  handleCloseCard,
}: {
  handleCloseCard: () => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const startGame = async () => {
    if (value.length !== 5) return;

    try {
      const response = await axios.get(DICTIONARY_API + value);
      if (response.status === 200) {
        navigate(`/wordle/${encrypt(value)}`);
      }
    } catch (error) {
      toast({
        title: '단어를 찾을 수 없습니다.',
        description: '옳바른 워들을 입력해 주세요.',
      });
      setValue('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z]*$/;

    if (inputValue === '' || regex.test(inputValue)) {
      setValue(inputValue);
      setError(null);
    } else {
      setError('알파벳만 입력할 수 있습니다.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      startGame();
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>워들 생성하기</CardTitle>
        <CardDescription>5글자로 된 워들을 입력해 주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input
              id="name"
              placeholder="예) React"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              maxLength={5}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCloseCard}>
          취소
        </Button>
        <Button onClick={startGame}>워들 시작하기</Button>
      </CardFooter>
    </Card>
  );
}
